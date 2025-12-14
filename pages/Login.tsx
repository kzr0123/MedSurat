import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified login for demo
    localStorage.setItem('medsurat_auth', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-slate-100 rounded-full">
            <Lock className="h-8 w-8 text-slate-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">Officer Access</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Officer ID</label>
            <input type="text" defaultValue="admin" className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" defaultValue="password" className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary" />
          </div>
          <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors">
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-slate-400">
          Demo: Click "Sign In" directly.
        </div>
      </div>
    </div>
  );
};
