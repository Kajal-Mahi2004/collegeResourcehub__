const express = require("express");
const router = express.Router();
const { uploadResourceFile } = require("../middleware/uploadMiddleware");
const {
  getAllResources,
  getResourcesBySubject,
  getResource,
  createResource,
  updateResource,
  approveResource,
  deleteResource,
  incrementDownloads,
  serveResourceFile
} = require("../controllers/resourceController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllResources);
router.get("/subject/:subjectId", getResourcesBySubject);
router.get("/:id", getResource);
router.get("/:id/file", serveResourceFile);

// Protected routes - admin only can upload resources
router.post("/", protect, adminOnly, uploadResourceFile, createResource);
router.put("/:id", protect, updateResource);
router.post("/:id/download", incrementDownloads);

// Admin only routes
router.post("/:id/approve", protect, adminOnly, approveResource);
router.delete("/:id", protect, deleteResource);

module.exports = router;
