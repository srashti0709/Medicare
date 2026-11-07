
const Prediction = require("../models/predictionModel");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { predictKidneyDisease } = require("../services/aiService");

const authorizePatientAccess = async (req, patientId) => {
    if (req.user.role === "patient") {
        return req.user.id === patientId;
    }

    if (req.user.role === "doctor") {
    const doctor = await Doctor.findOne({ user: req.user.id });

    console.log("Doctor profile found:", !!doctor);

    if (!doctor) return false;

    // TEMPORARY DIAGNOSTIC
    const patientAppointments = await Appointment.find({
        patient: patientId
    }).select("patient doctor status date");

    console.log("Appointments for selected patient:", patientAppointments);

    const appointments = await Appointment.find({
        patient: patientId,
        doctor: doctor._id
    }).select("patient doctor status");

    console.log("Selected patient ID:", patientId);
    console.log("Logged-in doctor ID:", doctor._id);
    console.log("Matching appointments:", appointments);

    return appointments.some(
        appointment => ["confirmed", "completed"].includes(appointment.status)
    );
}

    return false;
};

const kidneyPrediction = async (req, res) => {
    try {
        const {
            patient,
            age,
            bp,
            sg,
            al,
            su,
            rbc,
            pc,
            pcc,
            ba,
            bgr,
            bu,
            sc,
            sod,
            pot,
            hemo,
            pcv,
            wbcc,
            rbcc,
            htn,
            dm,
            cad,
            appet,
            pe,
            ane
        } = req.body;

        if (
            age === undefined ||
            bp === undefined ||
            sg === undefined ||
            al === undefined ||
            su === undefined ||
            !rbc ||
            !pc ||
            !pcc ||
            !ba ||
            bgr === undefined ||
            bu === undefined ||
            sc === undefined ||
            sod === undefined ||
            pot === undefined ||
            hemo === undefined ||
            pcv === undefined ||
            wbcc === undefined ||
            rbcc === undefined ||
            !htn ||
            !dm ||
            !cad ||
            !appet ||
            !pe ||
            !ane
        ) {
            return res.status(400).json({
                message: "All kidney disease prediction fields are required"
            });
        }

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

        const result = await predictKidneyDisease({
            age,
            bp,
            sg,
            al,
            su,
            rbc,
            pc,
            pcc,
            ba,
            bgr,
            bu,
            sc,
            sod,
            pot,
            hemo,
            pcv,
            wbcc,
            rbcc,
            htn,
            dm,
            cad,
            appet,
            pe,
            ane
        });

        const savedPrediction = await Prediction.create({
            patient: patientId,
            disease: "kidney",
            prediction: result.prediction,
            probability: result.probability
        });

        res.status(200).json({
            success: true,
            data: result,
            predictionId: savedPrediction._id
        });

    } catch (error) {
        console.error("Kidney Prediction Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to generate kidney disease prediction"
        });
    }
};

const getPatientKidneyPredictions = async (req, res) => {
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
            disease: "kidney"
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: predictions
        });

    } catch (error) {
        console.error("Get Kidney Predictions Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch kidney prediction history"
        });
    }
};

module.exports = {
    kidneyPrediction,
    getPatientKidneyPredictions
};
