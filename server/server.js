const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const noteRoutes = require("./routes/noteRoutes");
const courseRoutes = require("./routes/courseRoutes");
const branchRoutes = require("./routes/branchRoutes");
const semesterRoutes = require("./routes/semesterRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const resourceRoutes = require("./routes/resourceRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/uploads", express.static("uploads"));

// Authentication & Admin Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Academic Structure Routes
app.use("/api/courses", courseRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/subjects", subjectRoutes);

// Content Routes
app.use("/api/notes", noteRoutes);
app.use("/api/resources", resourceRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});