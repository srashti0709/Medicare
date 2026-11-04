const mongoose = require("mongoose");

const pendingBookingSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },

        doctorName: {
            type: String,
            trim: true,
            required: true,
        },

        date: {
            type: String,
            required: true,
        },

        time: {
            type: String,
            required: true,
        },

        reason: {
            type: String,
            trim: true,
            default: "Booked through Medicare AI Assistant",
        },

        expiresAt: {
            type: Date,
            required: true,
            index: {
                expires: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

pendingBookingSchema.index({ patient: 1 });

module.exports = mongoose.model("PendingBooking", pendingBookingSchema);