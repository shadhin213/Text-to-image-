import React, { useState, useCallback } from 'react';
import { UserView } from './components/UserView';
import { AdminView } from './components/AdminView';
import { Header } from './components/Header';
import { AdminLogin } from './components/AdminLogin';
import type { ImageRecord, View } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('admin');
  const [imageRecords, setImageRecords] = useState<ImageRecord[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleImageGenerated = useCallback((newRecord: ImageRecord) => {
    setImageRecords(prevRecords => [newRecord, ...prevRecords]);
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
  };
  
  const renderContent = () => {
    if (view === 'user') {
      return isAdmin 
        ? <UserView onImageGenerated={handleImageGenerated} />
        : <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }
    return <AdminView imageRecords={imageRecords} />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header currentView={view} setView={setView} />
      <main className="p-4 sm:p-6 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
