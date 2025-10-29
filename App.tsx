import React, { useState, useCallback, useEffect } from 'react';
import { UserView } from './components/UserView';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { AdminLogin } from './components/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { geminiService } from './services/geminiService';
import type { ImageRecord, View, ApiKey } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [imageRecords, setImageRecords] = useState<ImageRecord[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  
  // REVERT: Re-added state and effects for client-side API key management.
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    try {
      const storedKeys = localStorage.getItem('apiKeys');
      if (storedKeys) {
        setApiKeys(JSON.parse(storedKeys));
      }
    } catch (error) {
      console.error("Failed to parse API keys from localStorage:", error);
      localStorage.removeItem('apiKeys');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
      const activeKey = apiKeys.find(k => k.isActive)?.key || null;
      geminiService.setApiKey(activeKey);
    } catch (error) {
      console.error("Failed to save API keys to localStorage:", error);
    }
  }, [apiKeys]);


  const handleImageGenerated = useCallback((newRecord: ImageRecord) => {
    setImageRecords(prevRecords => [newRecord, ...prevRecords]);
  }, []);

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };
  
  const handleAddApiKey = (key: string) => {
    setApiKeys(prev => {
      const newKey: ApiKey = { id: Date.now().toString(), key, isActive: false };
      // If it's the first key, make it active.
      if (prev.length === 0) {
        newKey.isActive = true;
      }
      return [...prev, newKey];
    });
  };

  const handleRemoveApiKey = (id: string) => {
    setApiKeys(prev => {
      const keyToRemove = prev.find(k => k.id === id);
      const remainingKeys = prev.filter(k => k.id !== id);
      // If the removed key was active and there are other keys left, make the first one active.
      if (keyToRemove?.isActive && remainingKeys.length > 0) {
        remainingKeys[0].isActive = true;
      }
      return remainingKeys;
    });
  };

  const handleSetActiveApiKey = (id: string) => {
    setApiKeys(prev => 
      prev.map(k => ({ ...k, isActive: k.id === id }))
    );
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <HomePage setView={setView} />;
      case 'user':
        return <UserView onImageGenerated={handleImageGenerated} />;
      case 'admin':
        return isAdminAuthenticated ? (
          // REVERT: Pass API key management props to AdminLayout.
          <AdminLayout 
            imageRecords={imageRecords}
            apiKeys={apiKeys}
            onAddApiKey={handleAddApiKey}
            onRemoveApiKey={handleRemoveApiKey}
            onSetActiveApiKey={handleSetActiveApiKey}
          />
        ) : (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        );
      default:
        return <HomePage setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen text-gray-100 font-sans">
      <Header currentView={view} setView={setView} />
      <main className={(view === 'home' || (view === 'admin' && isAdminAuthenticated)) ? '' : 'p-4 sm:p-6 md:p-8'}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;