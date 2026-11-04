
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const DoctorSchedule = require("../models/DoctorSchedule");
const User = require("../models/User");

const bookAppointment = async ({
    patientId,
    doctorId,
    date,
    reason,
}) => {
    const patient = await User.findById(patientId);

    if (!patient) {
        const error = new Error("Patient not found");
        error.statusCode = 404;
        throw error;
    }

    if (patient.isActive === false) {
        const error = new Error(
            "Your account has been deactivated. You cannot book an appointment."
        );
        error.statusCode = 403;
        throw error;
    }

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
        const error = new Error("Doctor not found");
        error.statusCode = 404;
        throw error;
    }

    if (!doctor.isAvailable) {
        const error = new Error("Doctor is currently unavailable");
        error.statusCode = 400;
        throw error;
    }

    const appointmentDate = new Date(date);

    if (isNaN(appointmentDate.getTime())) {
        const error = new Error("Invalid appointment date");
        error.statusCode = 400;
        throw error;
    }

    if (appointmentDate <= new Date()) {
        const error = new Error("Appointment date must be in the future");
        error.statusCode = 400;
        throw error;
    }

    const schedule = await DoctorSchedule.findOne({
        doctor: doctorId,
    });

    if (!schedule) {
        const error = new Error("Doctor schedule is not available");
        error.statusCode = 400;
        throw error;
    }

    const dayName = appointmentDate.toLocaleDateString("en-US", {
        weekday: "long",
    });

    if (!schedule.workingDays.includes(dayName)) {
        const error = new Error("Doctor is not available on this day");
        error.statusCode = 400;
        throw error;
    }

    const appointmentMinutes =
        appointmentDate.getHours() * 60 +
        appointmentDate.getMinutes();

    const [startHour, startMinute] = schedule.startTime
        .split(":")
        .map(Number);

    const [endHour, endMinute] = schedule.endTime
        .split(":")
        .map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (
        appointmentMinutes < startMinutes ||
        appointmentMinutes >= endMinutes
    ) {
        const error = new Error(
            "Appointment time is outside the doctor's working hours"
        );
        error.statusCode = 400;
        throw error;
    }

    const minutesFromStart = appointmentMinutes - startMinutes;

    if (minutesFromStart % schedule.slotDuration !== 0) {
        const error = new Error("Please select a valid appointment slot");
        error.statusCode = 400;
        throw error;
    }

    if (
        appointmentMinutes + schedule.slotDuration >
        endMinutes
    ) {
        const error = new Error(
            "Appointment slot exceeds doctor's working hours"
        );
        error.statusCode = 400;
        throw error;
    }

    const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        date: appointmentDate,
        status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
        const error = new Error(
            "This appointment slot is already booked"
        );
        error.statusCode = 409;
        throw error;
    }

    try {
        return await Appointment.create({
            patient: patientId,
            doctor: doctorId,
            date: appointmentDate,
            reason,
        });
    } catch (error) {
        if (error.code === 11000) {
            const conflictError = new Error(
                "This appointment slot is already booked"
            );
            conflictError.statusCode = 409;
            throw conflictError;
        }

        throw error;
    }
};

module.exports = {
    bookAppointment,
};
