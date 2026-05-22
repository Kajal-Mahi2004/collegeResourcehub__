const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true
    },
    credits: {
      type: Number,
      default: 3
    }
  },
  {
    timestamps: true
  }
);

// Compound index for filtering
subjectSchema.index({ course: 1, branch: 1, semester: 1 });

module.exports = mongoose.model("Subject", subjectSchema);
