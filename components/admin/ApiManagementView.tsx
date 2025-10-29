import React, { useState } from 'react';
import type { ApiKey } from '../../types';

// REVERT: Props are re-introduced to manage API keys from the parent component.
interface ApiManagementViewProps {
  apiKeys: ApiKey[];
  onAddApiKey: (key: string) => void;
  onRemoveApiKey: (id: string) => void;
  onSetActiveApiKey: (id: string) => void;
}

const maskApiKey = (key: string) => {
  if (key.length <= 8) return '****';
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
};

export const ApiManagementView: React.FC<ApiManagementViewProps> = ({ apiKeys, onAddApiKey, onRemoveApiKey, onSetActiveApiKey }) => {
  const [newApiKey, setNewApiKey] = useState('');
  const [error, setError] = useState('');

  const handleAddClick = () => {
    if (!newApiKey.trim()) {
      setError('API key cannot be empty.');
      return;
    }
    onAddApiKey(newApiKey);
    setNewApiKey('');
    setError('');
  };

  // REVERT: The component is restored to its full, interactive version.
  return (
    <div>
      <div className="border-b border-slate-700 pb-4 mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">API Key Management</h2>
        <p className="mt-2 text-lg text-slate-400">
          Add and manage your Gemini API keys here. Set one key as "active" to be used for all image generation.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Add New API Key</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="password"
            value={newApiKey}
            onChange={(e) => {
              setNewApiKey(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter your Gemini API key"
            className="flex-grow bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
          <button
            onClick={handleAddClick}
            className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add Key
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      <div className="bg-slate-900 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Managed Keys</h3>
        {apiKeys.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No API keys have been added yet.</p>
        ) : (
          <ul className="space-y-3">
            {apiKeys.map((apiKey) => (
              <li key={apiKey.id} className="bg-slate-800 p-4 rounded-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {apiKey.isActive ? (
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600/30 text-green-300">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                      Inactive
                    </span>
                  )}
                  <span className="font-mono text-slate-300">{maskApiKey(apiKey.key)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {!apiKey.isActive && (
                    <button
                      onClick={() => onSetActiveApiKey(apiKey.id)}
                      className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-1.5 px-3 rounded-md transition-colors"
                    >
                      Set Active
                    </button>
                  )}
                  <button
                    onClick={() => onRemoveApiKey(apiKey.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-3 rounded-md transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};