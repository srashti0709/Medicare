const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const DoctorSchedule = require("../models/DoctorSchedule");
const User = require("../models/User");
const createAppointment = async (req, res) => {
  try {
    const { doctor, date, reason } = req.body;

    if (!doctor || !date) {
      return res.status(400).json({
        message: "Doctor and appointment date are required",
      });
    }

    // Check if patient account is active
    const patient = await User.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    if (patient.isActive === false) {
      return res.status(403).json({
        message:
          "Your account has been deactivated. You cannot book an appointment.",
      });
    }

    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    if (!doctorExists.isAvailable) {
      return res.status(400).json({
        message: "Doctor is currently unavailable",
      });
    }

    const appointmentDate = new Date(date);

    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        message: "Invalid appointment date",
      });
    }

    if (appointmentDate <= new Date()) {
      return res.status(400).json({
        message: "Appointment date must be in the future",
      });
    }

    const schedule = await DoctorSchedule.findOne({
      doctor,
    });

    if (!schedule) {
      return res.status(400).json({
        message: "Doctor schedule is not available",
      });
    }

    const dayName = appointmentDate.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );

    if (!schedule.workingDays.includes(dayName)) {
      return res.status(400).json({
        message: "Doctor is not available on this day",
      });
    }

    const hours = appointmentDate.getHours();
    const minutes = appointmentDate.getMinutes();

    const appointmentMinutes =
      hours * 60 + minutes;

    const [startHour, startMinute] =
      schedule.startTime.split(":").map(Number);

    const [endHour, endMinute] =
      schedule.endTime.split(":").map(Number);

    const startMinutes =
      startHour * 60 + startMinute;

    const endMinutes =
      endHour * 60 + endMinute;

    if (
      appointmentMinutes < startMinutes ||
      appointmentMinutes >= endMinutes
    ) {
      return res.status(400).json({
        message:
          "Appointment time is outside the doctor's working hours",
      });
    }

    const minutesFromStart =
      appointmentMinutes - startMinutes;

    if (
      minutesFromStart % schedule.slotDuration !==
      0
    ) {
      return res.status(400).json({
        message:
          "Please select a valid appointment slot",
      });
    }

    const appointmentEndMinutes =
      appointmentMinutes + schedule.slotDuration;

    if (appointmentEndMinutes > endMinutes) {
      return res.status(400).json({
        message:
          "Appointment slot exceeds doctor's working hours",
      });
    }

    const existingAppointment =
      await Appointment.findOne({
        doctor,
        date: appointmentDate,
        status: {
          $ne: "cancelled",
        },
      });

    if (existingAppointment) {
      return res.status(400).json({
        message:
          "This appointment slot is already booked",
      });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      date: appointmentDate,
      reason,
    });

    const populatedAppointment =
      await Appointment.findById(
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

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: populatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to book appointment",
      error: error.message,
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