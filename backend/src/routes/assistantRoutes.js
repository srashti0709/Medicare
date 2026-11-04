
const express = require("express");
const axios = require("axios");

const { bookAppointment } = require("../services/appointmentService");
const PendingBooking = require("../models/PendingBooking");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

const AI_SERVICE_URL = "http://localhost:8000";
const BACKEND_URL = "http://localhost:5000";

const PENDING_BOOKING_EXPIRY = 10 * 60 * 1000;

router.post(
    "/chat",
    protect,
    authorize("patient"),
    async (req, res) => {
        try {
            const patientId = req.user.id;

            const confirmationMessage = req.body.message
                ?.trim()
                .toLowerCase();

            // Find this patient's active pending booking
            const pendingBooking = await PendingBooking.findOne({
                patient: patientId,
                expiresAt: { $gt: new Date() },
            });

            // Confirm pending booking through a direct confirmation message
            if (
                pendingBooking &&
                ["yes", "confirm", "confirmed", "book it", "okay", "ok"].includes(
                    confirmationMessage
                )
            ) {
                const {
                    doctor,
                    doctorName,
                    date,
                    time,
                    reason,
                } = pendingBooking;

                const appointmentDate = new Date(`${date}T${time}:00`);

                const appointment = await bookAppointment({
                    patientId,
                    doctorId: doctor,
                    date: appointmentDate,
                    reason,
                });

                await PendingBooking.deleteOne({
                    _id: pendingBooking._id,
                    patient: patientId,
                });

                return res.status(200).json({
                    success: true,
                    answer: `Your appointment with ${doctorName} has been booked successfully for ${date} at ${time}.`,
                    appointment: {
                        id: appointment._id,
                        doctor: doctorName,
                        date,
                        time,
                        status: appointment.status,
                    },
                });
            }

            const response = await axios.post(
                `${AI_SERVICE_URL}/api/assistant/chat`,
                {
                    message: req.body.message,
                    history: req.body.history || [],
                }
            );

            const aiResponse = response.data;

            if (aiResponse.success && aiResponse.answer) {
                let bookingData = null;

                try {
                    const cleanedAnswer = aiResponse.answer
                        .replace(/```json/g, "")
                        .replace(/```/g, "")
                        .trim();

                    bookingData = JSON.parse(cleanedAnswer);
                } catch (error) {
                    // Normal AI response
                }

                // BOOKING REQUEST
                if (
                    bookingData &&
                    bookingData.action === "book_appointment"
                ) {
                    const {
                        doctorId,
                        date,
                        time,
                        doctor_name,
                    } = bookingData;

                    const slotResponse = await axios.get(
                        `${BACKEND_URL}/api/slots`,
                        {
                            params: {
                                doctorId,
                                date,
                            },
                        }
                    );

                    const availableSlots =
                        slotResponse.data.slots || [];

                    if (!availableSlots.includes(time)) {
                        return res.status(200).json({
                            success: true,
                            answer:
                                availableSlots.length > 0
                                    ? `Sorry, the ${time} slot with ${doctor_name} on ${date} is unavailable. Available slots are: ${availableSlots.join(", ")}. Which one would you like?`
                                    : `Sorry, there are no available slots with ${doctor_name} on ${date}. Please choose another date.`,
                        });
                    }

                    // Save pending booking in MongoDB for 10 minutes
                    await PendingBooking.findOneAndUpdate(
                        { patient: patientId },
                        {
                            $set: {
                                doctor: doctorId,
                                doctorName: doctor_name,
                                date,
                                time,
                                reason: "Booked through Medicare AI Assistant",
                                expiresAt: new Date(
                                    Date.now() + PENDING_BOOKING_EXPIRY
                                ),
                            },
                        },
                        {
                            upsert: true,
                            new: true,
                            runValidators: true,
                        }
                    );

                    return res.status(200).json({
                        success: true,
                        answer: `Dr. ${doctor_name.replace(/^Dr\.\s*/i, "")} is available on ${date} at ${time}. Would you like me to book this appointment?`,
                        booking: {
                            action: "book_appointment",
                            doctorId,
                            doctor_name,
                            date,
                            time,
                            needs_confirmation: true,
                        },
                    });
                }

                // CONFIRM BOOKING
                if (
                    bookingData &&
                    bookingData.action === "confirm_booking"
                ) {
                    const currentPendingBooking =
                        await PendingBooking.findOne({
                            patient: patientId,
                            expiresAt: { $gt: new Date() },
                        });

                    if (!currentPendingBooking) {
                        return res.status(200).json({
                            success: true,
                            answer:
                                "I couldn't find an active pending appointment to confirm. Please tell me the doctor, date, and time again.",
                        });
                    }

                    const {
                        doctor,
                        doctorName,
                        date,
                        time,
                        reason,
                    } = currentPendingBooking;

                    const appointmentDate = new Date(`${date}T${time}:00`);

                    const appointment = await bookAppointment({
                        patientId,
                        doctorId: doctor,
                        date: appointmentDate,
                        reason,
                    });

                    // Remove pending booking after successful appointment creation
                    await PendingBooking.deleteOne({
                        _id: currentPendingBooking._id,
                        patient: patientId,
                    });

                    return res.status(200).json({
                        success: true,
                        answer: `Your appointment with ${doctorName} has been booked successfully for ${date} at ${time}.`,
                        appointment: {
                            id: appointment._id,
                            doctor: doctorName,
                            date,
                            time,
                            status: appointment.status,
                        },
                    });
                }
            }

            return res.status(200).json(aiResponse);

        } catch (error) {
            console.error(
                "AI Assistant Service Error:",
                error.response?.data || error.message
            );

            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.statusCode
                    ? error.message
                    : "AI Assistant service is unavailable",
            });
        }
    }
);

module.exports = router;
