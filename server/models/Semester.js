const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to prevent duplicate semester per course
semesterSchema.index({ number: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Semester", semesterSchema);
