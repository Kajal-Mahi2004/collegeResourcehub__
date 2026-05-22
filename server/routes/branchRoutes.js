const express = require("express");
const router = express.Router();
const {
  getAllBranches,
  getBranchesByCourse,
  getBranch,
  createBranch,
  updateBranch,
  deleteBranch
} = require("../controllers/branchController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllBranches);
router.get("/course/:courseId", getBranchesByCourse);
router.get("/:id", getBranch);

// Admin only routes
router.post("/", protect, adminOnly, createBranch);
router.put("/:id", protect, adminOnly, updateBranch);
router.delete("/:id", protect, adminOnly, deleteBranch);

module.exports = router;
