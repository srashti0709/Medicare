const express = require("express");

const {
  kidneyPrediction,
  getPatientKidneyPredictions
} = require("../controllers/kidneyController");

const router = express.Router();

router.post("/predict", kidneyPrediction);

router.get(
  "/predictions/:patientId",
  getPatientKidneyPredictions
);

module.exports = router;