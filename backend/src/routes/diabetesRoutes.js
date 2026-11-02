const authorizeRoles = require("../middleware/authorizeRoles");
const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  diabetesPrediction,
  getPatientPredictions
} = require("../controllers/diabetesController");

const router = express.Router();

router.post(
  "/predict",
  protect,
  authorizeRoles("patient", "doctor"),
  diabetesPrediction
);

router.get(
  "/predictions/:patientId",
  protect,
  authorizeRoles("patient", "doctor"),
  getPatientPredictions
);

module.exports = router;
