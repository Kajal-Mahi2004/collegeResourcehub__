const Branch = require("../models/Branch");
const Course = require("../models/Course");

// GET ALL BRANCHES (WITH OPTIONAL COURSE FILTER)
const getAllBranches = async (req, res) => {
  try {
    const { courseId } = req.query;
    
    let query = {};
    if (courseId) {
      query.course = courseId;
    }
    
    const branches = await Branch.find(query).populate("course", "name");
    
    res.status(200).json({
      message: "Branches fetched successfully",
      branches
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET BRANCHES BY COURSE
const getBranchesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }
    
    const branches = await Branch.find({ course: courseId });
    
    res.status(200).json({
      message: "Branches fetched successfully",
      branches
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET SINGLE BRANCH
const getBranch = async (req, res) => {
  try {
    const { id } = req.params;
    
    const branch = await Branch.findById(id).populate("course", "name");
    
    if (!branch) {
      return res.status(404).json({
        message: "Branch not found"
      });
    }
    
    res.status(200).json({
      message: "Branch fetched successfully",
      branch
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// CREATE BRANCH (ADMIN ONLY)
const createBranch = async (req, res) => {
  try {
    const { name, code, courseId } = req.body;
    
    if (!name || !code || !courseId) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }
    
    const branch = await Branch.create({
      name,
      code,
      course: courseId
    });
    
    res.status(201).json({
      message: "Branch created successfully",
      branch
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE BRANCH (ADMIN ONLY)
const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;
    
    const branch = await Branch.findByIdAndUpdate(
      id,
      { name, code },
      { new: true, runValidators: true }
    ).populate("course", "name");
    
    if (!branch) {
      return res.status(404).json({
        message: "Branch not found"
      });
    }
    
    res.status(200).json({
      message: "Branch updated successfully",
      branch
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// DELETE BRANCH (ADMIN ONLY)
const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    
    const branch = await Branch.findByIdAndDelete(id);
    
    if (!branch) {
      return res.status(404).json({
        message: "Branch not found"
      });
    }
    
    res.status(200).json({
      message: "Branch deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getAllBranches,
  getBranchesByCourse,
  getBranch,
  createBranch,
  updateBranch,
  deleteBranch
};
