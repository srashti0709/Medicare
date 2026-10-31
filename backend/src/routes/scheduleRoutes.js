const express = require("express");

const {
  createOrUpdateSchedule,
  getMySchedule,
} = require("../controllers/scheduleController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Doctor creates or updates schedule
router.patch(
  "/my-schedule",
  protect,
  authorize("doctor"),
  createOrUpdateSchedule
);

// Doctor views own schedule
router.get(
  "/my-schedule",
  protect,
  authorize("doctor"),
  getMySchedule
);

module.exports = router;