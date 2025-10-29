import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const ADMIN_PASSWORD = 'gemini-admin-password';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLoginSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-slate-900 p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-2 text-indigo-400">Admin Access Required</h2>
        <p className="text-slate-400 mb-6">You need admin credentials to access the image generator.</p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter admin password"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-center"
              aria-label="Admin Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 disabled:bg-indigo-900 transition-colors"
          >
            Authenticate
          </button>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </form>
        <p className="text-xs text-slate-500 mt-6">
          Hint: For this demo, the password is '<code>{ADMIN_PASSWORD}</code>'.
        </p>
      </div>
    </div>
  );
};