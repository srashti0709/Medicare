const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Department = require("../models/Department");
const Service = require("../models/Service");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalDepartments,
      totalServices,
    ] = await Promise.all([
      Doctor.countDocuments(),
      User.countDocuments({ role: "patient" }),
      Appointment.countDocuments(),
      Department.countDocuments(),
      Service.countDocuments(),
    ]);

    res.status(200).json({
      message: "Dashboard statistics fetched successfully",
      stats: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        totalDepartments,
        totalServices,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};
const getRecentAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      message: "Recent appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recent appointments",
      error: error.message,
    });
  }
};
const getDoctorDashboardStats = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user.id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    const today = new Date();

    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const [
      todayAppointments,
      upcomingAppointments,
      completedAppointments,
      uniquePatients,
    ] = await Promise.all([
      Appointment.countDocuments({
        doctor: doctor._id,
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      }),

      Appointment.countDocuments({
        doctor: doctor._id,
        date: {
          $gt: endOfToday,
        },
        status: {
          $in: ["pending", "confirmed"],
        },
      }),

      Appointment.countDocuments({
        doctor: doctor._id,
        status: "completed",
      }),

      Appointment.distinct("patient", {
        doctor: doctor._id,
      }),
    ]);

    res.status(200).json({
      message: "Doctor dashboard statistics fetched successfully",
      stats: {
        todayAppointments,
        upcomingAppointments,
        completedAppointments,
        totalPatients: uniquePatients.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch doctor dashboard statistics",
      error: error.message,
    });
  }
};
module.exports = {
  getDashboardStats,
  getRecentAppointments,
  getDoctorDashboardStats,
};