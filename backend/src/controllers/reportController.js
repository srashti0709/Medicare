
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const { analyzeHealthReport } = require("../services/reportAIService");
const ReportAnalysis = require("../models/ReportAnalysis");

const analyzeReport = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No report uploaded",
            });
        }

        let reportText = "";

        if (req.file.mimetype === "application/pdf") {
            const fileBuffer = fs.readFileSync(req.file.path);
            const parser = new PDFParse({ data: fileBuffer });
            const pdfData = await parser.getText();
            reportText = pdfData.text;
        } else {
            return res.status(400).json({
                success: false,
                message: "Only PDF reports are supported for now",
            });
        }

        if (!reportText.trim()) {
            return res.status(400).json({
                success: false,
                message: "Could not extract text from the report",
            });
        }

        // Send extracted text to the AI service.
        const result = await analyzeHealthReport(reportText);

        if (!result.success || !result.data) {
            return res.status(502).json({
                success: false,
                message: result.message || "AI report analysis failed",
            });
        }

        // Save the successful analysis for this patient.
        const savedAnalysis = await ReportAnalysis.create({
            patient: req.user.id,
            originalFilename: req.file.originalname,
            reportText,
            summary: result.data.summary || "",
            keyFindings: result.data.key_findings || [],
            normalValues: result.data.normal_values || [],
            abnormalValues: result.data.abnormal_values || [],
            questionsToDiscuss: result.data.questions_to_discuss || [],
        });

        return res.status(200).json({
            ...result,
            data: {
                ...result.data,
                report_text: reportText,
                report_id: savedAnalysis._id,
                saved_at: savedAnalysis.createdAt,
            },
        });

    } catch (error) {
        console.error("Health Report Analysis Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to analyze and save health report",
        });
    } finally {
        if (req.file?.path) {
            try {
                await fs.promises.unlink(req.file.path);
                console.log("Temporary report file deleted.");
            } catch (cleanupError) {
                console.error("Report cleanup failed:", cleanupError.message);
            }
        }
    }
};

module.exports = { analyzeReport };
