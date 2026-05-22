import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { courseAPI, branchAPI, semesterAPI, subjectAPI, resourceAPI } from '../services/api';

export default function AdminDashboard() {
  const { user, role } = useSelector(state => state.auth);
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

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAllData();
  }, [role, navigate]);

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

  if (loading && courses.length === 0) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b-2 border-blue-600 p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">🎓 Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage all academic resources and structure</p>
          </div>
          <div className="text-right">
            <p className="text-gray-300">Welcome, <span className="font-bold text-blue-400">{user?.name}</span></p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-4 py-4">
          {['dashboard', 'courses', 'branches', 'semesters', 'subjects', 'resources'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
              <p className="text-gray-200 text-sm">Total Courses</p>
              <p className="text-4xl font-bold mt-2">{courses.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
              <p className="text-gray-200 text-sm">Total Branches</p>
              <p className="text-4xl font-bold mt-2">{branches.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white shadow-lg">
              <p className="text-gray-200 text-sm">Total Subjects</p>
              <p className="text-4xl font-bold mt-2">{subjects.length}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-6 text-white shadow-lg">
              <p className="text-gray-200 text-sm">Pending Resources</p>
              <p className="text-4xl font-bold mt-2">{resources.filter(r => !r.approved).length}</p>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Create Form */}
            <div className="bg-slate-700 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">➕ Create New Course</h2>
              <form onSubmit={handleCreateCourse} className="flex gap-4">
                <input
                  type="text"
                  placeholder="BTech, MTech, Pharmacy, Diploma"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ name: e.target.value })}
                  className="flex-1 px-4 py-2 rounded bg-slate-600 text-white placeholder-gray-400 border border-slate-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold transition-all"
                >
                  Create Course
                </button>
              </form>
            </div>

            {/* Courses List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(course => (
                <div key={course._id} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-all shadow-md">
                  <h3 className="text-xl font-bold text-white mb-2">{course.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">ID: {course._id.substring(0, 8)}...</p>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold transition-all"
                  >
                    Delete Course
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BRANCHES TAB */}
        {activeTab === 'branches' && (
          <div className="space-y-6">
            {/* Create Form */}
            <div className="bg-slate-700 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">➕ Create New Branch</h2>
              <form onSubmit={handleCreateBranch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={branchForm.courseId}
                    onChange={(e) => setBranchForm({ ...branchForm, courseId: e.target.value })}
                    className="px-4 py-2 rounded bg-slate-600 text-white border border-slate-500"
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
                    className="px-4 py-2 rounded bg-slate-600 text-white placeholder-gray-400 border border-slate-500"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Code (e.g., CS)"
                    value={branchForm.code}
                    onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                    className="px-4 py-2 rounded bg-slate-600 text-white placeholder-gray-400 border border-slate-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold transition-all"
                >
                  Create Branch
                </button>
              </form>
            </div>

            {/* Branches List */}
            <div className="space-y-3">
              {branches.map(branch => (
                <div key={branch._id} className="bg-slate-700 rounded-lg p-4 flex justify-between items-center hover:bg-slate-600 transition-all shadow-md">
                  <div>
                    <h3 className="text-lg font-bold text-white">{branch.name}</h3>
                    <p className="text-gray-400 text-sm">Code: {branch.code} | Course: {branch.course?.name}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteBranch(branch._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition-all"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEMESTERS TAB */}
        {activeTab === 'semesters' && (
          <div className="space-y-6">
            {/* Create Form */}
            <div className="bg-slate-700 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">➕ Create New Semester</h2>
              <form onSubmit={handleCreateSemester} className="flex gap-4">
                <select
                  value={semesterForm.courseId}
                  onChange={(e) => setSemesterForm({ ...semesterForm, courseId: e.target.value })}
                  className="flex-1 px-4 py-2 rounded bg-slate-600 text-white border border-slate-500"
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
                  className="flex-1 px-4 py-2 rounded bg-slate-600 text-white border border-slate-500"
                  required
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>Semester {n}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold transition-all"
                >
                  Create Semester
                </button>
              </form>
            </div>

            {/* Semesters List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {semesters.map(sem => (
                <div key={sem._id} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-all shadow-md">
                  <h3 className="text-2xl font-bold text-white mb-2">Semester {sem.number}</h3>
                  <p className="text-gray-400 text-sm mb-4">{sem.course?.name}</p>
                  <button
                    onClick={() => handleDeleteSemester(sem._id)}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold transition-all"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBJECTS TAB */}
        {activeTab === 'subjects' && (
          <div className="space-y-6">
            {/* Create Form */}
            <div className="bg-slate-700 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">➕ Create New Subject</h2>
              <form onSubmit={handleCreateSubject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={subjectForm.courseId}
                    onChange={(e) => setSubjectForm({ ...subjectForm, courseId: e.target.value, branchId: '', semesterId: '' })}
                    className="px-4 py-2 rounded bg-slate-600 text-white border border-slate-500"
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
                    className="px-4 py-2 rounded bg-slate-600 text-white border border-slate-500"
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
                    className="px-4 py-2 rounded bg-slate-600 text-white border border-slate-500"
                    disabled={!subjectForm.courseId}
                    required
                  >
                    <option value="">Select Semester</option>
                    {getFilteredSemestersForSubject().map(s => (
                      <option key={s._id} value={s._id}>Semester {s.number}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Subject name"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    className="px-4 py-2 rounded bg-slate-600 text-white placeholder-gray-400 border border-slate-500"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Subject code (e.g., CS201)"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    className="px-4 py-2 rounded bg-slate-600 text-white placeholder-gray-400 border border-slate-500"
                    required
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded bg-slate-600 text-white placeholder-gray-400 border border-slate-500"
                  rows="3"
                />

                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold transition-all"
                >
                  Create Subject
                </button>
              </form>
            </div>

            {/* Subjects List */}
            <div className="space-y-3">
              {subjects.map(sub => (
                <div key={sub._id} className="bg-slate-700 rounded-lg p-4 flex justify-between items-start hover:bg-slate-600 transition-all shadow-md">
                  <div>
                    <h3 className="text-lg font-bold text-white">{sub.name}</h3>
                    <p className="text-gray-400 text-sm">Code: {sub.code} | Credits: {sub.credits}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {sub.course?.name} → {sub.branch?.name} → Sem {sub.semester?.number}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteSubject(sub._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition-all"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">📚 Resource Approval System</h2>

            {/* Pending Resources */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">⏳ Pending Approval ({resources.filter(r => !r.approved).length})</h3>
              <div className="space-y-3">
                {resources.filter(r => !r.approved).length > 0 ? (
                  resources.filter(r => !r.approved).map(resource => (
                    <div key={resource._id} className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 flex justify-between items-start hover:bg-yellow-900/50 transition-all">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white">{resource.title}</h4>
                        <p className="text-gray-300 text-sm mt-1">{resource.description}</p>
                        <div className="flex gap-4 mt-3 text-sm text-gray-400">
                          <span>📄 Type: <span className="text-yellow-400 capitalize">{resource.type}</span></span>
                          <span>👤 By: {resource.uploadedBy?.name}</span>
                          <span>📚 Subject: {resource.subject?.name}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleApproveResource(resource._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold transition-all"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleDeleteResource(resource._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition-all"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-700 rounded-lg p-6 text-center">
                    <p className="text-gray-400">No pending resources</p>
                  </div>
                )}
              </div>
            </div>

            {/* Approved Resources */}
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-4">✓ Approved ({resources.filter(r => r.approved).length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.filter(r => r.approved).length > 0 ? (
                  resources.filter(r => r.approved).map(resource => (
                    <div key={resource._id} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-all shadow-md">
                      <h4 className="text-lg font-bold text-white line-clamp-2">{resource.title}</h4>
                      <p className="text-gray-400 text-sm mt-2">
                        <span className="inline-block bg-green-600/30 text-green-400 px-2 py-1 rounded capitalize text-xs">
                          {resource.type}
                        </span>
                      </p>
                      <div className="mt-3 flex justify-between text-gray-400 text-sm">
                        <span>👁️ {resource.views}</span>
                        <span>⬇️ {resource.downloads}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteResource(resource._id)}
                        className="w-full mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 bg-slate-700 rounded-lg p-6 text-center">
                    <p className="text-gray-400">No approved resources</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
