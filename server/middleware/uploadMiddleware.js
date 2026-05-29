const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const RAW_EXTENSIONS = new Set(["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "zip"]);
const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg"]);

function getExtension(originalName = "") {
  return path.extname(originalName).replace(".", "").toLowerCase();
}

function getFileBaseName(originalName = "file") {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const normalized = base
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return normalized || "file";
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = getExtension(file.originalname);
    const baseName = getFileBaseName(file.originalname);
    const timestamp = Date.now();

    const isImage = IMAGE_EXTENSIONS.has(ext);
    const isRawDocument = RAW_EXTENSIONS.has(ext);

    if (!isImage && !isRawDocument) {
      throw new Error(`Unsupported file extension: ${ext || "unknown"}`);
    }

    const resourceType = isImage ? "image" : "raw";
    const publicId = `${baseName}-${timestamp}`;

    // Keep params on req so we can log them after multer finishes the upload.
    req.cloudinaryUploadMeta = {
      public_id: publicId,
      format: ext,
      resource_type: resourceType
    };

    console.log("uploadMiddleware: cloudinary params", req.cloudinaryUploadMeta);

    return {
      folder: "college-resource-hub",
      resource_type: resourceType,
      public_id: publicId,
      format: ext
    };
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/zip",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml"
    ];

    const ext = getExtension(file.originalname);
    const isAllowedExtension = RAW_EXTENSIONS.has(ext) || IMAGE_EXTENSIONS.has(ext);

    if (allowedMimes.includes(file.mimetype) && isAllowedExtension) {
      console.log(`uploadMiddleware: accepting file ${file.originalname} (${file.mimetype})`);
      cb(null, true);
    } else {
      console.log(`uploadMiddleware: rejecting file ${file.originalname} (${file.mimetype})`);
      cb(new Error("Invalid file type or extension"));
    }
  }
});

const uploadResourceFile = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error) {
      return next(error);
    }

    if (req.file) {
      console.log("uploadMiddleware: cloudinary upload result", {
        public_id: req.file.filename || req.cloudinaryUploadMeta?.public_id,
        format: req.file.format || req.cloudinaryUploadMeta?.format,
        resource_type: req.file.resource_type || req.cloudinaryUploadMeta?.resource_type,
        secure_url: req.file.path || req.file.secure_url || null
      });
    }

    return next();
  });
};


module.exports = upload;
module.exports.upload = upload;
module.exports.uploadResourceFile = uploadResourceFile;