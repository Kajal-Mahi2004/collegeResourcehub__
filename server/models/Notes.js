const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  semester: {
    type: Number,
    required: true
  },

  fileUrl: {
    type: String,
    required: true
  },

  fileName: {
    type: String,
    required: true
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  downloads: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Notes", notesSchema);
