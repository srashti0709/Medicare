const express = require("express");

const {
  getAvailableSlots,
} = require("../controllers/slotController");

const router = express.Router();

// Get available appointment slots
router.get("/", getAvailableSlots);

module.exports = router;