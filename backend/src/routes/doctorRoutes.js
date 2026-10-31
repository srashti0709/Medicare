const express = require("express");

const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  toggleDoctorAvailability,
  getMyDoctorProfile,
  updateMyDoctorProfile,
} = require("../controllers/doctorController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin"),
  createDoctor
);

router.get("/", getAllDoctors);
router.get(
  "/my-profile",
  protect,
  authorize("doctor"),
  getMyDoctorProfile
);

router.patch(
  "/my-profile",
  protect,
  authorize("doctor"),
  updateMyDoctorProfile
);
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateDoctor
);
router.patch(
  "/:id/toggle-availability",
  protect,
  authorize("admin"),
  toggleDoctorAvailability
);
router.get("/:id", getDoctorById);

module.exports = router;