
const express = require("express");
const axios = require("axios");

const Appointment = require("../models/Appointment");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

const AI_SERVICE_URL = "http://localhost:8000";
const BACKEND_URL = "http://localhost:5000";

// Temporary booking storage
const pendingBookings = new Map();

router.post(
    "/chat",
    protect,
    authorize("patient"),
    async (req, res) => {
        try {
            const patientId = String(req.user.id);
            const pendingBooking = pendingBookings.get(patientId);

            const confirmationMessage = req.body.message
                ?.trim()
                .toLowerCase();

            if (
                pendingBooking &&
                ["yes", "confirm", "confirmed", "book it", "okay", "ok"].includes(
                    confirmationMessage
                )
            ) {
                const {
                    doctorId,
                    doctor_name,
                    date,
                    time
                } = pendingBooking;

                const appointmentDate = new Date(
                    `${date}T${time}:00`
                );

                const appointment = await Appointment.create({
                    patient: req.user.id,
                    doctor: doctorId,
                    date: appointmentDate,
                    reason: "Booked through Medicare AI Assistant"
                });

                pendingBookings.delete(patientId);

                return res.status(200).json({
                    success: true,
                    answer:
                        `Your appointment with ${doctor_name} has been booked successfully for ${date} at ${time}.`,
                    appointment: {
                        id: appointment._id,
                        doctor: doctor_name,
                        date,
                        time,
                        status: appointment.status
                    }
                });
            }
            const response = await axios.post(
                `${AI_SERVICE_URL}/api/assistant/chat`,
                {
                    message: req.body.message,
                    history: req.body.history || []
                }
            );

            const aiResponse = response.data;

            if (
                aiResponse.success &&
                aiResponse.answer
            ) {
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

                // --------------------------------
                // BOOKING REQUEST
                // --------------------------------
                if (
                    bookingData &&
                    bookingData.action === "book_appointment"
                ) {
                    const {
                        doctorId,
                        date,
                        time,
                        doctor_name
                    } = bookingData;

                    const slotResponse = await axios.get(
                        `${BACKEND_URL}/api/slots`,
                        {
                            params: {
                                doctorId,
                                date
                            }
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
                                    : `Sorry, there are no available slots with ${doctor_name} on ${date}. Please choose another date.`
                        });
                    }

                    // Save pending booking for this patient
                    pendingBookings.set(
                        String(req.user.id),
                        {
                            doctorId,
                            doctor_name,
                            date,
                            time
                        }
                    );

                    return res.status(200).json({
                        success: true,
                        answer:
                            `Dr. ${doctor_name.replace(/^Dr\.\s*/i, "")} is available on ${date} at ${time}. Would you like me to book this appointment?`,
                        booking: {
                            action: "book_appointment",
                            doctorId,
                            doctor_name,
                            date,
                            time,
                            needs_confirmation: true
                        }
                    });
                }

                // --------------------------------
                // CONFIRM BOOKING
                // --------------------------------
                if (
                    bookingData &&
                    bookingData.action === "confirm_booking"
                ) {
                    const patientId = String(req.user.id);

                    const pendingBooking =
                        pendingBookings.get(patientId);

                    if (!pendingBooking) {
                        return res.status(200).json({
                            success: true,
                            answer:
                                "I couldn't find a pending appointment to confirm. Please tell me the doctor, date, and time again."
                        });
                    }

                    const {
                        doctorId,
                        doctor_name,
                        date,
                        time
                    } = pendingBooking;

                    // Create appointment date with selected time
                    const appointmentDate = new Date(
                        `${date}T${time}:00`
                    );

                    const appointment =
                        await Appointment.create({
                            patient: req.user.id,
                            doctor: doctorId,
                            date: appointmentDate,
                            reason: "Booked through Medicare AI Assistant"
                        });

                    // Remove pending booking
                    pendingBookings.delete(patientId);

                    return res.status(200).json({
                        success: true,
                        answer:
                            `Your appointment with ${doctor_name} has been booked successfully for ${date} at ${time}.`,
                        appointment: {
                            id: appointment._id,
                            doctor: doctor_name,
                            date,
                            time,
                            status: appointment.status
                        }
                    });
                }
            }

            return res.status(200).json(aiResponse);

        } catch (error) {
            console.error(
                "AI Assistant Service Error:",
                error.response?.data || error.message
            );

            res.status(500).json({
                success: false,
                message: "AI Assistant service is unavailable"
            });
        }
    }
);

module.exports = router;
