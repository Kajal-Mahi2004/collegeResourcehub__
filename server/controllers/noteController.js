const Note = require("../models/Note");


// UPLOAD NOTE
const uploadNote = async (req, res) => {

  try {

    const { title, subject } = req.body;

    const fileUrl = req.file.filename;

    const note = await Note.create({
      title,
      subject,
      fileUrl
    });

    res.status(201).json({
      message: "Note uploaded successfully",
      note
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// GET ALL NOTES
const getNotes = async (req, res) => {

  try {

    const notes = await Note.find();

    res.status(200).json(notes);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  uploadNote,
  getNotes
};