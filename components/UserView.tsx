import React, { useState, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import type { ImageRecord, Category, AspectRatio } from '../types';
import { Spinner } from './Spinner';
import { GeneratedImage } from './GeneratedImage';
import { PromptEnhancer } from './PromptEnhancer';

interface UserViewProps {
  onImageGenerated: (record: ImageRecord) => void;
}

const categories: Category[] = ['General', 'Photography', 'Digital Art', 'Sci-Fi', 'Fantasy', 'Abstract'];
const aspectRatios: { label: string, value: AspectRatio }[] = [
    { label: 'Square', value: '1:1' },
    { label: 'Landscape', value: '16:9' },
    { label: 'Portrait', value: '9:16' },
    { label: 'Standard', value: '4:3' },
    { label: 'Tall', value: '3:4' },
];
const imageStyles = ['Cinematic', 'Portrait', 'Photorealistic', 'Digital Art'];


export const UserView: React.FC<UserViewProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [lastUsedPrompt, setLastUsedPrompt] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>('General');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  const handleGenerate = useCallback(async (currentPrompt: string, currentAspectRatio: AspectRatio) => {
    setIsLoading(true);
    setError(null);
    setImageUrls([]);
    try {
      const imagePromises = imageStyles.map(style => {
        const fullPrompt = `${style} style, a high-quality ${category.toLowerCase()} image of: ${currentPrompt}`;
        return geminiService.generateImage(fullPrompt, currentAspectRatio);
      });

      const newImageUrls = await Promise.all(imagePromises);
      setImageUrls(newImageUrls);
      
      onImageGenerated({
        id: new Date().toISOString(),
        prompt: `(Style: ${imageStyles[0]}) ${currentPrompt}`,
        imageUrl: newImageUrls[0],
        timestamp: new Date(),
        category,
        aspectRatio: currentAspectRatio,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      // REVERT: Add specific check for "No active API key" error.
      if (errorMessage.includes("No active API key set")) {
        setError("This application is not yet configured. An administrator needs to set an active API key in the admin dashboard.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [category, onImageGenerated]);

  const handlePrimaryGenerate = () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setLastUsedPrompt(prompt);
    handleGenerate(prompt, aspectRatio);
  };

  const handleAspectRatioChange = (newAspectRatio: AspectRatio) => {
    setAspectRatio(newAspectRatio);
    if (lastUsedPrompt.trim()) {
      handleGenerate(lastUsedPrompt, newAspectRatio);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-slate-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-indigo-400">Image Generator</h2>
        
        <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Style Category</label>
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)} disabled={isLoading} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${category === cat ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                        {cat}
                    </button>
                ))}
            </div>
        </div>
        
        <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2">
                {aspectRatios.map(ar => (
                    <button key={ar.value} onClick={() => handleAspectRatioChange(ar.value)} disabled={isLoading} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${aspectRatio === ar.value ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                        {ar.label} <span className="text-slate-400 text-xs">({ar.value})</span>
                    </button>
                ))}
            </div>
        </div>

        <p className="text-slate-400 mb-4">Describe the image you want to create. The more detailed your prompt, the better the result.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A futuristic city skyline at sunset, with flying cars"
            className="flex-grow bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            disabled={isLoading}
          />
          <button
            onClick={handlePrimaryGenerate}
            disabled={isLoading}
            className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <><Spinner /> Generating...</> : 'Generate Images'}
          </button>
        </div>
      </div>

      <div className="mt-8">
        {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-md text-center">{error}</div>}
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading && (
            imageStyles.map(style => (
              <div key={style} className="aspect-square flex justify-center items-center bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-700">
                <div className="text-center">
                  <Spinner size="lg"/>
                  <p className="mt-4 text-slate-400 text-sm">{style}...</p>
                </div>
              </div>
            ))
          )}
          {imageUrls.length > 0 && !isLoading && (
            imageUrls.map((url, index) => (
              <GeneratedImage key={index} imageUrl={url} prompt={prompt} style={imageStyles[index]} />
            ))
          )}
          {!isLoading && imageUrls.length === 0 && (
             <div className="sm:col-span-2 lg:col-span-4 text-center text-slate-500 bg-slate-900/50 rounded-lg py-20 border-2 border-dashed border-slate-700">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="mt-2">Your generated images will appear here.</p>
              </div>
          )}
        </div>
      </div>
      
      <div className="mt-12">
        <PromptEnhancer onUsePrompt={setPrompt} />
      </div>

    </div>
  );
};