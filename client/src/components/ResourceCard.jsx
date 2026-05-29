import React from 'react';

export default function ResourceCard({ resource }) {
  const getTypeColor = (type) => {
    const colors = {
      note: 'bg-blue-600',
      pyq: 'bg-green-600',
      syllabus: 'bg-purple-600',
      'question-bank': 'bg-orange-600',
      assignment: 'bg-red-600',
      'lab-manual': 'bg-pink-600',
      ebook: 'bg-indigo-600'
    };
    return colors[type] || 'bg-gray-600';
  };

  return (
    <div className="bg-slate-700 rounded-lg overflow-hidden hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 cursor-pointer">
      {/* Card Header */}
      <div className={`${getTypeColor(resource.type)} h-16 flex items-center px-4`}>
        <span className="text-white font-bold capitalize">{resource.type}</span>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{resource.title}</h3>
        
        {resource.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{resource.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400 text-sm">By {resource.uploadedBy?.name}</span>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-4 text-gray-400 text-sm">
          <span>👁️ {resource.views}</span>
          <span>⬇️ {resource.downloads}</span>
        </div>

        {/* Open Button */}
        <button
          onClick={() => window.open(resource.fileUrl, '_blank', 'noopener,noreferrer')}
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
        >
          Open Resource
        </button>
      </div>
    </div>
  );
}
