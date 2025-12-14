import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, User, LogOut } from 'lucide-react';
import { Auth } from '../../lib/auth';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Auth.isAuthenticated();

  const handleLogout = () => {
    Auth.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-tight">MedSurat</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/patient/form" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pasien</Link>
              <Link to="/verify" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Cek Status</Link>
              {isLoggedIn && (
                 <Link to="/officer/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                    <User className="h-4 w-4" />
                    <span>Dr. Officer</span>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                  Portal Petugas
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} MedSurat System. Layanan Surat Kesehatan Digital.
        </div>
      </footer>
    </div>
  );
};