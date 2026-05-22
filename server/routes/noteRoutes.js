const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  uploadNote,
  getNotes
} = require("../controllers/noteController");


router.post(
  "/upload",
  upload.single("file"),
  uploadNote
);

router.get("/all", getNotes);

module.exports = router;