const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  fileUrl: {
    type: String,
    required: true
  },

  uploadedBy: {
    type: String,
    default: "student"
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Note", noteSchema);