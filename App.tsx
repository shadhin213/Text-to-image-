import React, { useState, useCallback } from 'react';
import { UserView } from './components/UserView';
import { AdminView } from './components/AdminView';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import type { ImageRecord, View } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [imageRecords, setImageRecords] = useState<ImageRecord[]>([]);

  const handleImageGenerated = useCallback((newRecord: ImageRecord) => {
    setImageRecords(prevRecords => [newRecord, ...prevRecords]);
  }, []);
  
  const renderContent = () => {
    if (view === 'home') {
      return <HomePage setView={setView} />;
    }
    if (view === 'user') {
      return <UserView onImageGenerated={handleImageGenerated} />;
    }
    return <AdminView imageRecords={imageRecords} />;
  };

  return (
    <div className="min-h-screen text-gray-100 font-sans">
      <Header currentView={view} setView={setView} />
      <main className={view === 'home' ? '' : 'p-4 sm:p-6 md:p-8'}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;