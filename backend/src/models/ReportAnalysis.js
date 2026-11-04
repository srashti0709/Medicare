
const mongoose = require("mongoose");

const reportAnalysisSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalFilename: {
      type: String,
      required: true,
      trim: true,
    },

    // Extracted text is retained for future report comparison
    // and report-specific AI conversations.
    reportText: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    keyFindings: {
      type: [String],
      default: [],
    },

    normalValues: {
      type: [String],
      default: [],
    },

    abnormalValues: {
      type: [String],
      default: [],
    },

    questionsToDiscuss: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

reportAnalysisSchema.index({
  patient: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "ReportAnalysis",
  reportAnalysisSchema
);
