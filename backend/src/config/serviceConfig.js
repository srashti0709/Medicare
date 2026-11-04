
const PORT = process.env.PORT || 5000;

const AI_SERVICE_URL = (
    process.env.AI_SERVICE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const BACKEND_URL = (
    process.env.BACKEND_URL || `http://localhost:${PORT}`
).replace(/\/+$/, "");

module.exports = {
    AI_SERVICE_URL,
    BACKEND_URL,
};
