const express = require("express");
const router = express.Router();
const {
  getAllResources,
  getResourcesBySubject,
  getResource,
  createResource,
  updateResource,
  approveResource,
  deleteResource,
  incrementDownloads
} = require("../controllers/resourceController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllResources);
router.get("/subject/:subjectId", getResourcesBySubject);
router.get("/:id", getResource);

// Protected routes - anyone authenticated can create resources
router.post("/", protect, createResource);
router.put("/:id", protect, updateResource);
router.post("/:id/download", incrementDownloads);

// Admin only routes
router.post("/:id/approve", protect, adminOnly, approveResource);
router.delete("/:id", protect, deleteResource);

module.exports = router;
