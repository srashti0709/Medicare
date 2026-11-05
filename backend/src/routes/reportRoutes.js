
const express = require("express");
const multer = require("multer");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
    analyzeReport,
    getMyReportHistory,
    askReportQuestion,
} = require("../controllers/reportController");

const router = express.Router();

const upload = multer({
    dest: "uploads/reports/",
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        const isPDF =
            file.mimetype === "application/pdf" &&
            file.originalname.toLowerCase().endsWith(".pdf");

        if (!isPDF) {
            return cb(new Error("Only PDF reports are allowed."));
        }

        cb(null, true);
    },
});

// Get saved reports for the authenticated patient.
router.get(
    "/history",
    protect,
    authorizeRoles("patient"),
    getMyReportHistory
);

// Upload and analyze a new report.
router.post(
    "/upload",
    protect,
    authorizeRoles("patient"),
    upload.single("report"),
    analyzeReport
);
router.post(
    "/:reportId/chat",
    protect,
    authorizeRoles("patient"),
    askReportQuestion
);

module.exports = router;
