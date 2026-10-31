const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    disease: {
      type: String,
      enum: ["diabetes", "kidney"],
      required: true
    },

    prediction: {
      type: Number,
      required: true
    },

    probability: {
      type: Number,
      required: true
    },

    threshold: {
      type: Number,
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Prediction",
  predictionSchema
);