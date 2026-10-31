const express = require("express");

const {
  getProfile,
  updateProfile,
  getAllPatients,
  getPatientById,
  updatePatient,
  togglePatientStatus,
  deletePatient,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// ===============================
// Admin: Patient Management
// ===============================

// Get all patients
router.get(
  "/",
  protect,
  authorize("admin", "doctor"),
  getAllPatients
);

// Get patient by ID
router.get(
  "/patient/:id",
  protect,
  authorize("admin"),
  getPatientById
);

// Update patient
router.patch(
  "/patient/:id",
  protect,
  authorize("admin"),
  updatePatient
);

// Activate / Deactivate patient
router.patch(
  "/patient/:id/toggle-status",
  protect,
  authorize("admin"),
  togglePatientStatus
);

// Delete patient
router.delete(
  "/patient/:id",
  protect,
  authorize("admin"),
  deletePatient
);


// ===============================
// Profile
// ===============================

// Get own profile
router.get(
  "/profile",
  protect,
  authorize("patient", "admin"),
  getProfile
);

// Update own profile
router.patch(
  "/profile",
  protect,
  authorize("patient", "admin"),
  updateProfile
);


module.exports = router;