const Notes = require("../models/Notes");
const PYQ = require("../models/PYQ");
const Syllabus = require("../models/Syllabus");

// Upload Notes
const uploadNotes = async (req, res) => {
  try {
    const { title, subject, semester, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const notes = await Notes.create({
      title,
      subject,
      semester: parseInt(semester),
      fileUrl: req.file.path,
      fileName: req.file.originalname,
      uploadedBy: req.user.id,
      description
    });

    res.status(201).json({
      message: "Notes uploaded successfully",
      notes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload PYQ
const uploadPYQ = async (req, res) => {
  try {
    const { title, subject, semester, year, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pyq = await PYQ.create({
      title,
      subject,
      semester: parseInt(semester),
      year: parseInt(year),
      fileUrl: req.file.path,
      fileName: req.file.originalname,
      uploadedBy: req.user.id,
      description
    });

    res.status(201).json({
      message: "PYQ uploaded successfully",
      pyq
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload Syllabus
const uploadSyllabus = async (req, res) => {
  try {
    const { title, subject, semester, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const syllabus = await Syllabus.create({
      title,
      subject,
      semester: parseInt(semester),
      fileUrl: req.file.path,
      fileName: req.file.originalname,
      uploadedBy: req.user.id,
      description
    });

    res.status(201).json({
      message: "Syllabus uploaded successfully",
      syllabus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all resources
const getAllNotes = async (req, res) => {
  try {
    const { subject, semester } = req.query;
    let query = {};

    if (subject) query.subject = subject;
    if (semester) query.semester = parseInt(semester);

    const notes = await Notes.find(query).populate("uploadedBy", "name email");
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPYQ = async (req, res) => {
  try {
    const { subject, semester, year } = req.query;
    let query = {};

    if (subject) query.subject = subject;
    if (semester) query.semester = parseInt(semester);
    if (year) query.year = parseInt(year);

    const pyq = await PYQ.find(query).populate("uploadedBy", "name email");
    res.json(pyq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSyllabus = async (req, res) => {
  try {
    const { subject, semester } = req.query;
    let query = {};

    if (subject) query.subject = subject;
    if (semester) query.semester = parseInt(semester);

    const syllabus = await Syllabus.find(query).populate("uploadedBy", "name email");
    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete resources
const deleteNotes = async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Notes not found" });
    }

    if (note.uploadedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Notes.findByIdAndDelete(req.params.id);
    res.json({ message: "Notes deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment download count for Notes
const incrementNotesDownload = async (req, res) => {
  try {
    const note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Notes not found" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment download count for PYQ
const incrementPYQDownload = async (req, res) => {
  try {
    const pyq = await PYQ.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!pyq) {
      return res.status(404).json({ message: "PYQ not found" });
    }

    res.json(pyq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment download count for Syllabus
const incrementSyllabusDownload = async (req, res) => {
  try {
    const syllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!syllabus) {
      return res.status(404).json({ message: "Syllabus not found" });
    }

    res.json(syllabus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadNotes,
  uploadPYQ,
  uploadSyllabus,
  getAllNotes,
  getAllPYQ,
  getAllSyllabus,
  deleteNotes,
  incrementNotesDownload,
  incrementPYQDownload,
  incrementSyllabusDownload
};
