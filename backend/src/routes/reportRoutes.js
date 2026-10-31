const express = require("express");
const multer = require("multer");

const {
    analyzeReport
} = require("../controllers/reportController");

const router = express.Router();

const upload = multer({
    dest: "uploads/reports/"
});

router.post(
    "/upload",
    upload.single("report"),
    analyzeReport
);

module.exports = router;