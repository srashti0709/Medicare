
const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    getPatientHealthTimeline,
} = require("../controllers/healthTimelineController");

const router = express.Router();

router.get(
    "/",
    protect,
    authorizeRoles("patient"),
    getPatientHealthTimeline
);

module.exports = router;
