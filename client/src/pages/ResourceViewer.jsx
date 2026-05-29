import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { resourceAPI } from '../services/api';

export default function ResourceViewer() {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await resourceAPI.getResource(resourceId);
        setResource(response.data.resource);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resource:', error);
        setLoading(false);
      }
    };

    fetchResource();
  }, [resourceId]);

  const handleOpen = async () => {
    try {
      const fileUrl = resource?.fileUrl || `/api/resources/${resourceId}/file`;
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening resource:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!resource) {
    return <div className="flex justify-center items-center h-screen">Resource not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 capitalize">
            {resource.type}
          </span>
          <h1 className="text-4xl font-bold text-white mb-2">{resource.title}</h1>
          <p className="text-gray-400">
            Uploaded by: <span className="text-gray-200">{resource.uploadedBy?.name}</span>
          </p>
          <p className="text-gray-400">
            Subject: <span className="text-gray-200">{resource.subject?.name}</span>
          </p>

          <button
            onClick={handleOpen}
            className="w-full mt-3 px-8 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition-all duration-300"
          >
            Open Resource in New Tab
          </button>
        </div>

        {/* Description */}
        {resource.description && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
            <p className="text-gray-300">{resource.description}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Views</p>
            <p className="text-2xl font-bold text-white">{resource.views}</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Downloads</p>
            <p className="text-2xl font-bold text-white">{resource.downloads}</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">File Size</p>
            <p className="text-2xl font-bold text-white">{resource.fileSize}</p>
          </div>
        </div>

        {/* File Preview */}
        {resource.mimeType?.includes('pdf') && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
            <iframe
              src={resource.fileUrl || `/api/resources/${resourceId}/file`}
              className="w-full h-screen rounded-lg"
              title="PDF Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}
