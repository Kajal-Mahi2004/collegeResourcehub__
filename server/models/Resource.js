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
    semester: {
      type: Number
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
resourceSchema.index({ subject: 1, type: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ approved: 1 });

module.exports = mongoose.model("Resource", resourceSchema);
