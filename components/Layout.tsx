import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, ShieldCheck, User } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isOfficer = location.pathname.includes('/dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">MedSurat</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-slate-600 hover:text-primary transition-colors font-medium">Home</Link>
              <Link to="/verify/check" className="text-slate-600 hover:text-primary transition-colors font-medium">Verify</Link>
              {isOfficer && (
                 <Link to="/dashboard" className="text-primary font-medium">Dashboard</Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {isOfficer ? (
                <div className="flex items-center space-x-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                  <User className="h-4 w-4" />
                  <span>Dr. Officer</span>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-primary">
                  Staff Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} MedSurat System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
