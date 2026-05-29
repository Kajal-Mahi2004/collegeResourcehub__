const Resource = require("../models/Resource");
const Subject = require("../models/Subject");

// GET ALL RESOURCES (WITH FILTERS)
const getAllResources = async (req, res) => {
  try {
    const { courseId, branchId, semesterId, subjectId, type, approved, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (subjectId) query.subject = subjectId;
    if (type) query.type = type;
    if (approved !== undefined) query.approved = approved === "true";

    if (courseId || branchId || semesterId) {
      const subjectQuery = {};
      if (courseId) subjectQuery.course = courseId;
      if (branchId) subjectQuery.branch = branchId;
      if (semesterId) subjectQuery.semester = semesterId;

      const matchingSubjectIds = await Subject.find(subjectQuery).distinct("_id");

      if (!matchingSubjectIds.length) {
        return res.status(200).json({
          message: "Resources fetched successfully",
          resources: [],
          totalResources: 0,
          totalPages: 0,
          currentPage: parseInt(page)
        });
      }

      if (query.subject) {
        query.subject = matchingSubjectIds.some((id) => id.toString() === query.subject.toString())
          ? query.subject
          : { $in: [] };
      } else {
        query.subject = { $in: matchingSubjectIds };
      }
    }
    
    const skip = (page - 1) * limit;
    
    const resources = await Resource.find(query)
      .populate("subject", "name code")
      .populate("course", "name")
      .populate("branch", "name code")
      .populate("semester", "number")
      .populate("uploadedBy", "name email")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const totalResources = await Resource.countDocuments(query);
    
    res.status(200).json({
      message: "Resources fetched successfully",
      resources,
      totalResources,
      totalPages: Math.ceil(totalResources / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET RESOURCES BY SUBJECT
const getResourcesBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { type, page = 1, limit = 10 } = req.query;
    
    const subject = await Subject.findById(subjectId);
    
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }
    
    let query = { subject: subjectId, approved: true };
    if (type) query.type = type;
    
    const skip = (page - 1) * limit;
    
    const resources = await Resource.find(query)
      .populate("subject", "name code")
      .populate("course", "name")
      .populate("branch", "name code")
      .populate("semester", "number")
      .populate("uploadedBy", "name email")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ downloads: -1 });
    
    const totalResources = await Resource.countDocuments(query);
    
    res.status(200).json({
      message: "Resources fetched successfully",
      resources,
      totalResources,
      totalPages: Math.ceil(totalResources / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET SINGLE RESOURCE
const getResource = async (req, res) => {
  try {
    const { id } = req.params;
    
    const resource = await Resource.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("subject", "name code")
      .populate("uploadedBy", "name email");
    
    if (!resource) {
      return res.status(404).json({
        message: "Resource not found"
      });
    }
    
    res.status(200).json({
      message: "Resource fetched successfully",
      resource
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// CREATE RESOURCE (TEACHER/ADMIN)
const createResource = async (req, res) => {
  try {
    const { title, description, type, subjectId, fileUrl, fileSize, mimeType } = req.body;
    const userId = req.user?.id;
    
    if (!title || !type || !subjectId || (!fileUrl && !req.file)) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }
    
    if (!["note", "pyq", "syllabus", "question-bank", "assignment", "lab-manual", "ebook"].includes(type)) {
      return res.status(400).json({
        message: "Invalid resource type"
      });
    }
    
    const subject = await Subject.findById(subjectId);
    
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }

    // Prefer explicit Cloudinary URL fields from multer-storage-cloudinary
    const cloudinaryUrl = req.file?.path || req.file?.secure_url || req.file?.url;
    const resourceFileUrl = cloudinaryUrl || fileUrl;
    const resourceFileName = req.file?.originalname || req.body.fileName;
    const detectedMime = req.file?.mimetype || mimeType || "application/octet-stream";
    const detectedSize = req.file?.size ? String(req.file.size) : (fileSize || "unknown");

    if (req.file && !cloudinaryUrl) {
      return res.status(500).json({
        message: "File uploaded but Cloudinary URL not received"
      });
    }

    console.log("createResource: cloudinary/multer response", {
      uploader: userId,
      rawFileObject: req.file,
      originalName: req.file?.originalname,
      mimeType: detectedMime,
      size: detectedSize,
      cloudinaryUrl: cloudinaryUrl || null,
      fallbackBodyFileUrl: fileUrl || null,
      finalStoredUrl: resourceFileUrl
    });

    const resource = await Resource.create({
      title,
      description: description || "",
      type,
      course: subject.course,
      branch: subject.branch,
      semester: subject.semester,
      subject: subjectId,
      uploadedBy: userId,
      fileUrl: resourceFileUrl,
      fileName: resourceFileName || title,
      fileSize: detectedSize,
      mimeType: detectedMime,
      approved: req.user && req.user.role === "admin" ? true : false
    });

    console.log("createResource: resource stored in DB", {
      resourceId: resource._id,
      fileUrl: resource.fileUrl,
      fileName: resource.fileName,
      mimeType: resource.mimeType
    });
    
    res.status(201).json({
      message: "Resource created successfully",
      resource
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE RESOURCE
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type } = req.body;
    const userId = req.user.id;
    
    const resource = await Resource.findById(id);
    
    if (!resource) {
      return res.status(404).json({
        message: "Resource not found"
      });
    }
    
    if (resource.uploadedBy.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized to update this resource"
      });
    }
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (type) updateData.type = type;
    
    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("subject", "name code")
      .populate("uploadedBy", "name email");
    
    res.status(200).json({
      message: "Resource updated successfully",
      resource: updatedResource
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// APPROVE RESOURCE (ADMIN ONLY)
const approveResource = async (req, res) => {
  try {
    const { id } = req.params;
    
    const resource = await Resource.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    )
      .populate("subject", "name code")
      .populate("uploadedBy", "name email");
    
    if (!resource) {
      return res.status(404).json({
        message: "Resource not found"
      });
    }
    
    res.status(200).json({
      message: "Resource approved successfully",
      resource
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// DELETE RESOURCE
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const resource = await Resource.findById(id);
    
    if (!resource) {
      return res.status(404).json({
        message: "Resource not found"
      });
    }
    
    if (resource.uploadedBy.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized to delete this resource"
      });
    }
    
    await Resource.findByIdAndDelete(id);
    
    res.status(200).json({
      message: "Resource deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// INCREMENT DOWNLOADS
const incrementDownloads = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found"
      });
    }

    res.status(200).json({
      message: "Downloads incremented",
      downloads: resource.downloads
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Serve file through the app so existing Cloudinary uploads work with correct headers
const serveResourceFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { download } = req.query;

    const resource = await Resource.findById(id);
    if (!resource || !resource.fileUrl) {
      return res.status(404).json({ message: "Resource or file not found" });
    }

    const fileUrl = resource.fileUrl;
    const fileName = resource.fileName || resource.title || "file";
    const mimeType = resource.mimeType || "application/octet-stream";
    const contentDisposition = download
      ? `attachment; filename="${fileName}"`
      : `inline; filename="${fileName}"`;

    const protocol = fileUrl.startsWith("https:") ? require("https") : require("http");

    protocol.get(fileUrl, (remoteRes) => {
      res.setHeader("Content-Type", remoteRes.headers["content-type"] || mimeType);
      res.setHeader("Content-Disposition", contentDisposition);
      if (remoteRes.headers["content-length"]) {
        res.setHeader("Content-Length", remoteRes.headers["content-length"]);
      }
      remoteRes.pipe(res);
    }).on("error", (error) => {
      console.error("Failed to proxy resource file:", error.message);
      res.status(502).json({ message: "Failed to fetch file" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllResources,
  getResourcesBySubject,
  getResource,
  createResource,
  updateResource,
  approveResource,
  deleteResource,
  incrementDownloads,
  serveResourceFile
};
