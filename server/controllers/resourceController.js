const Resource = require("../models/Resource");
const Subject = require("../models/Subject");

// GET ALL RESOURCES (WITH FILTERS)
const getAllResources = async (req, res) => {
  try {
    const { subjectId, type, approved, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (subjectId) query.subject = subjectId;
    if (type) query.type = type;
    if (approved !== undefined) query.approved = approved === "true";
    
    const skip = (page - 1) * limit;
    
    const resources = await Resource.find(query)
      .populate("subject", "name code")
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
    
    if (!title || !type || !subjectId || !fileUrl) {
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
    
    const resource = await Resource.create({
      title,
      description: description || "",
      type,
      subject: subjectId,
      uploadedBy: userId,
      fileUrl,
      fileSize: fileSize || "unknown",
      mimeType: mimeType || "application/octet-stream",
      approved: false
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

module.exports = {
  getAllResources,
  getResourcesBySubject,
  getResource,
  createResource,
  updateResource,
  approveResource,
  deleteResource,
  incrementDownloads
};
