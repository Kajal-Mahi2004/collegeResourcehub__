const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
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

// Compound index to prevent duplicate branch per course
branchSchema.index({ name: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Branch", branchSchema);
