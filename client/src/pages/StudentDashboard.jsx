import React, { useEffect, useState } from "react";
import { branchAPI, courseAPI, resourceAPI, semesterAPI } from "../services/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resourceType, setResourceType] = useState("note");
  const [filters, setFilters] = useState({
    courseId: "",
    branchId: "",
    semesterId: ""
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchInitialData();
    fetchResources();
  }, [token, navigate]);

  useEffect(() => {
    if (filters.courseId) {
      fetchBranches(filters.courseId);
      fetchSemesters(filters.courseId);
    } else {
      setBranches([]);
      setSemesters([]);
    }
  }, [filters.courseId]);

  useEffect(() => {
    fetchResources();
  }, [filters, resourceType]);

  const fetchInitialData = async () => {
    try {
      const response = await courseAPI.getAllCourses();
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const fetchBranches = async (courseId) => {
    try {
      const response = await branchAPI.getBranchesByCourse(courseId);
      setBranches(response.data.branches || []);
    } catch (error) {
      console.error("Error loading branches:", error);
    }
  };

  const fetchSemesters = async (courseId) => {
    try {
      const response = await semesterAPI.getSemestersByCourse(courseId);
      setSemesters(response.data.semesters || []);
    } catch (error) {
      console.error("Error loading semesters:", error);
    }
  };

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await resourceAPI.getAllResources({
        courseId: filters.courseId,
        branchId: filters.branchId,
        semesterId: filters.semesterId,
        type: resourceType,
        approved: true,
        limit: 100
      });

      setResources(response.data.resources || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "courseId") {
      setFilters({ courseId: value, branchId: "", semesterId: "" });
      return;
    }

    if (name === "branchId") {
      setFilters({ ...filters, branchId: value });
      return;
    }

    setFilters({ ...filters, [name]: value });
  };

  const handleOpen = (fileUrl) => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Navbar />
      <div className="student-dashboard">
        <div className="student-hero">
          <h5><p>Pick your course, branch, and semester to load the right notes, PYQs, and question bank And other  Study Materials.</p></h5>
           {/* <h1>📚 Student Dashboard</h1> */}
          {/* <p>Pick your course, branch, and semester to load the right notes, PYQs, and question bank files.</p> */}
        </div>

        <div className="filters">
          <select
            name="courseId"
            value={filters.courseId}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>

          <select
            name="branchId"
            value={filters.branchId}
            onChange={handleFilterChange}
            className="filter-select"
            disabled={!filters.courseId}
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </select>

          <select
            name="semesterId"
            value={filters.semesterId}
            onChange={handleFilterChange}
            className="filter-select"
            disabled={!filters.courseId}
          >
            <option value="">All Semesters</option>
            {semesters.map((semester) => (
              <option key={semester._id} value={semester._id}>
                Semester {semester.number}
              </option>
            ))}
          </select>

          <div className="type-tabs">
            {[
              { value: "note", label: "📝 Notes" },
              { value: "pyq", label: "📋 PYQ" },
              { value: "question-bank", label: "📚 Question Bank" },
              { value: "syllabus", label: "📖 Syllabus" }
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                className={`tab-btn ${resourceType === type.value ? "active" : ""}`}
                onClick={() => setResourceType(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="no-resources">
            No resources available for the selected filters.
          </div>
        ) : (
          <div className="resources-grid">
            {resources.map((resource) => (
              <div key={resource._id} className="resource-card">
                <div className="resource-header">
                  <h3>{resource.title}</h3>
                  <span className="subject-badge">{resource.type}</span>
                </div>

                <p className="semester"><strong>Course:</strong> {resource.course?.name || "-"}</p>
                <p className="semester"><strong>Branch:</strong> {resource.branch?.name || "-"}</p>
                <p className="semester"><strong>Semester:</strong> {resource.semester?.number || "-"}</p>
                <p className="semester"><strong>Subject:</strong> {resource.subject?.name || "-"}</p>

                {resource.description && (
                  <p className="description">{resource.description}</p>
                )}

                <div className="resource-footer">
                  <span className="uploaded-by">
                    By: {resource.uploadedBy?.name || "Admin"}
                  </span>
                  <button
                    className="download-btn"
                    onClick={() => handleOpen(resource.fileUrl)}
                  >
                    👁️ Open Resource
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default StudentDashboard;
