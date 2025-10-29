import React from 'react';
import type { ImageRecord } from '../types';

interface ImageCardProps {
  record: ImageRecord;
}

export const ImageCard: React.FC<ImageCardProps> = ({ record }) => {
  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 duration-300 group">
      <div className="aspect-square w-full bg-slate-800">
        <img
          src={record.imageUrl}
          alt={record.prompt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-slate-300 line-clamp-2 mb-2" title={record.prompt}>
          {record.prompt}
        </p>
        <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="inline-block bg-indigo-600/50 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full">{record.category}</span>
            <span className="inline-block bg-slate-700/70 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full">{record.aspectRatio}</span>
        </div>
        <p className="text-xs text-slate-500">
          {record.timestamp.toLocaleString()}
        </p>
      </div>
    </div>
  );
};