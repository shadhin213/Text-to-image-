import React, { useState, useCallback, useEffect } from 'react';
import { UserView } from './components/UserView';
import { AdminView } from './components/AdminView';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import type { ImageRecord, View } from './types';

// Fix: Define AIStudio interface to resolve TypeScript error about subsequent property declarations.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio?: AIStudio;
  }
}

const ApiKeyPrompt: React.FC<{ onSelectKey: () => void }> = ({ onSelectKey }) => (
    <div className="max-w-md mx-auto mt-10">
        <div className="bg-slate-900 p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-2 text-indigo-400">API Key Required</h2>
            <p className="text-slate-400 mb-6">To use the image generator locally, please select an API key. This allows the application to make requests to the Gemini API on your behalf.</p>
            <button
                onClick={onSelectKey}
                className="w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
                Select API Key
            </button>
            <p className="text-xs text-slate-500 mt-6">
                For information on billing, please visit{' '}
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                    ai.google.dev/gemini-api/docs/billing
                </a>.
            </p>
        </div>
    </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [imageRecords, setImageRecords] = useState<ImageRecord[]>([]);
  const [isApiKeySelected, setIsApiKeySelected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        try {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setIsApiKeySelected(hasKey);
        } catch (e) {
            console.error("Could not check for API key", e);
            setIsApiKeySelected(false);
        }
      } else {
          // If not in AI Studio environment, assume no key management is available.
          setIsApiKeySelected(false);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
      if (window.aistudio) {
        try {
            await window.aistudio.openSelectKey();
            // Assume success to avoid race conditions.
            setIsApiKeySelected(true);
        } catch(e) {
            console.error("Could not open API key selection", e);
        }
      }
  };

  const handleImageGenerated = useCallback((newRecord: ImageRecord) => {
    setImageRecords(prevRecords => [newRecord, ...prevRecords]);
  }, []);
  
  const renderContent = () => {
    if (isApiKeySelected === null) {
        // Still checking for the key
        return <div className="text-center p-10">Checking API key status...</div>;
    }
    
    if (view === 'home') {
      return <HomePage setView={setView} />;
    }
    
    if (!isApiKeySelected) {
        return <ApiKeyPrompt onSelectKey={handleSelectKey} />;
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