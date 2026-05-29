import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { courseAPI, branchAPI, semesterAPI, subjectAPI, resourceAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { useToast } from '../components/Toast';
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

  const [tabMode, setTabMode] = useState({
    courses: 'list',
    branches: 'list',
    semesters: 'list',
    subjects: 'list',
    resources: 'list'
  });

  const [submitLoading, setSubmitLoading] = useState({
    courses: false,
    branches: false,
    semesters: false,
    subjects: false,
    resources: false
  });

  const showToast = useToast();

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
  const [resourceForm, setResourceForm] = useState({
    courseId: '',
    branchId: '',
    semesterId: '',
    subjectId: '',
    title: '',
    description: '',
    type: 'note',
    file: null
  });

  // toasts handled by ToastProvider
  useEffect(() => {
    // Use localStorage so we don't depend on Redux timing during mount
    const localToken = localStorage.getItem('token');
    const localRole = localStorage.getItem('userRole') || localStorage.getItem('role');

    if (!localToken) {
      navigate('/login');
      return;
    }
    if (localRole !== 'admin') {
      navigate('/student-dashboard');
      return;
    }

    fetchAllData();
    // run once on mount
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [coursesRes, branchesRes, semestersRes, subjectsRes, resourcesRes] = await Promise.all([
        courseAPI.getAllCourses(),
        branchAPI.getAllBranches(),
        semesterAPI.getAllSemesters({}),
        subjectAPI.getAllSubjects({}),
        resourceAPI.getAllResources({ limit: 100 })
      ]);

      setCourses(coursesRes.data.courses);
      setBranches(branchesRes.data.branches);
      setSemesters(semestersRes.data.semesters);
      setSubjects(subjectsRes.data.subjects);
      setResources(resourcesRes.data.resources);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Error loading data: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const setMode = (tab, mode) => {
    setTabMode(prev => ({ ...prev, [tab]: mode }));
  };

  const setSubmitting = (tab, value) => {
    setSubmitLoading(prev => ({ ...prev, [tab]: value }));
  };

  // COURSE OPERATIONS
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setSubmitting('courses', true);
    try {
      await courseAPI.createCourse({ name: courseForm.name });
      setCourseForm({ name: '' });
      fetchAllData();
      showToast('Course created successfully', 'success');
    } catch (error) {
      showToast('Error: ' + (error.response?.data?.message || error.message), 'error');
    }
    setSubmitting('courses', false);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Delete this course and all related data?')) {
      try {
        await courseAPI.deleteCourse(id);
        fetchAllData();
        showToast('Course deleted successfully', 'success');
      } catch (error) {
        showToast('Error: ' + (error.response?.data?.message || error.message), 'error');
      }
    }
  };

  // BRANCH OPERATIONS
  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!branchForm.courseId) {
      showToast('Select a course', 'error');
      return;
    }
    setSubmitting('branches', true);
    try {
      await branchAPI.createBranch(branchForm);
      setBranchForm({ name: '', code: '', courseId: '' });
      fetchAllData();
      showToast('Branch created successfully', 'success');
    } catch (error) {
      showToast('Error: ' + (error.response?.data?.message || error.message), 'error');
    }
    setSubmitting('branches', false);
  };
  const handleDeleteBranch = async (id) => {
    if (window.confirm('Delete this branch?')) {
      try {
        await branchAPI.deleteBranch(id);
        fetchAllData();
        showToast('Branch deleted', 'success');
      } catch (error) {
        showToast('Error: ' + (error.response?.data?.message || error.message), 'error');
      }
    }
  };

  // SEMESTER OPERATIONS
  const handleCreateSemester = async (e) => {
    e.preventDefault();
    if (!semesterForm.courseId) {
      showToast('Select a course', 'error');
      return;
    }
    setSubmitting('semesters', true);
    try {
      await semesterAPI.createSemester(semesterForm);
      setSemesterForm({ number: '', courseId: '' });
      fetchAllData();
      showToast('Semester created successfully', 'success');
    } catch (error) {
      showToast('Error: ' + (error.response?.data?.message || error.message), 'error');
    }
    setSubmitting('semesters', false);
  };

  const handleDeleteSemester = async (id) => {
    if (window.confirm('Delete this semester?')) {
      try {
        await semesterAPI.deleteSemester(id);
        fetchAllData();
        showToast('Semester deleted', 'success');
      } catch (error) {
        showToast('Error: ' + (error.response?.data?.message || error.message), 'error');
      }
    }
  };

  // SUBJECT OPERATIONS
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!subjectForm.courseId || !subjectForm.branchId || !subjectForm.semesterId) {
      showToast('Select course, branch, and semester', 'error');
      return;
    }
    setSubmitting('subjects', true);
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
      showToast('Subject created successfully', 'success');
    } catch (error) {
      showToast('Error: ' + (error.response?.data?.message || error.message), 'error');
    }
    setSubmitting('subjects', false);
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Delete this subject?')) {
      try {
        await subjectAPI.deleteSubject(id);
        fetchAllData();
        showToast('Subject deleted', 'success');
      } catch (error) {
        showToast('Error: ' + (error.response?.data?.message || error.message), 'error');
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
    ? branches.filter(b => (b.course?._id || b.course) === branchForm.courseId) 
    : [];

  const getFilteredSemesters = () => semesterForm.courseId 
    ? semesters.filter(s => (s.course?._id || s.course) === semesterForm.courseId) 
    : [];

  const getFilteredBranchesForSubject = () => subjectForm.courseId 
    ? branches.filter(b => (b.course?._id || b.course) === subjectForm.courseId) 
    : [];

  const getFilteredSemestersForSubject = () => subjectForm.courseId 
    ? semesters.filter(s => (s.course?._id || s.course) === subjectForm.courseId) 
    : [];

  const getFilteredBranchesForResource = () => resourceForm.courseId
    ? branches.filter(b => (b.course?._id || b.course) === resourceForm.courseId)
    : [];

  const getFilteredSemestersForResource = () => resourceForm.courseId
    ? semesters.filter(s => (s.course?._id || s.course) === resourceForm.courseId)
    : [];

  const getFilteredSubjectsForResource = () => {
    return subjects.filter(subject => {
      const subjectCourseId = subject.course?._id || subject.course;
      const subjectBranchId = subject.branch?._id || subject.branch;
      const subjectSemesterId = subject.semester?._id || subject.semester;

      return (!resourceForm.courseId || subjectCourseId === resourceForm.courseId) &&
        (!resourceForm.branchId || subjectBranchId === resourceForm.branchId) &&
        (!resourceForm.semesterId || subjectSemesterId === resourceForm.semesterId);
    });
  };

  const handleUploadResource = async (e) => {
    e.preventDefault();

    if (!resourceForm.file) {
      showToast('Select a file to upload', 'error');
      return;
    }

    try {
      setSubmitting('resources', true);
      const formData = new FormData();
      formData.append('title', resourceForm.title);
      formData.append('description', resourceForm.description);
      formData.append('type', resourceForm.type);
      formData.append('subjectId', resourceForm.subjectId);
      formData.append('file', resourceForm.file);

      await resourceAPI.createResource(formData);
      setResourceForm({
        courseId: '',
        branchId: '',
        semesterId: '',
        subjectId: '',
        title: '',
        description: '',
        type: 'note',
        file: null
      });
      fetchAllData();
      showToast('Resource uploaded successfully', 'success');
    } catch (error) {
      showToast('Upload failed: ' + (error.response?.data?.message || error.message), 'error');
    }
    setSubmitting('resources', false);
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
    

        {/* Navigation Tabs */}
        <div className="admin-tabs-container">
        <div className="admin-tabs">
            {['dashboard', 'courses', 'branches', 'semesters', 'subjects', 'resources'].map(tab => (
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
            <div className="admin-toggle">
              <button
                className={`admin-toggle-btn ${tabMode.courses === 'list' ? 'active' : ''}`}
                onClick={() => setMode('courses', 'list')}
              >
                View Courses
              </button>
              <button
                className={`admin-toggle-btn ${tabMode.courses === 'form' ? 'active' : ''}`}
                onClick={() => setMode('courses', 'form')}
              >
                Add Course
              </button>
            </div>

            {tabMode.courses === 'form' ? (
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
                    disabled={submitLoading.courses}
                  >
                    {submitLoading.courses ? (<><span className="btn-spinner"></span>Creating...</>) : 'Create Course'}
                  </button>
                </form>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {/* BRANCHES TAB */}
        {activeTab === 'branches' && (
          <div className="admin-section">
            <div className="admin-toggle">
              <button
                className={`admin-toggle-btn ${tabMode.branches === 'list' ? 'active' : ''}`}
                onClick={() => setMode('branches', 'list')}
              >
                View Branches
              </button>
              <button
                className={`admin-toggle-btn ${tabMode.branches === 'form' ? 'active' : ''}`}
                onClick={() => setMode('branches', 'form')}
              >
                Add Branch
              </button>
            </div>

            {tabMode.branches === 'form' ? (
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
                    disabled={submitLoading.branches}
                  >
                    {submitLoading.branches ? (<><span className="btn-spinner"></span>Creating...</>) : 'Create Branch'}
                  </button>
                </form>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {/* SEMESTERS TAB */}
        {activeTab === 'semesters' && (
          <div className="admin-section">
            <div className="admin-toggle">
              <button
                className={`admin-toggle-btn ${tabMode.semesters === 'list' ? 'active' : ''}`}
                onClick={() => setMode('semesters', 'list')}
              >
                View Semesters
              </button>
              <button
                className={`admin-toggle-btn ${tabMode.semesters === 'form' ? 'active' : ''}`}
                onClick={() => setMode('semesters', 'form')}
              >
                Add Semester
              </button>
            </div>

            {tabMode.semesters === 'form' ? (
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
                    disabled={submitLoading.semesters}
                  >
                    {submitLoading.semesters ? (<><span className="btn-spinner"></span>Creating...</>) : 'Create Semester'}
                  </button>
                </form>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {/* SUBJECTS TAB */}
        {activeTab === 'subjects' && (
          <div className="admin-section">
            <div className="admin-toggle">
              <button
                className={`admin-toggle-btn ${tabMode.subjects === 'list' ? 'active' : ''}`}
                onClick={() => setMode('subjects', 'list')}
              >
                View Subjects
              </button>
              <button
                className={`admin-toggle-btn ${tabMode.subjects === 'form' ? 'active' : ''}`}
                onClick={() => setMode('subjects', 'form')}
              >
                Add Subject
              </button>
            </div>

            {tabMode.subjects === 'form' ? (
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
                    disabled={submitLoading.subjects}
                  >
                    {submitLoading.subjects ? (<><span className="btn-spinner"></span>Creating...</>) : 'Create Subject'}
                  </button>
                </form>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="admin-section">
            <div className="admin-toggle">
              <button
                className={`admin-toggle-btn ${tabMode.resources === 'list' ? 'active' : ''}`}
                onClick={() => setMode('resources', 'list')}
              >
                View Resources
              </button>
              <button
                className={`admin-toggle-btn ${tabMode.resources === 'form' ? 'active' : ''}`}
                onClick={() => setMode('resources', 'form')}
              >
                Upload Resource
              </button>
            </div>

            {tabMode.resources === 'form' ? (
              <div className="admin-form-card admin-form-card-light">
                <h2 className="admin-form-title admin-form-title-accent">⬆️ Upload Notes / PYQ / Question Bank</h2>
                <form onSubmit={handleUploadResource} className="admin-form">
                  <div className="admin-form-row">
                    <select
                      value={resourceForm.courseId}
                      onChange={(e) => setResourceForm({ ...resourceForm, courseId: e.target.value, branchId: '', semesterId: '', subjectId: '' })}
                      className="admin-input"
                      required
                    >
                      <option value="">Select Course</option>
                      {courses.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>

                    <select
                      value={resourceForm.branchId}
                      onChange={(e) => setResourceForm({ ...resourceForm, branchId: e.target.value, subjectId: '' })}
                      className="admin-input"
                      disabled={!resourceForm.courseId}
                      required
                    >
                      <option value="">Select Branch</option>
                      {getFilteredBranchesForResource().map(branch => (
                        <option key={branch._id} value={branch._id}>{branch.name}</option>
                      ))}
                    </select>

                    <select
                      value={resourceForm.semesterId}
                      onChange={(e) => setResourceForm({ ...resourceForm, semesterId: e.target.value, subjectId: '' })}
                      className="admin-input"
                      disabled={!resourceForm.courseId}
                      required
                    >
                      <option value="">Select Semester</option>
                      {getFilteredSemestersForResource().map(semester => (
                        <option key={semester._id} value={semester._id}>Semester {semester.number}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-row">
                    <select
                      value={resourceForm.subjectId}
                      onChange={(e) => setResourceForm({ ...resourceForm, subjectId: e.target.value })}
                      className="admin-input"
                      disabled={!resourceForm.courseId || !resourceForm.branchId || !resourceForm.semesterId}
                      required
                    >
                      <option value="">Select Subject</option>
                      {getFilteredSubjectsForResource().map(subject => (
                        <option key={subject._id} value={subject._id}>{subject.name} ({subject.code})</option>
                      ))}
                    </select>

                    <select
                      value={resourceForm.type}
                      onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                      className="admin-input"
                      required
                    >
                      <option value="note">Note</option>
                      <option value="pyq">PYQ</option>
                      <option value="question-bank">Question Bank</option>
                      <option value="syllabus">Syllabus</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    placeholder="Resource title"
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                    className="admin-input"
                    required
                  />

                  <textarea
                    placeholder="Description"
                    value={resourceForm.description}
                    onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                    className="admin-textarea"
                    rows="3"
                  />

                  <input
                    type="file"
                    onChange={(e) => setResourceForm({ ...resourceForm, file: e.target.files[0] })}
                    className="admin-input"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                    required
                  />

                  <button type="submit" className="admin-btn admin-btn-primary admin-btn-full" disabled={submitLoading.resources}>
                    {submitLoading.resources ? (<><span className="btn-spinner"></span>Uploading...</>) : 'Upload Resource'}
                  </button>
                </form>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}

      </div>
    </div>
    </>
  );
}
