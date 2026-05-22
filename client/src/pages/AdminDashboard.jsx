import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { courseAPI, branchAPI, semesterAPI, subjectAPI, resourceAPI, adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user, token, role } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [courseForm, setCourseForm] = useState({ name: '' });
  const [branchForm, setBranchForm] = useState({ name: '', code: '', courseId: '' });
  const [semesterForm, setSemesterForm] = useState({ number: '', courseId: '' });
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    courseId: '',
    branchId: '',
    semesterId: '',
    description: '',
    credits: 3
  });
  const [notesForm, setNotesForm] = useState({ title: '', subject: '', semester: '', description: '', file: null });
  const [pyqForm, setPyqForm] = useState({ title: '', subject: '', semester: '', year: '', description: '', file: null });
  const [syllabusForm, setSyllabusForm] = useState({ title: '', subject: '', semester: '', description: '', file: null });
  const [notes, setNotes] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [syllabuses, setSyllabuses] = useState([]);

  useEffect(() => {
    // Check if user is admin
    if (!token) {
      navigate('/login');
      return;
    }
    if (role !== 'admin') {
      navigate('/student-dashboard');
      return;
    }
    fetchAllData();
  }, [role, token, navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [coursesRes, branchesRes, semestersRes, subjectsRes, resourcesRes, notesRes, pyqsRes, syllabusRes] = await Promise.all([
        courseAPI.getAllCourses(),
        branchAPI.getAllBranches(),
        semesterAPI.getAllSemesters({}),
        subjectAPI.getAllSubjects({}),
        resourceAPI.getAllResources({ limit: 100 }),
        adminAPI.getNotes({}),
        adminAPI.getPYQ({}),
        adminAPI.getSyllabus({})
      ]);

      setCourses(coursesRes.data.courses);
      setBranches(branchesRes.data.branches);
      setSemesters(semestersRes.data.semesters);
      setSubjects(subjectsRes.data.subjects);
      setResources(resourcesRes.data.resources);
      setNotes(notesRes.data);
      setPyqs(pyqsRes.data);
      setSyllabuses(syllabusRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading data: ' + error.message);
    }
    setLoading(false);
  };

  // COURSE OPERATIONS
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await courseAPI.createCourse({ name: courseForm.name });
      setCourseForm({ name: '' });
      fetchAllData();
      alert('Course created successfully!');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message || error.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Delete this course and all related data?')) {
      try {
        await courseAPI.deleteCourse(id);
        fetchAllData();
        alert('Course deleted successfully!');
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  // BRANCH OPERATIONS
  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!branchForm.courseId) {
      alert('Select a course');
      return;
    }
    try {
      await branchAPI.createBranch(branchForm);
      setBranchForm({ name: '', code: '', courseId: '' });
      fetchAllData();
      alert('Branch created successfully!');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleDeleteBranch = async (id) => {
    if (window.confirm('Delete this branch?')) {
      try {
        await branchAPI.deleteBranch(id);
        fetchAllData();
        alert('Branch deleted!');
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  // SEMESTER OPERATIONS
  const handleCreateSemester = async (e) => {
    e.preventDefault();
    if (!semesterForm.courseId) {
      alert('Select a course');
      return;
    }
    try {
      await semesterAPI.createSemester(semesterForm);
      setSemesterForm({ number: '', courseId: '' });
      fetchAllData();
      alert('Semester created successfully!');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleDeleteSemester = async (id) => {
    if (window.confirm('Delete this semester?')) {
      try {
        await semesterAPI.deleteSemester(id);
        fetchAllData();
        alert('Semester deleted!');
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  // SUBJECT OPERATIONS
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!subjectForm.courseId || !subjectForm.branchId || !subjectForm.semesterId) {
      alert('Select course, branch, and semester');
      return;
    }
    try {
      await subjectAPI.createSubject(subjectForm);
      setSubjectForm({
        name: '',
        code: '',
        courseId: '',
        branchId: '',
        semesterId: '',
        description: '',
        credits: 3
      });
      fetchAllData();
      alert('Subject created successfully!');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Delete this subject?')) {
      try {
        await subjectAPI.deleteSubject(id);
        fetchAllData();
        alert('Subject deleted!');
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  // RESOURCE OPERATIONS
  const handleApproveResource = async (id) => {
    try {
      await resourceAPI.approveResource(id);
      fetchAllData();
      alert('Resource approved!');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Delete this resource?')) {
      try {
        await resourceAPI.deleteResource(id);
        fetchAllData();
        alert('Resource deleted!');
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  const getFilteredBranches = () => branchForm.courseId 
    ? branches.filter(b => b.course === branchForm.courseId) 
    : [];

  const getFilteredSemesters = () => semesterForm.courseId 
    ? semesters.filter(s => s.course === semesterForm.courseId) 
    : [];

  const getFilteredBranchesForSubject = () => subjectForm.courseId 
    ? branches.filter(b => b.course === subjectForm.courseId) 
    : [];

  const getFilteredSemestersForSubject = () => subjectForm.courseId 
    ? semesters.filter(s => s.course === subjectForm.courseId) 
    : [];

  // NOTES OPERATIONS
  const handleUploadNotes = async (e) => {
    e.preventDefault();
    if (!notesForm.file) {
      alert('Select a file');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', notesForm.title);
      formData.append('subject', notesForm.subject);
      formData.append('semester', notesForm.semester);
      formData.append('description', notesForm.description);
      formData.append('file', notesForm.file);

      await adminAPI.uploadNotes(formData);
      setNotesForm({ title: '', subject: '', semester: '', description: '', file: null });
      fetchAllData();
      alert('Notes uploaded successfully!');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  // PYQ OPERATIONS
  const handleUploadPYQ = async (e) => {
    e.preventDefault();
    if (!pyqForm.file) {
      alert('Select a file');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', pyqForm.title);
      formData.append('subject', pyqForm.subject);
      formData.append('semester', pyqForm.semester);
      formData.append('year', pyqForm.year);
      formData.append('description', pyqForm.description);
      formData.append('file', pyqForm.file);

      await adminAPI.uploadPYQ(formData);
      setPyqForm({ title: '', subject: '', semester: '', year: '', description: '', file: null });
      fetchAllData();
      alert('PYQ uploaded successfully!');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  // SYLLABUS OPERATIONS
  const handleUploadSyllabus = async (e) => {
    e.preventDefault();
    if (!syllabusForm.file) {
      alert('Select a file');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', syllabusForm.title);
      formData.append('subject', syllabusForm.subject);
      formData.append('semester', syllabusForm.semester);
      formData.append('description', syllabusForm.description);
      formData.append('file', syllabusForm.file);

      await adminAPI.uploadSyllabus(formData);
      setSyllabusForm({ title: '', subject: '', semester: '', description: '', file: null });
      fetchAllData();
      alert('Syllabus uploaded successfully!');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleDeleteNotes = async (id) => {
    if (window.confirm('Delete these notes?')) {
      try {
        await adminAPI.deleteNotes(id);
        fetchAllData();
        alert('Notes deleted!');
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  if (loading && courses.length === 0) {
    return (
      <>
        <Navbar />
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading Dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-dashboard-wrapper">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <div>
              <h1 className="admin-title">🎓 Admin Dashboard</h1>
              <p className="admin-subtitle">Manage all academic resources and structure</p>
            </div>
            <div className="admin-welcome">
              <p>Welcome, <span className="admin-name">{user?.name}</span></p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs-container">
        <div className="admin-tabs">
            {['dashboard', 'courses', 'branches', 'semesters', 'subjects', 'resources', 'notes', 'pyq', 'syllabus'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`admin-tab-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab === 'pyq' ? 'PYQ' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="admin-content-wrapper">

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="admin-stats-grid">
            <div className="admin-stat-card stat-courses">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <p className="stat-label">Total Courses</p>
                <p className="stat-value">{courses.length}</p>
              </div>
            </div>
            <div className="admin-stat-card stat-branches">
              <div className="stat-icon">🏢</div>
              <div className="stat-content">
                <p className="stat-label">Total Branches</p>
                <p className="stat-value">{branches.length}</p>
              </div>
            </div>
            <div className="admin-stat-card stat-subjects">
              <div className="stat-icon">📖</div>
              <div className="stat-content">
                <p className="stat-label">Total Subjects</p>
                <p className="stat-value">{subjects.length}</p>
              </div>
            </div>
            <div className="admin-stat-card stat-resources">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <p className="stat-label">Pending Resources</p>
                <p className="stat-value">{resources.filter(r => !r.approved).length}</p>
              </div>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="admin-section">
            {/* Create Form */}
            <div className="admin-form-card">
              <h2 className="admin-form-title">➕ Create New Course</h2>
              <form onSubmit={handleCreateCourse} className="admin-form">
                <input
                  type="text"
                  placeholder="BTech, MTech, Pharmacy, Diploma"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ name: e.target.value })}
                  className="admin-input"
                  required
                />
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  Create Course
                </button>
              </form>
            </div>

            {/* Courses List */}
            <div className="admin-items-grid">
              {courses.length > 0 ? (
                courses.map(course => (
                  <div key={course._id} className="admin-item-card course-card">
                    <h3 className="admin-item-title">{course.name}</h3>
                    <p className="admin-item-id">ID: {course._id.substring(0, 8)}...</p>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="admin-btn admin-btn-danger admin-btn-full"
                    >
                      Delete Course
                    </button>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state">
                  <p>No courses created yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BRANCHES TAB */}
        {activeTab === 'branches' && (
          <div className="admin-section">
            {/* Create Form */}
            <div className="admin-form-card">
              <h2 className="admin-form-title">➕ Create New Branch</h2>
              <form onSubmit={handleCreateBranch} className="admin-form">
                <div className="admin-form-row">
                  <select
                    value={branchForm.courseId}
                    onChange={(e) => setBranchForm({ ...branchForm, courseId: e.target.value })}
                    className="admin-input"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Branch name (e.g., CSE, Mechanical)"
                    value={branchForm.name}
                    onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                    className="admin-input"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Code (e.g., CS)"
                    value={branchForm.code}
                    onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="admin-btn admin-btn-success admin-btn-full"
                >
                  Create Branch
                </button>
              </form>
            </div>

            {/* Branches List */}
            <div className="admin-items-list">
              {branches.length > 0 ? (
                branches.map(branch => (
                  <div key={branch._id} className="admin-list-item branch-item">
                    <div className="item-info">
                      <h3 className="admin-item-title">{branch.name}</h3>
                      <p className="admin-item-meta">Code: {branch.code} | Course: {branch.course?.name}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteBranch(branch._id)}
                      className="admin-btn admin-btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state">
                  <p>No branches created yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEMESTERS TAB */}
        {activeTab === 'semesters' && (
          <div className="admin-section">
            {/* Create Form */}
            <div className="admin-form-card">
              <h2 className="admin-form-title">➕ Create New Semester</h2>
              <form onSubmit={handleCreateSemester} className="admin-form">
                <div className="admin-form-row">
                  <select
                    value={semesterForm.courseId}
                    onChange={(e) => setSemesterForm({ ...semesterForm, courseId: e.target.value })}
                    className="admin-input"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={semesterForm.number}
                    onChange={(e) => setSemesterForm({ ...semesterForm, number: parseInt(e.target.value) })}
                    className="admin-input"
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n}>Semester {n}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="admin-btn admin-btn-success admin-btn-full"
                >
                  Create Semester
                </button>
              </form>
            </div>

            {/* Semesters List */}
            <div className="admin-items-grid">
              {semesters.length > 0 ? (
                semesters.map(sem => (
                  <div key={sem._id} className="admin-item-card semester-card">
                    <h3 className="admin-item-title">Semester {sem.number}</h3>
                    <p className="admin-item-meta">{sem.course?.name}</p>
                    <button
                      onClick={() => handleDeleteSemester(sem._id)}
                      className="admin-btn admin-btn-danger admin-btn-full"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state">
                  <p>No semesters created yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBJECTS TAB */}
        {activeTab === 'subjects' && (
          <div className="admin-section">
            {/* Create Form */}
            <div className="admin-form-card">
              <h2 className="admin-form-title">➕ Create New Subject</h2>
              <form onSubmit={handleCreateSubject} className="admin-form">
                <div className="admin-form-row">
                  <select
                    value={subjectForm.courseId}
                    onChange={(e) => setSubjectForm({ ...subjectForm, courseId: e.target.value, branchId: '', semesterId: '' })}
                    className="admin-input"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={subjectForm.branchId}
                    onChange={(e) => setSubjectForm({ ...subjectForm, branchId: e.target.value })}
                    className="admin-input"
                    disabled={!subjectForm.courseId}
                    required
                  >
                    <option value="">Select Branch</option>
                    {getFilteredBranchesForSubject().map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>

                  <select
                    value={subjectForm.semesterId}
                    onChange={(e) => setSubjectForm({ ...subjectForm, semesterId: e.target.value })}
                    className="admin-input"
                    disabled={!subjectForm.courseId}
                    required
                  >
                    <option value="">Select Semester</option>
                    {getFilteredSemestersForSubject().map(s => (
                      <option key={s._id} value={s._id}>Semester {s.number}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-row">
                  <input
                    type="text"
                    placeholder="Subject name"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    className="admin-input"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Subject code (e.g., CS201)"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  className="admin-textarea"
                  rows="3"
                />

                <button
                  type="submit"
                  className="admin-btn admin-btn-success admin-btn-full"
                >
                  Create Subject
                </button>
              </form>
            </div>

            {/* Subjects List */}
            <div className="admin-items-list">
              {subjects.length > 0 ? (
                subjects.map(sub => (
                  <div key={sub._id} className="admin-list-item subject-item">
                    <div className="item-info">
                      <h3 className="admin-item-title">{sub.name}</h3>
                      <p className="admin-item-meta">Code: {sub.code} | Credits: {sub.credits}</p>
                      <p className="admin-item-path">
                        {sub.course?.name} → {sub.branch?.name} → Sem {sub.semester?.number}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSubject(sub._id)}
                      className="admin-btn admin-btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state">
                  <p>No subjects created yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="admin-section">
            <h2 className="admin-section-title">📚 Resource Approval System</h2>

            {/* Pending Resources */}
            <div className="admin-resource-section">
              <h3 className="admin-subsection-title pending">⏳ Pending Approval ({resources.filter(r => !r.approved).length})</h3>
              <div className="admin-resources-list">
                {resources.filter(r => !r.approved).length > 0 ? (
                  resources.filter(r => !r.approved).map(resource => (
                    <div key={resource._id} className="admin-resource-item pending-resource">
                      <div className="resource-content">
                        <h4 className="resource-title">{resource.title}</h4>
                        <p className="resource-description">{resource.description}</p>
                        <div className="resource-meta">
                          <span>📄 {resource.type}</span>
                          <span>👤 {resource.uploadedBy?.name}</span>
                          <span>📚 {resource.subject?.name}</span>
                        </div>
                      </div>
                      <div className="resource-actions">
                        <button
                          onClick={() => handleApproveResource(resource._id)}
                          className="admin-btn admin-btn-success"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleDeleteResource(resource._id)}
                          className="admin-btn admin-btn-danger"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="admin-empty-state">
                    <p>No pending resources</p>
                  </div>
                )}
              </div>
            </div>

            {/* Approved Resources */}
            <div className="admin-resource-section">
              <h3 className="admin-subsection-title approved">✓ Approved ({resources.filter(r => r.approved).length})</h3>
              <div className="admin-items-grid">
                {resources.filter(r => r.approved).length > 0 ? (
                  resources.filter(r => r.approved).map(resource => (
                    <div key={resource._id} className="admin-item-card resource-card">
                      <h4 className="admin-item-title line-clamp-2">{resource.title}</h4>
                      <p className="resource-type">{resource.type}</p>
                      <div className="resource-stats">
                        <span>👁️ {resource.views}</span>
                        <span>⬇️ {resource.downloads}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteResource(resource._id)}
                        className="admin-btn admin-btn-danger admin-btn-full"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="admin-empty-state">
                    <p>No approved resources</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="admin-section">
            {/* Upload Form */}
            <div className="admin-form-card">
              <h2 className="admin-form-title">📝 Upload Notes</h2>
              <form onSubmit={handleUploadNotes} className="admin-form">
                <input
                  type="text"
                  placeholder="Notes Title"
                  value={notesForm.title}
                  onChange={(e) => setNotesForm({ ...notesForm, title: e.target.value })}
                  className="admin-input"
                  required
                />
                <input
                  type="text"
                  placeholder="Subject Name"
                  value={notesForm.subject}
                  onChange={(e) => setNotesForm({ ...notesForm, subject: e.target.value })}
                  className="admin-input"
                  required
                />
                <input
                  type="number"
                  placeholder="Semester"
                  value={notesForm.semester}
                  onChange={(e) => setNotesForm({ ...notesForm, semester: e.target.value })}
                  className="admin-input"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={notesForm.description}
                  onChange={(e) => setNotesForm({ ...notesForm, description: e.target.value })}
                  className="admin-textarea"
                  rows="3"
                />
                <input
                  type="file"
                  onChange={(e) => setNotesForm({ ...notesForm, file: e.target.files[0] })}
                  className="admin-input"
                  accept=".pdf,.doc,.docx,.txt"
                  required
                />
                <button type="submit" className="admin-btn admin-btn-primary admin-btn-full">
                  Upload Notes
                </button>
              </form>
            </div>

            {/* Notes List */}
            <div className="admin-items-list">
              <h3 className="admin-subsection-title">Uploaded Notes ({notes.length})</h3>
              {notes.length > 0 ? (
                notes.map(note => (
                  <div key={note._id} className="admin-list-item resource-item">
                    <div className="item-info">
                      <h4 className="admin-item-title">{note.title}</h4>
                      <p className="admin-item-meta">{note.subject} - Semester {note.semester}</p>
                      <p className="admin-item-description">{note.description}</p>
                      <p className="admin-item-downloads">⬇️ Downloads: {note.downloads || 0}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNotes(note._id)}
                      className="admin-btn admin-btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state">
                  <p>No notes uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PYQ TAB */}
        {activeTab === 'pyq' && (
          <div className="admin-section">
            {/* Upload Form */}
            <div className="admin-form-card">
              <h2 className="admin-form-title">📋 Upload PYQ (Previous Year Questions)</h2>
              <form onSubmit={handleUploadPYQ} className="admin-form">
                <input
                  type="text"
                  placeholder="PYQ Title"
                  value={pyqForm.title}
                  onChange={(e) => setPyqForm({ ...pyqForm, title: e.target.value })}
                  className="admin-input"
                  required
                />
                <input
                  type="text"
                  placeholder="Subject Name"
                  value={pyqForm.subject}
                  onChange={(e) => setPyqForm({ ...pyqForm, subject: e.target.value })}
                  className="admin-input"
                  required
                />
                <div className="admin-form-row">
                  <input
                    type="number"
                    placeholder="Semester"
                    value={pyqForm.semester}
                    onChange={(e) => setPyqForm({ ...pyqForm, semester: e.target.value })}
                    className="admin-input"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Year"
                    value={pyqForm.year}
                    onChange={(e) => setPyqForm({ ...pyqForm, year: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={pyqForm.description}
                  onChange={(e) => setPyqForm({ ...pyqForm, description: e.target.value })}
                  className="admin-textarea"
                  rows="3"
                />
                <input
                  type="file"
                  onChange={(e) => setPyqForm({ ...pyqForm, file: e.target.files[0] })}
                  className="admin-input"
                  accept=".pdf,.doc,.docx,.txt"
                  required
                />
                <button type="submit" className="admin-btn admin-btn-primary admin-btn-full">
                  Upload PYQ
                </button>
              </form>
            </div>

            {/* PYQ List */}
            <div className="admin-items-list">
              <h3 className="admin-subsection-title">Uploaded PYQ ({pyqs.length})</h3>
              {pyqs.length > 0 ? (
                pyqs.map(pyq => (
                  <div key={pyq._id} className="admin-list-item resource-item">
                    <div className="item-info">
                      <h4 className="admin-item-title">{pyq.title}</h4>
                      <p className="admin-item-meta">{pyq.subject} - Semester {pyq.semester} - Year {pyq.year}</p>
                      <p className="admin-item-description">{pyq.description}</p>
                      <p className="admin-item-downloads">⬇️ Downloads: {pyq.downloads || 0}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNotes(pyq._id)}
                      className="admin-btn admin-btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state">
                  <p>No PYQ uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SYLLABUS TAB */}
        {activeTab === 'syllabus' && (
          <div className="admin-section">
            {/* Upload Form */}
            <div className="admin-form-card">
              <h2 className="admin-form-title">📚 Upload Syllabus</h2>
              <form onSubmit={handleUploadSyllabus} className="admin-form">
                <input
                  type="text"
                  placeholder="Syllabus Title"
                  value={syllabusForm.title}
                  onChange={(e) => setSyllabusForm({ ...syllabusForm, title: e.target.value })}
                  className="admin-input"
                  required
                />
                <input
                  type="text"
                  placeholder="Subject Name"
                  value={syllabusForm.subject}
                  onChange={(e) => setSyllabusForm({ ...syllabusForm, subject: e.target.value })}
                  className="admin-input"
                  required
                />
                <input
                  type="number"
                  placeholder="Semester"
                  value={syllabusForm.semester}
                  onChange={(e) => setSyllabusForm({ ...syllabusForm, semester: e.target.value })}
                  className="admin-input"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={syllabusForm.description}
                  onChange={(e) => setSyllabusForm({ ...syllabusForm, description: e.target.value })}
                  className="admin-textarea"
                  rows="3"
                />
                <input
                  type="file"
                  onChange={(e) => setSyllabusForm({ ...syllabusForm, file: e.target.files[0] })}
                  className="admin-input"
                  accept=".pdf,.doc,.docx,.txt"
                  required
                />
                <button type="submit" className="admin-btn admin-btn-primary admin-btn-full">
                  Upload Syllabus
                </button>
              </form>
            </div>

            {/* Syllabus List */}
            <div className="admin-items-list">
              <h3 className="admin-subsection-title">Uploaded Syllabus ({syllabuses.length})</h3>
              {syllabuses.length > 0 ? (
                syllabuses.map(syllabus => (
                  <div key={syllabus._id} className="admin-list-item resource-item">
                    <div className="item-info">
                      <h4 className="admin-item-title">{syllabus.title}</h4>
                      <p className="admin-item-meta">{syllabus.subject} - Semester {syllabus.semester}</p>
                      <p className="admin-item-description">{syllabus.description}</p>
                      <p className="admin-item-downloads">⬇️ Downloads: {syllabus.downloads || 0}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNotes(syllabus._id)}
                      className="admin-btn admin-btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state">
                  <p>No syllabus uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
    </>
  );
}
