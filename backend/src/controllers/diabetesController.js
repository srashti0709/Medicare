
const Prediction = require("../models/predictionModel");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { predictDiabetes } = require("../services/aiService");

// Check whether the logged-in user can access this patient's records
const authorizePatientAccess = async (req, patientId) => {
    if (req.user.role === "patient") {
        return req.user.id === patientId;
    }

    if (req.user.role === "doctor") {
        const doctor = await Doctor.findOne({ user: req.user.id });

        if (!doctor) return false;

        const appointment = await Appointment.findOne({
            patient: patientId,
            doctor: doctor._id,
            status: { $in: ["confirmed", "completed"] }
        });

        return !!appointment;
    }

    return false;
};

// Diabetes Prediction
const diabetesPrediction = async (req, res) => {
    try {
        const {
            patient,
            Pregnancies,
            Glucose,
            BloodPressure,
            SkinThickness,
            Insulin,
            BMI,
            DiabetesPedigreeFunction,
            Age
        } = req.body;

        const patientId =
            req.user.role === "patient" ? req.user.id : patient;

        if (!patientId) {
            return res.status(400).json({
                message: "Patient ID is required"
            });
        }

        const hasAccess = await authorizePatientAccess(req, patientId);

        if (!hasAccess) {
            return res.status(403).json({
                message: "You are not authorized to access this patient's records."
            });
        }

        if (
            Pregnancies === undefined ||
            Glucose === undefined ||
            BloodPressure === undefined ||
            SkinThickness === undefined ||
            Insulin === undefined ||
            BMI === undefined ||
            DiabetesPedigreeFunction === undefined ||
            Age === undefined
        ) {
            return res.status(400).json({
                message: "All diabetes prediction fields are required"
            });
        }

        const result = await predictDiabetes({
            Pregnancies,
            Glucose,
            BloodPressure,
            SkinThickness,
            Insulin,
            BMI,
            DiabetesPedigreeFunction,
            Age
        });

        const savedPrediction = await Prediction.create({
            patient: patientId,
            disease: "diabetes",
            prediction: result.prediction,
            probability: result.probability,
            threshold: result.threshold
        });

        res.status(200).json({
            success: true,
            data: result,
            predictionId: savedPrediction._id
        });

    } catch (error) {
        console.error("Diabetes Prediction Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to generate diabetes prediction"
        });
    }
};

// Get Patient Diabetes History
const getPatientPredictions = async (req, res) => {
    try {
        const { patientId } = req.params;

        const hasAccess = await authorizePatientAccess(req, patientId);

        if (!hasAccess) {
            return res.status(403).json({
                message: "You are not authorized to access this patient's records."
            });
        }

        const predictions = await Prediction.find({
            patient: patientId,
            disease: "diabetes"
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: predictions
        });

    } catch (error) {
        console.error("Get Predictions Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch prediction history"
        });
    }
};

module.exports = {
    diabetesPrediction,
    getPatientPredictions
};
