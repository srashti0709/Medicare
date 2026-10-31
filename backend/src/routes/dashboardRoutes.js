const express = require("express");

const {
  getDashboardStats,
  getRecentAppointments,
  getDoctorDashboardStats,
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/stats",
  protect,
  authorize("admin"),
  getDashboardStats
);
router.get(
  "/recent-appointments",
  protect,
  authorize("admin"),
  getRecentAppointments
);
router.get(
  "/doctor-stats",
  protect,
  authorize("doctor"),
  getDoctorDashboardStats
);

module.exports = router;