import React from 'react';
import type { View } from '../types';

interface HomePageProps {
  setView: (view: View) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setView }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen pt-20 px-4">
      <p className="text-xl text-slate-300 mb-12 max-w-lg leading-relaxed">
        Your suite of powerful and easy-to-use AI tools. Select a tool below to get started.
      </p>
      <div 
        className="bg-slate-900/70 p-8 rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-md backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Available Tools</h2>
        <button
          onClick={() => setView('user')}
          className="w-full bg-indigo-600 text-white font-semibold px-6 py-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-label="Go to Text to Image Generator"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Text to Image Generator</span>
        </button>
      </div>

      <div className="mt-8">
        <button
          onClick={() => setView('admin')}
          className="text-slate-500 hover:text-indigo-400 text-sm font-medium transition-colors"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};