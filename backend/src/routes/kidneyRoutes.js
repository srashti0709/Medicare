const authorizeRoles = require("../middleware/authorizeRoles");
const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  kidneyPrediction,
  getPatientKidneyPredictions
} = require("../controllers/kidneyController");

const router = express.Router();

router.post(
  "/predict",
  protect,
  authorizeRoles("patient", "doctor"),
  kidneyPrediction
);

router.get(
  "/predictions/:patientId",
  protect,
  authorizeRoles("patient", "doctor"),
  getPatientKidneyPredictions
);

module.exports = router;
