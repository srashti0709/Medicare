const Prediction = require("../models/predictionModel");

const { predictKidneyDisease } = require("../services/aiService");


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
            !patient ||
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
            patient,
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
        console.error(
            "Kidney Prediction Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to generate kidney disease prediction"
        });
    }
};


const getPatientKidneyPredictions = async (req, res) => {
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
        console.error(
            "Get Kidney Predictions Error:",
            error.message
        );

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