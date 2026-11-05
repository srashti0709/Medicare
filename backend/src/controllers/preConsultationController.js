
const mongoose = require("mongoose");

const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const ReportAnalysis = require("../models/ReportAnalysis");
const Prediction = require("../models/predictionModel");

const getDoctorPreConsultationSummary = async (req, res) => {
    try {
        const { id: appointmentId } = req.params;

        if (!mongoose.isValidObjectId(appointmentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment ID",
            });
        }

        // Find the logged-in doctor's profile.
        const doctor = await Doctor.findOne({
            user: req.user.id,
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found",
            });
        }

        // Only the assigned doctor can access confirmed/completed appointments.
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            doctor: doctor._id,
            status: { $in: ["confirmed", "completed"] },
        }).populate("patient", "name email");

        // Return 404 for both missing and inaccessible appointments.
        if (!appointment || !appointment.patient) {
            return res.status(404).json({
                success: false,
                message: "Eligible appointment not found",
            });
        }

        const patientId = appointment.patient._id;

        // Avoid showing records created after a past appointment.
        const now = new Date();
        const appointmentDate = new Date(appointment.date);

        const cutoffDate =
            appointmentDate < now ? appointmentDate : now;

        const [reports, screenings, previousAppointments] =
            await Promise.all([
                ReportAnalysis.find({
                    patient: patientId,
                    createdAt: { $lte: cutoffDate },
                })
                    .select(
                        "originalFilename summary keyFindings normalValues abnormalValues questionsToDiscuss createdAt"
                    )
                    .sort({ createdAt: -1 })
                    .limit(10)
                    .lean(),

                Prediction.find({
                    patient: patientId,
                    createdAt: { $lte: cutoffDate },
                })
                    .select(
                        "disease prediction probability threshold createdAt"
                    )
                    .sort({ createdAt: -1 })
                    .limit(10)
                    .lean(),

                Appointment.find({
                    patient: patientId,
                    doctor: doctor._id,
                    status: "completed",
                    date: { $lt: appointment.date },
                    _id: { $ne: appointment._id },
                })
                    .select("date reason notes status createdAt")
                    .sort({ date: -1 })
                    .limit(5)
                    .lean(),
            ]);

        return res.status(200).json({
            success: true,
            message: "Pre-consultation summary fetched successfully",

            data: {
                appointment: {
                    id: appointment._id,
                    date: appointment.date,
                    status: appointment.status,
                    reason: appointment.reason || "",
                },

                patient: {
                    id: patientId,
                    name: appointment.patient.name,
                    email: appointment.patient.email,
                },

                reports,
                screenings,
                previousAppointments,
            },
        });
    } catch (error) {
        console.error(
            "Pre-consultation summary error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch pre-consultation summary",
        });
    }
};

module.exports = {
    getDoctorPreConsultationSummary,
};
