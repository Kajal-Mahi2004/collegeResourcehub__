const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },

    avatar: {
      type: String,
      default: null
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null
    },

    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      default: null
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);