const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    type: {
      type: String,
      required: true,
      enum: ["note", "pyq", "syllabus", "question-bank", "assignment", "lab-manual", "ebook"]
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileName: {
      type: String
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch"
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester"
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    downloads: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    approved: {
      type: Boolean,
      default: false
    },
    fileSize: {
      type: String
    },
    mimeType: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes for filtering
resourceSchema.index({ course: 1, branch: 1, semester: 1, subject: 1, type: 1 });
resourceSchema.index({ subject: 1, type: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ approved: 1 });

module.exports = mongoose.model("Resource", resourceSchema);
