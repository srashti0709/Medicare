const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const DoctorSchedule = require("../models/DoctorSchedule");
const { bookAppointment } = require("../services/appointmentService");
const User = require("../models/User");
const createAppointment = async (req, res) => {
  try {
    const { doctor, date, reason } = req.body;

    if (!doctor || !date) {
      return res.status(400).json({
        message: "Doctor and appointment date are required",
      });
    }

    const appointment = await bookAppointment({
      patientId: req.user.id,
      doctorId: doctor,
      date,
      reason,
    });

    const populatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate("patient", "name email")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      });

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment: populatedAppointment,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to book appointment",
    });
  }
};
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user.id,
    })
      .populate("patient", "name email")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ date: 1 });

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Make sure this appointment belongs to the logged-in patient
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You cannot cancel this appointment",
      });
    }

    // Prevent cancelling already completed/cancelled appointments
    if (
      appointment.status === "completed" ||
      appointment.status === "cancelled"
    ) {
      return res.status(400).json({
        message: `Appointment is already ${appointment.status}`,
      });
    }

    appointment.status = "cancelled";

    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel appointment",
      error: error.message,
    });
  }
};
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ date: 1 });

    res.status(200).json({
      message: "All appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status",
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Doctor can update only their own appointments
    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({
        user: req.user.id,
      });

      if (!doctor) {
        return res.status(404).json({
          message: "Doctor profile not found",
        });
      }

      if (appointment.doctor.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          message: "You can only update your own appointments",
        });
      }
    }

    appointment.status = status;

    await appointment.save();

    const updatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate("patient", "name email")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      });

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update appointment status",
      error: error.message,
    });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user.id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    const appointments = await Appointment.find({
      doctor: doctor._id,
    })
      .populate("patient", "name email")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ date: 1 });

    res.status(200).json({
      message: "Doctor appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch doctor appointments",
      error: error.message,
    });
  }
};
const addConsultationNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || !notes.trim()) {
      return res.status(400).json({
        message: "Consultation notes are required",
      });
    }

    const appointment = await Appointment.findById(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    const doctor = await Doctor.findOne({
      user: req.user.id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    if (
      appointment.doctor.toString() !==
      doctor._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only update your own appointments",
      });
    }

    appointment.notes = notes.trim();

    await appointment.save();

    const updatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate("patient", "name email")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      });

    res.status(200).json({
      message: "Consultation notes saved successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save consultation notes",
      error: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getDoctorAppointments,
  addConsultationNotes,
};