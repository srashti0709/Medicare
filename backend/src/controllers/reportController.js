const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const { analyzeHealthReport } = require("../services/reportAIService");

const analyzeReport = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No report uploaded"
            });
        }

        let reportText = "";

        if (req.file.mimetype === "application/pdf") {
            const fileBuffer = fs.readFileSync(req.file.path);
            const parser = new PDFParse({
                data: fileBuffer
            });

            const pdfData = await parser.getText();

            reportText = pdfData.text;
        } else {
            return res.status(400).json({
                success: false,
                message: "Only PDF reports are supported for now"
            });
        }

        if (!reportText.trim()) {
            return res.status(400).json({
                success: false,
                message: "Could not extract text from the report"
            });
        }

        const result = await analyzeHealthReport(reportText);

        res.status(200).json({
            ...result,
            data: {
                ...result.data,
                report_text: reportText
            }
        });

    } catch (error) {
        console.error(
            "Health Report Analysis Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to analyze health report"
        });
    }
};

module.exports = {
    analyzeReport
};