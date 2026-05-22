const Semester = require("../models/Semester");
const Course = require("../models/Course");

// GET ALL SEMESTERS (WITH OPTIONAL COURSE FILTER)
const getAllSemesters = async (req, res) => {
  try {
    const { courseId } = req.query;
    
    let query = {};
    if (courseId) {
      query.course = courseId;
    }
    
    const semesters = await Semester.find(query).populate("course", "name").sort("number");
    
    res.status(200).json({
      message: "Semesters fetched successfully",
      semesters
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET SEMESTERS BY COURSE
const getSemestersByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }
    
    const semesters = await Semester.find({ course: courseId }).sort("number");
    
    res.status(200).json({
      message: "Semesters fetched successfully",
      semesters
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET SINGLE SEMESTER
const getSemester = async (req, res) => {
  try {
    const { id } = req.params;
    
    const semester = await Semester.findById(id).populate("course", "name");
    
    if (!semester) {
      return res.status(404).json({
        message: "Semester not found"
      });
    }
    
    res.status(200).json({
      message: "Semester fetched successfully",
      semester
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// CREATE SEMESTER (ADMIN ONLY)
const createSemester = async (req, res) => {
  try {
    const { number, courseId } = req.body;
    
    if (number === undefined || !courseId) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }
    
    if (number < 1 || number > 8) {
      return res.status(400).json({
        message: "Semester number must be between 1 and 8"
      });
    }
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }
    
    const semester = await Semester.create({
      number,
      course: courseId
    });
    
    res.status(201).json({
      message: "Semester created successfully",
      semester
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE SEMESTER (ADMIN ONLY)
const updateSemester = async (req, res) => {
  try {
    const { id } = req.params;
    const { number } = req.body;
    
    if (number < 1 || number > 8) {
      return res.status(400).json({
        message: "Semester number must be between 1 and 8"
      });
    }
    
    const semester = await Semester.findByIdAndUpdate(
      id,
      { number },
      { new: true, runValidators: true }
    ).populate("course", "name");
    
    if (!semester) {
      return res.status(404).json({
        message: "Semester not found"
      });
    }
    
    res.status(200).json({
      message: "Semester updated successfully",
      semester
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// DELETE SEMESTER (ADMIN ONLY)
const deleteSemester = async (req, res) => {
  try {
    const { id } = req.params;
    
    const semester = await Semester.findByIdAndDelete(id);
    
    if (!semester) {
      return res.status(404).json({
        message: "Semester not found"
      });
    }
    
    res.status(200).json({
      message: "Semester deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getAllSemesters,
  getSemestersByCourse,
  getSemester,
  createSemester,
  updateSemester,
  deleteSemester
};
