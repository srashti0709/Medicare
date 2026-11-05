
const express = require("express");
const Joi = require("joi");

const {
    createAppointment,
    getMyAppointments,
    cancelAppointment,
    getAllAppointments,
    updateAppointmentStatus,
    getDoctorAppointments,
    getDoctorEligiblePatients,
    addConsultationNotes,
} = require("../controllers/appointmentController");

const protect = require("../middleware/authMiddleware");
const {
    getDoctorPreConsultationSummary,
} = require("../controllers/preConsultationController");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

const appointmentSchema = Joi.object({
    doctor: Joi.string()
        .hex()
        .length(24)
        .required(),

    date: Joi.date()
        .iso()
        .required(),

    reason: Joi.string()
        .trim()
        .max(500)
        .allow("")
        .optional(),
});

router.post(
    "/",
    protect,
    authorize("patient"),
    validate(appointmentSchema),
    createAppointment
);

router.get(
    "/doctor",
    protect,
    authorize("doctor"),
    getDoctorAppointments
);
router.get(
    "/doctor/patients",
    protect,
    authorize("doctor"),
    getDoctorEligiblePatients
);
router.get(
    "/:id/pre-consultation",
    protect,
    authorize("doctor"),
    getDoctorPreConsultationSummary
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
