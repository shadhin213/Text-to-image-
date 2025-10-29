import React, { useState } from 'react';
import { enhancePrompt } from '../services/geminiService';
import { Spinner } from './Spinner';

interface PromptEnhancerProps {
  onUsePrompt: (prompt: string) => void;
}

export const PromptEnhancer: React.FC<PromptEnhancerProps> = ({ onUsePrompt }) => {
  const [idea, setIdea] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnhance = async () => {
    if (!idea.trim()) {
      setError('Please enter an idea to enhance.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const newSuggestions = await enhancePrompt(idea);
      setSuggestions(newSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-900 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-3 text-indigo-400">Prompt Enhancer</h3>
      <p className="text-slate-400 mb-4 text-sm">Not sure what to write? Enter a basic idea, and let AI suggest detailed prompts for you.</p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g., a magical forest"
          className="flex-grow bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          disabled={isLoading}
        />
        <button
          onClick={handleEnhance}
          disabled={isLoading}
          className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? <><Spinner /> Enhancing...</> : 'Enhance Prompt'}
        </button>
      </div>

      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md text-center text-sm">{error}</div>}
      
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-300">Suggestions:</h4>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="bg-slate-950/50 p-3 rounded-lg flex items-center justify-between gap-4">
              <p className="text-sm text-slate-300 flex-grow">{suggestion}</p>
              <button
                onClick={() => onUsePrompt(suggestion)}
                className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-1.5 px-3 rounded-md transition-colors whitespace-nowrap"
              >
                Use Prompt
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};