const express = require("express");

const {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getDoctorAppointments,
  addConsultationNotes,
} = require("../controllers/appointmentController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("patient"),
  createAppointment
);
router.get(
  "/doctor",
  protect,
  authorize("doctor"),
  getDoctorAppointments
);
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "doctor"),
  updateAppointmentStatus
);
router.patch(
  "/:id/notes",
  protect,
  authorize("doctor"),
  addConsultationNotes
);

router.get(
  "/my",
  protect,
  authorize("patient"),
  getMyAppointments
);
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllAppointments
);


router.patch(
  "/:id/cancel",
  protect,
  authorize("patient"),
  cancelAppointment
);

module.exports = router;