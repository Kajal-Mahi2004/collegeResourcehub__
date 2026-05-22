const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
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
} = require("../controllers/adminController");

// Upload routes (admin only)
router.post(
  "/notes/upload",
  authMiddleware,
  adminMiddleware,
  upload.single("file"),
  uploadNotes
);

router.post(
  "/pyq/upload",
  authMiddleware,
  adminMiddleware,
  upload.single("file"),
  uploadPYQ
);

router.post(
  "/syllabus/upload",
  authMiddleware,
  adminMiddleware,
  upload.single("file"),
  uploadSyllabus
);

// Get all resources (for students)
router.get("/notes", getAllNotes);
router.get("/pyq", getAllPYQ);
router.get("/syllabus", getAllSyllabus);

// Delete resources (admin only)
router.delete(
  "/notes/:id",
  authMiddleware,
  adminMiddleware,
  deleteNotes
);

// Download count increment routes (public)
router.post("/notes/:id/download", incrementNotesDownload);
router.post("/pyq/:id/download", incrementPYQDownload);
router.post("/syllabus/:id/download", incrementSyllabusDownload);

module.exports = router;
