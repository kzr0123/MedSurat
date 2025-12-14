import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Fallback if Supabase is not configured (Mock Mode)
    if (!supabase) {
      // Allow 'admin' or 'admin@medsurat.com' for demo purposes
      if ((email === 'admin' || email === 'admin@medsurat.com') && password === 'password') {
        localStorage.setItem('medsurat_auth', 'true');
        navigate('/officer/dashboard');
      } else {
        setErrorMsg('Mode Demo: Gunakan email "admin" dan password "password"');
      }
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        // Set local flag for synchronous route protection
        localStorage.setItem('medsurat_auth', 'true');
        navigate('/officer/dashboard');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan saat login.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-50 rounded-full">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Login Petugas
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Masuk ke sistem administrasi MedSurat
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-700 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email / ID Petugas
            </label>
            <input
              id="email"
              name="email"
              type="text"
              required
              className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="petugas@medsurat.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Kata Sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        
        {!supabase && (
          <div className="mt-6 text-center text-xs text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
            Mode Demo: Gunakan <strong>admin</strong> / <strong>password</strong>
          </div>
        )}
      </div>
    </div>
  );
}