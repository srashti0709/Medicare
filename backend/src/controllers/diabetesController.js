const Prediction = require("../models/predictionModel");
const { predictDiabetes } = require("../services/aiService");


// -----------------------------------
// Diabetes Prediction
// -----------------------------------

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


        // Basic validation
        if (
            !patient ||
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


        // Send data to AI service
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


        // Return AI result
        const savedPrediction = await Prediction.create({
            patient: req.body.patient,
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

        console.error(
            "Diabetes Prediction Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to generate diabetes prediction"
        });
    }
};
const getPatientPredictions = async (req, res) => {
    try {
        const { patientId } = req.params;

        const predictions = await Prediction.find({
  patient: patientId,
  disease: "kidney"
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