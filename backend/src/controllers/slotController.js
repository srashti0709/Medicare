const DoctorSchedule = require("../models/DoctorSchedule");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        message: "Doctor and date are required",
      });
    }

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    if (!doctor.isAvailable) {
      return res.status(400).json({
        message: "Doctor is currently unavailable",
      });
    }

    const schedule = await DoctorSchedule.findOne({
      doctor: doctorId,
    });

    if (!schedule) {
      return res.status(404).json({
        message: "Doctor schedule not found",
      });
    }

    const selectedDate = new Date(`${date}T00:00:00`);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (!schedule.workingDays.includes(dayName)) {
      return res.status(200).json({
        message: "Doctor is not available on this day",
        slots: [],
      });
    }

    const appointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: new Date(`${date}T00:00:00`),
        $lt: new Date(`${date}T23:59:59.999`),
      },
      status: {
        $ne: "cancelled",
      },
    });

    const bookedTimes = appointments.map((appointment) => {
      const appointmentDate = new Date(appointment.date);

      return appointmentDate.toTimeString().slice(0, 5);
    });

    const slots = [];

    const [startHour, startMinute] = schedule.startTime
      .split(":")
      .map(Number);

    const [endHour, endMinute] = schedule.endTime
      .split(":")
      .map(Number);

    let currentMinutes =
      startHour * 60 + startMinute;

    const endMinutes =
      endHour * 60 + endMinute;

    while (currentMinutes < endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;

      const time = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;

      if (!bookedTimes.includes(time)) {
        slots.push(time);
      }

      currentMinutes += schedule.slotDuration;
    }

    res.status(200).json({
      message: "Available slots fetched successfully",
      slots,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch available slots",
      error: error.message,
    });
  }
};

module.exports = {
  getAvailableSlots,
};