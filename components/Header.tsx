import React from 'react';
import type { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {label}
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  if (currentView === 'home') {
    return (
      <header className="bg-transparent absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('home')}>
            <svg width="32" height="32" viewBox="0 0 262 262" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M85.749 22.333c-23.25 20.25-23.25 56.25 0 76.5l25.5 22.334c23.25 20.25 61.5 20.25 84.75 0l25.5-22.334c23.25-20.25 23.25-56.25 0-76.5l-25.5-22.333c-23.25-20.25-61.5-20.25-84.75 0l-25.5 22.333z" fill="url(#paint0_linear_header)"/>
              <path d="M37.249 140.833c-23.25 20.25-23.25 56.25 0 76.5l25.5 22.334c23.25 20.25 61.5 20.25 84.75 0l25.5-22.334c23.25-20.25 23.25-56.25 0-76.5l-25.5-22.333c-23.25-20.25-61.5-20.25-84.75 0l-25.5 22.333z" fill="url(#paint1_linear_header)"/>
              <defs>
                <linearGradient id="paint0_linear_header" x1="150.999" y1="9.33301" x2="150.999" y2="132.167" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#A855F7"/>
                  <stop offset="1" stopColor="#6366F1"/>
                </linearGradient>
                <linearGradient id="paint1_linear_header" x1="102.999" y1="127.833" x2="102.999" y2="250.667" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#A855F7"/>
                  <stop offset="1" stopColor="#EC4899"/>
                </linearGradient>
              </defs>
            </svg>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-violet-400">
              shadhin ai
            </h1>
          </div>
          <nav>
            <button className="text-slate-400 hover:text-white transition-colors" aria-label="Settings">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </nav>
        </div>
      </header>
    );
  }
  
  return (
    <header className="bg-slate-800 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('home')}>
          <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <h1 className="text-xl font-bold text-white tracking-tight">
            AI Image Platform
          </h1>
        </div>
        <nav className="flex items-center space-x-2 p-1 bg-slate-900 rounded-lg">
          <NavButton
            label="Generator"
            isActive={currentView === 'user'}
            onClick={() => setView('user')}
          />
          <NavButton
            label="Admin Dashboard"
            isActive={currentView === 'admin'}
            onClick={() => setView('admin')}
          />
        </nav>
      </div>
    </header>
  );
};