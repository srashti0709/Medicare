
const Appointment = require("../models/Appointment");
const Prediction = require("../models/predictionModel");
const ReportAnalysis = require("../models/ReportAnalysis");

const getPatientHealthTimeline = async (req, res) => {
    try {
        const patientId = req.user.id;

        const [appointments, predictions, reports] = await Promise.all([
            Appointment.find({ patient: patientId })
                .populate({
                    path: "doctor",
                    populate: { path: "user", select: "name" },
                })
                .sort({ date: -1 }),

            Prediction.find({ patient: patientId })
                .sort({ createdAt: -1 }),

            ReportAnalysis.find({ patient: patientId })
                .select("-reportText")
                .sort({ createdAt: -1 }),
        ]);

        const appointmentEvents = appointments.map((appointment) => ({
            id: appointment._id,
            type: "appointment",
            title: appointment.doctor?.user?.name
                ? `Appointment with Dr. ${appointment.doctor.user.name}`
                : "Doctor Appointment",
            date: appointment.date,
            status: appointment.status,
            description: appointment.reason || "",
            notes: appointment.notes || "",
            createdAt: appointment.createdAt,
        }));

        const predictionEvents = predictions.map((prediction) => ({
            id: prediction._id,
            type: "screening",
            title:
                prediction.disease === "diabetes"
                    ? "Diabetes Screening"
                    : "Kidney Screening",
            date: prediction.createdAt,
            disease: prediction.disease,
            prediction: prediction.prediction,
            probability: prediction.probability,
            threshold: prediction.threshold ?? null,
            createdAt: prediction.createdAt,
        }));

        const reportEvents = reports.map((report) => ({
            id: report._id,
            type: "report",
            title: "Health Report Analysis",
            date: report.createdAt,
            filename: report.originalFilename,
            summary: report.summary,
            keyFindings: report.keyFindings,
            normalValues: report.normalValues,
            abnormalValues: report.abnormalValues,
            questionsToDiscuss: report.questionsToDiscuss,
            createdAt: report.createdAt,
        }));

        const timeline = [
            ...appointmentEvents,
            ...predictionEvents,
            ...reportEvents,
        ].sort(
            (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        return res.status(200).json({
            success: true,
            count: timeline.length,
            data: timeline,
        });
    } catch (error) {
        console.error("Health Timeline Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch health timeline",
        });
    }
};

module.exports = { getPatientHealthTimeline };
