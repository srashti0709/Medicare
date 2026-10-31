const express = require("express");

const {
  diabetesPrediction,
  getPatientPredictions
} = require("../controllers/diabetesController");

const router = express.Router();

router.post("/predict", diabetesPrediction);

router.get("/predictions/:patientId", getPatientPredictions);

module.exports = router;