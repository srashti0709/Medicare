
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const slotRoutes = require("./routes/slotRoutes");
const diabetesRoutes = require("./routes/diabetesRoutes");
const kidneyRoutes = require("./routes/kidneyRoutes");
const reportRoutes = require("./routes/reportRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
const healthTimelineRoutes = require("./routes/healthTimelineRoutes");

const {
    notFound,
    errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

const allowedOrigins = (
    process.env.FRONTEND_URLS ||
    "http://localhost:5173,http://localhost:5174"
)
    .split(",")
    .map((url) => url.trim().replace(/\/+$/, ""));

app.use(
    cors({
        origin: allowedOrigins,
    })
);
app.use(express.json());

app.use("/api/slots", slotRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Medicare API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/diabetes", diabetesRoutes);
app.use("/api/kidney", kidneyRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/health-timeline", healthTimelineRoutes);

// Handle unknown routes
app.use(notFound);

// Centralized error handler (must remain last)
app.use(errorHandler);

module.exports = app;
