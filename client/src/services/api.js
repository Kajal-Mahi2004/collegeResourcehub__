import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  adminSignup: (data) => api.post("/auth/admin/signup", data),
  adminLogin: (data) => api.post("/auth/admin/login", data),
};

// Course APIs
export const courseAPI = {
  getAllCourses: () => api.get("/courses"),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post("/courses", data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// Branch APIs
export const branchAPI = {
  getAllBranches: () => api.get("/branches"),
  getBranchesByCourse: (courseId) => api.get(`/branches/course/${courseId}`),
  getBranch: (id) => api.get(`/branches/${id}`),
  createBranch: (data) => api.post("/branches", data),
  updateBranch: (id, data) => api.put(`/branches/${id}`, data),
  deleteBranch: (id) => api.delete(`/branches/${id}`),
};

// Semester APIs
export const semesterAPI = {
  getAllSemesters: (params) => api.get("/semesters", { params }),
  getSemestersByCourse: (courseId) => api.get(`/semesters/course/${courseId}`),
  getSemester: (id) => api.get(`/semesters/${id}`),
  createSemester: (data) => api.post("/semesters", data),
  updateSemester: (id, data) => api.put(`/semesters/${id}`, data),
  deleteSemester: (id) => api.delete(`/semesters/${id}`),
};

// Subject APIs
export const subjectAPI = {
  getAllSubjects: (params) => api.get("/subjects", { params }),
  getSubjectsByFilter: (courseId, branchId, semesterId) => 
    api.get(`/subjects/filter/${courseId}/${branchId}/${semesterId}`),
  getSubject: (id) => api.get(`/subjects/${id}`),
  createSubject: (data) => api.post("/subjects", data),
  updateSubject: (id, data) => api.put(`/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/subjects/${id}`),
};

// Resource APIs
export const resourceAPI = {
  getAllResources: (params) => api.get("/resources", { params }),
  getResourcesBySubject: (subjectId, params) => 
    api.get(`/resources/subject/${subjectId}`, { params }),
  getResource: (id) => api.get(`/resources/${id}`),
  createResource: (data) => api.post("/resources", data),
  updateResource: (id, data) => api.put(`/resources/${id}`, data),
  approveResource: (id) => api.post(`/resources/${id}/approve`),
  deleteResource: (id) => api.delete(`/resources/${id}`),
  incrementDownloads: (id) => api.post(`/resources/${id}/download`),
};

// Admin APIs (legacy)
export const adminAPI = {
  uploadNotes: (formData) => api.post("/admin/notes/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  uploadPYQ: (formData) => api.post("/admin/pyq/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  uploadSyllabus: (formData) => api.post("/admin/syllabus/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  deleteNotes: (id) => api.delete(`/admin/notes/${id}`),
};

// Student APIs (legacy)
export const studentAPI = {
  getNotes: (filters) => api.get("/admin/notes", { params: filters }),
  getPYQ: (filters) => api.get("/admin/pyq", { params: filters }),
  getSyllabus: (filters) => api.get("/admin/syllabus", { params: filters }),
};

export default api;
