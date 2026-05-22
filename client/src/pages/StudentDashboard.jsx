import React, { useState, useEffect } from "react";
import { studentAPI } from "../services/api";
import "./StudentDashboard.css";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("notes");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    subject: "",
    semester: ""
  });

  const subjects = ["Data Structures", "Algorithms", "Database", "Web Dev", "OS", "Networks"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const years = [2023, 2022, 2021, 2020, 2019];

  useEffect(() => {
    fetchResources();
  }, [activeTab, filters]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      let response;

      if (activeTab === "notes") {
        response = await studentAPI.getNotes(filters);
      } else if (activeTab === "pyq") {
        response = await studentAPI.getPYQ(filters);
      } else {
        response = await studentAPI.getSyllabus(filters);
      }

      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleDownload = (url, fileName) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navbar />
      <div className="student-dashboard">
        <h1>📚 Student Dashboard</h1>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            📝 Study Notes
          </button>
          <button
            className={`tab-btn ${activeTab === "pyq" ? "active" : ""}`}
            onClick={() => setActiveTab("pyq")}
          >
            ❓ PYQ Bank
          </button>
          <button
            className={`tab-btn ${activeTab === "syllabus" ? "active" : ""}`}
            onClick={() => setActiveTab("syllabus")}
          >
            📋 Syllabus
          </button>
        </div>

        <div className="filters">
          <select
            name="subject"
            value={filters.subject}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select
            name="semester"
            value={filters.semester}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Semesters</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>

          {activeTab === "pyq" && (
            <select
              name="year"
              value={filters.year || ""}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          )}
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
                  <span className="subject-badge">{resource.subject}</span>
                </div>

                <p className="semester">
                  <strong>Semester:</strong> {resource.semester}
                </p>

                {resource.year && (
                  <p className="year">
                    <strong>Year:</strong> {resource.year}
                  </p>
                )}

                {resource.description && (
                  <p className="description">{resource.description}</p>
                )}

                <div className="resource-footer">
                  <span className="uploaded-by">
                    By: {resource.uploadedBy?.name || "Admin"}
                  </span>
                  <button
                    className="download-btn"
                    onClick={() =>
                      handleDownload(resource.fileUrl, resource.fileName)
                    }
                  >
                    📥 Download
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
