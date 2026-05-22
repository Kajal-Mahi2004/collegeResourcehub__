import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { subjectAPI, resourceAPI } from '../services/api';

export default function UploadResource() {
  const { token, role } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'note',
    subjectId: '',
    fileUrl: '',
    fileSize: '',
    mimeType: ''
  });

  const resourceTypes = ['note', 'pyq', 'syllabus', 'question-bank', 'assignment', 'lab-manual', 'ebook'];

  useEffect(() => {
    if (!token || (role !== 'teacher' && role !== 'admin')) {
      navigate('/login');
      return;
    }

    const fetchSubjects = async () => {
      try {
        const response = await subjectAPI.getAllSubjects({});
        setSubjects(response.data.subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, [token, role, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // For demo, we'll use a placeholder URL
      // In production, upload to Cloudinary first
      setFormData({
        ...formData,
        fileUrl: URL.createObjectURL(file),
        fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        mimeType: file.type
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.title || !formData.type || !formData.subjectId || !formData.fileUrl) {
        alert('Please fill all fields');
        setLoading(false);
        return;
      }

      const response = await resourceAPI.createResource(formData);
      alert('Resource uploaded successfully! Awaiting admin approval.');
      setFormData({
        title: '',
        description: '',
        type: 'note',
        subjectId: '',
        fileUrl: '',
        fileSize: '',
        mimeType: ''
      });
      navigate('/dashboard');
    } catch (error) {
      alert('Error uploading resource: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto bg-slate-800 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Resource</h1>
        <p className="text-gray-400 mb-6">Share study materials with students</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Selection */}
          <div>
            <label className="block text-white font-semibold mb-2">Subject *</label>
            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-500 outline-none"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-white font-semibold mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., DBMS Lecture Notes"
              className="w-full px-4 py-2 rounded bg-slate-700 text-white placeholder-gray-500 border border-slate-600 focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add details about this resource..."
              rows="4"
              className="w-full px-4 py-2 rounded bg-slate-700 text-white placeholder-gray-500 border border-slate-600 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Resource Type */}
          <div>
            <label className="block text-white font-semibold mb-2">Resource Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-500 outline-none"
            >
              {resourceTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-white font-semibold mb-2">Upload File *</label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <p className="text-gray-400">
                  {formData.fileUrl ? '✓ File selected' : 'Click to upload or drag and drop'}
                </p>
                {formData.fileSize && (
                  <p className="text-sm text-gray-500 mt-2">Size: {formData.fileSize}</p>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Resource'}
          </button>

          <p className="text-gray-400 text-sm">
            ℹ️ Your resource will be reviewed by admin before becoming visible to students.
          </p>
        </form>
      </div>
    </div>
  );
}
