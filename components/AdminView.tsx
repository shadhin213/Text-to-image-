import React, { useState } from 'react';
import type { ImageRecord, Category } from '../types';
import { ImageCard } from './ImageCard';

const filterCategories: (Category | 'All')[] = ['All', 'General', 'Photography', 'Digital Art', 'Sci-Fi', 'Fantasy', 'Abstract'];

export const AdminView: React.FC<{ imageRecords: ImageRecord[] }> = ({ imageRecords }) => {
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');

  const filteredRecords = imageRecords.filter(record => 
    filterCategory === 'All' || record.category === filterCategory
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-slate-700 pb-4 mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h2>
        <p className="mt-2 text-lg text-slate-400">
          View and filter the complete history of all generated images.
        </p>
      </div>
      
      {/* Filter controls */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-400 mr-2">Filter by style:</span>
            {filterCategories.map(cat => (
                <button 
                    key={cat} 
                    onClick={() => setFilterCategory(cat)} 
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 ${filterCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-white">
            {imageRecords.length > 0 ? 'No images match the current filter' : 'No images generated yet'}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {imageRecords.length > 0 ? 'Try selecting another category.' : 'Go to the generator to create the first image.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRecords.map((record) => (
            <ImageCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
};