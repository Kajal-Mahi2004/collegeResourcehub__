import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { subjectAPI, resourceAPI } from '../services/api';
import ResourceCard from '../components/ResourceCard';

export default function SubjectPage() {
  const { courseId, branchId, semesterId, subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  const resourceTypes = ['note', 'pyq', 'syllabus', 'question-bank', 'assignment', 'lab-manual', 'ebook'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectRes, resourcesRes] = await Promise.all([
          subjectAPI.getSubject(subjectId),
          resourceAPI.getResourcesBySubject(subjectId)
        ]);

        setSubject(subjectRes.data.subject);
        setResources(resourcesRes.data.resources);
        setFilteredResources(resourcesRes.data.resources);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectId]);

  const handleTypeFilter = (type) => {
    setSelectedType(type);
    if (type === 'all') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter(r => r.type === type));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Subject Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{subject?.name}</h1>
          <p className="text-gray-400">Code: {subject?.code}</p>
          <p className="text-gray-400">Credits: {subject?.credits}</p>
          {subject?.description && <p className="text-gray-300 mt-2">{subject.description}</p>}
        </div>

        {/* Resource Type Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Filter by Type</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTypeFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {resourceTypes.map(type => (
              <button
                key={type}
                onClick={() => handleTypeFilter(type)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Available Resources</h2>
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No resources available for this filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
