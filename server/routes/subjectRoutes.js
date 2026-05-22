const express = require("express");
const router = express.Router();
const {
  getAllSubjects,
  getSubjectsByFilter,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} = require("../controllers/subjectController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllSubjects);
router.get("/filter/:courseId/:branchId/:semesterId", getSubjectsByFilter);
router.get("/:id", getSubject);

// Admin only routes
router.post("/", protect, adminOnly, createSubject);
router.put("/:id", protect, adminOnly, updateSubject);
router.delete("/:id", protect, adminOnly, deleteSubject);

module.exports = router;
