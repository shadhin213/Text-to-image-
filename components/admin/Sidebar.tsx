// FIX: Add React import to resolve JSX namespace for types like JSX.Element.
import React from 'react';

type AdminPage = 'dashboard' | 'api-management';

interface SidebarProps {
  currentPage: AdminPage;
  setPage: (page: AdminPage) => void;
}

const NavLink: React.FC<{
  // FIX: Use React.ReactElement instead of JSX.Element to avoid issues with global JSX namespace resolution.
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
  return (
    <aside className="w-64 bg-slate-900 p-4 border-r border-slate-800 flex flex-col">
      <nav className="flex-1 space-y-2">
        <NavLink
          label="Image History"
          isActive={currentPage === 'dashboard'}
          onClick={() => setPage('dashboard')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <NavLink
          label="API Management"
          isActive={currentPage === 'api-management'}
          onClick={() => setPage('api-management')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 017.743-5.743z" />
            </svg>
          }
        />
      </nav>
    </aside>
  );
};