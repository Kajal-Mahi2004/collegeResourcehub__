const express = require("express");
const router = express.Router();
const {
  getAllSemesters,
  getSemestersByCourse,
  getSemester,
  createSemester,
  updateSemester,
  deleteSemester
} = require("../controllers/semesterController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllSemesters);
router.get("/course/:courseId", getSemestersByCourse);
router.get("/:id", getSemester);

// Admin only routes
router.post("/", protect, adminOnly, createSemester);
router.put("/:id", protect, adminOnly, updateSemester);
router.delete("/:id", protect, adminOnly, deleteSemester);

module.exports = router;
