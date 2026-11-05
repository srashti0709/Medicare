
const axios = require("axios");
const { AI_SERVICE_URL } = require("../config/serviceConfig");

const analyzeHealthReport = async (reportText) => {
    try {
        const response = await axios.post(
            `${AI_SERVICE_URL}/api/report/analyze`,
            {
                report_text: reportText,
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "AI Report Service Error:",
            error.response?.data || error.message
        );

        throw new Error("AI health report analysis service is unavailable");
    }
};

const askAboutHealthReport = async (reportText, question) => {
    try {
        const response = await axios.post(
            `${AI_SERVICE_URL}/api/report/chat`,
            {
                report_text: reportText,
                question,
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "AI Report Chat Service Error:",
            error.response?.data || error.message
        );

        throw new Error("AI report chat service is unavailable");
    }
};

module.exports = {
    analyzeHealthReport,
    askAboutHealthReport,
};
