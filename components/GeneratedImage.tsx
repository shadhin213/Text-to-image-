import React from 'react';

interface GeneratedImageProps {
  imageUrl: string;
  prompt: string;
  style: string;
}

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrl, prompt, style }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    const sanitizedPrompt = prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${sanitizedPrompt}_${style.replace(/\s/g, '_')}.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="aspect-square w-full bg-slate-900 rounded-lg overflow-hidden shadow-lg group relative">
      <img
        src={imageUrl}
        alt={prompt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
        <div>
          <span className="inline-block bg-indigo-600/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{style}</span>
        </div>
        <button
          onClick={handleDownload}
          title="Download Image"
          className="self-end bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </div>
  );
};