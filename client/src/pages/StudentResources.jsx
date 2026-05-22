import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './StudentResources.css';

export default function StudentResources() {
  const { user, token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [syllabuses, setSyllabuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    subject: '',
    semester: '',
    year: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAllResources();
  }, [token, navigate, filters]);

  const fetchAllResources = async () => {
    setLoading(true);
    try {
      const [notesRes, pyqsRes, syllabusRes] = await Promise.all([
        studentAPI.getNotes(filters),
        studentAPI.getPYQ(filters),
        studentAPI.getSyllabus(filters)
      ]);

      setNotes(notesRes.data || []);
      setPyqs(pyqsRes.data || []);
      setSyllabuses(syllabusRes.data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      alert('Error loading resources: ' + error.message);
    }
    setLoading(false);
  };

  const handleDownload = async (fileUrl, fileName, resourceId, resourceType) => {
    try {
      // Increment download count
      if (resourceType === 'notes') {
        await studentAPI.getNotes({}); // Trigger download count
        fetch('http://localhost:5000/api/admin/notes/' + resourceId + '/download', {
          method: 'POST'
        }).catch(err => console.log('Download count update failed'));
      } else if (resourceType === 'pyq') {
        fetch('http://localhost:5000/api/admin/pyq/' + resourceId + '/download', {
          method: 'POST'
        }).catch(err => console.log('Download count update failed'));
      } else if (resourceType === 'syllabus') {
        fetch('http://localhost:5000/api/admin/syllabus/' + resourceId + '/download', {
          method: 'POST'
        }).catch(err => console.log('Download count update failed'));
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'download';
      link.click();
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading file');
    }
  };

  const ResourceCard = ({ resource, type, onDownload }) => (
    <div className="resource-card">
      <div className="resource-header">
        <h3 className="resource-title">{resource.title}</h3>
        <span className="resource-badge">{type}</span>
      </div>
      <p className="resource-subject">📚 {resource.subject}</p>
      {resource.semester && (
        <p className="resource-semester">📅 Semester: {resource.semester}</p>
      )}
      {resource.year && (
        <p className="resource-year">📆 Year: {resource.year}</p>
      )}
      {resource.description && (
        <p className="resource-description">{resource.description}</p>
      )}
      <div className="resource-footer">
        <span className="download-count">⬇️ {resource.downloads || 0} downloads</span>
        <button
          onClick={() => onDownload(resource.fileUrl, resource.fileName, resource._id, type.toLowerCase())}
          className="download-btn"
        >
          📥 Download
        </button>
      </div>
    </div>
  );

  if (loading && notes.length === 0 && pyqs.length === 0 && syllabuses.length === 0) {
    return (
      <>
        <Navbar />
        <div className="student-resources-container">
          <div className="loading-spinner">Loading resources...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="student-resources-container">
        <div className="resources-header">
          <h1>📚 Study Resources</h1>
          <p>Download Notes, Previous Year Questions, and Syllabus</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <input
            type="text"
            placeholder="Filter by Subject"
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            className="filter-input"
          />
          <input
            type="number"
            placeholder="Filter by Semester"
            value={filters.semester}
            onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
            className="filter-input"
          />
          <button
            onClick={() => setFilters({ subject: '', semester: '', year: '' })}
            className="filter-btn reset-btn"
          >
            🔄 Clear Filters
          </button>
        </div>

        {/* Tabs */}
        <div className="resources-tabs">
          {[
            { id: 'notes', label: '📝 Notes', icon: '📝' },
            { id: 'pyq', label: '📋 PYQ', icon: '📋' },
            { id: 'syllabus', label: '📚 Syllabus', icon: '📚' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`resource-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="resources-content">
          {activeTab === 'notes' && (
            <div className="resources-section">
              <div className="section-header">
                <h2>📝 Notes ({notes.length})</h2>
                <p className="section-desc">Download study notes for each subject</p>
              </div>
              {notes.length > 0 ? (
                <div className="resources-grid">
                  {notes.map(note => (
                    <ResourceCard key={note._id} resource={note} type="Notes" onDownload={handleDownload} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>📭 No notes available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pyq' && (
            <div className="resources-section">
              <div className="section-header">
                <h2>📋 Previous Year Questions ({pyqs.length})</h2>
                <p className="section-desc">Download PYQ for exam preparation</p>
              </div>
              {pyqs.length > 0 ? (
                <div className="resources-grid">
                  {pyqs.map(pyq => (
                    <ResourceCard key={pyq._id} resource={pyq} type="PYQ" onDownload={handleDownload} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>📭 No PYQ available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div className="resources-section">
              <div className="section-header">
                <h2>📚 Syllabus ({syllabuses.length})</h2>
                <p className="section-desc">Download course syllabus</p>
              </div>
              {syllabuses.length > 0 ? (
                <div className="resources-grid">
                  {syllabuses.map(syllabus => (
                    <ResourceCard key={syllabus._id} resource={syllabus} type="Syllabus" onDownload={handleDownload} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>📭 No syllabus available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
