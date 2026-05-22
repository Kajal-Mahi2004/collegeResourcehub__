const Course = require("../models/Course");

// GET ALL COURSES
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    
    res.status(200).json({
      message: "Courses fetched successfully",
      courses
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET SINGLE COURSE
const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }
    
    res.status(200).json({
      message: "Course fetched successfully",
      course
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// CREATE COURSE (ADMIN ONLY)
const createCourse = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        message: "Course name is required"
      });
    }
    
    const existingCourse = await Course.findOne({ name });
    
    if (existingCourse) {
      return res.status(400).json({
        message: "Course already exists"
      });
    }
    
    const course = await Course.create({ name });
    
    res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE COURSE (ADMIN ONLY)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        message: "Course name is required"
      });
    }
    
    const course = await Course.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }
    
    res.status(200).json({
      message: "Course updated successfully",
      course
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// DELETE COURSE (ADMIN ONLY)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findByIdAndDelete(id);
    
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }
    
    res.status(200).json({
      message: "Course deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
};
