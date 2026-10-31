const DoctorSchedule = require("../models/DoctorSchedule");
const Doctor = require("../models/Doctor");

// Create or update doctor schedule

const createOrUpdateSchedule = async (req, res) => {
  try {
    const {
      workingDays,
      startTime,
      endTime,
      slotDuration,
    } = req.body;

    if (
      !Array.isArray(workingDays) ||
      !startTime ||
      !endTime ||
      !slotDuration
    ) {
      return res.status(400).json({
        message:
          "Working days, start time, end time and slot duration are required",
      });
    }

    if (workingDays.length === 0) {
      return res.status(400).json({
        message: "Select at least one working day",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        message: "End time must be after start time",
      });
    }

    if (Number(slotDuration) < 5) {
      return res.status(400).json({
        message: "Slot duration must be at least 5 minutes",
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

    let schedule = await DoctorSchedule.findOne({
      doctor: doctor._id,
    });

    if (schedule) {
      schedule.workingDays = workingDays;
      schedule.startTime = startTime;
      schedule.endTime = endTime;
      schedule.slotDuration = Number(slotDuration);

      await schedule.save();
    } else {
      schedule = await DoctorSchedule.create({
        doctor: doctor._id,
        workingDays,
        startTime,
        endTime,
        slotDuration: Number(slotDuration),
      });
    }

    res.status(200).json({
      message: "Doctor schedule saved successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save doctor schedule",
      error: error.message,
    });
  }
};

// Get logged-in doctor's schedule

const getMySchedule = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user.id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    const schedule = await DoctorSchedule.findOne({
      doctor: doctor._id,
    });

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found",
      });
    }

    res.status(200).json({
      message: "Doctor schedule fetched successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch doctor schedule",
      error: error.message,
    });
  }
};

module.exports = {
  createOrUpdateSchedule,
  getMySchedule,
};