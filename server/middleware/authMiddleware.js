const jwt = require("jsonwebtoken");

// Protect routes - verify JWT token
const protect = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token, authorization denied"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Token is not valid"
    });
  }
};

// Admin only access
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }
  next();
};

// Student or higher access
const studentAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }
  next();
};

// Legacy middleware names for backward compatibility
const authMiddleware = protect;
const adminMiddleware = adminOnly;

module.exports = { 
  protect, 
  adminOnly, 
  studentAccess,
  authMiddleware, 
  adminMiddleware 
};
