
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const {
    analyzeHealthReport,
    askAboutHealthReport,
} = require("../services/reportAIService");
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

        const result = await analyzeHealthReport(reportText);

        if (!result.success || !result.data) {
            return res.status(502).json({
                success: false,
                message: result.message || "AI report analysis failed",
            });
        }

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

// Fetch saved reports belonging to the logged-in patient.
const getMyReportHistory = async (req, res) => {
    try {
        const reports = await ReportAnalysis.find({
            patient: req.user.id,
        })
            .select(
                "originalFilename summary keyFindings normalValues abnormalValues questionsToDiscuss createdAt"
            )
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: reports.length,
            data: reports,
        });
    } catch (error) {
        console.error("Report History Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch report history",
        });
    }
};
// Answer a patient's question about their own saved health report.
const askReportQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        const { reportId } = req.params;

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a question.",
            });
        }

        const report = await ReportAnalysis.findOne({
            _id: reportId,
            patient: req.user.id,
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found.",
            });
        }

        const result = await askAboutHealthReport(
            report.reportText,
            question.trim()
        );

        if (!result.success) {
            return res.status(502).json({
                success: false,
                message: result.message || "AI could not answer the question.",
            });
        }

        return res.status(200).json({
            success: true,
            answer: result.answer,
            sources: result.sources || [],
        });
    } catch (error) {
        console.error("Report Question Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to answer your report question.",
        });
    }
};

module.exports = {
    analyzeReport,
    getMyReportHistory,
    askReportQuestion,
};