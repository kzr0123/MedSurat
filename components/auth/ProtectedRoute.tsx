import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Auth } from '../../lib/auth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Fallback for Mock Mode (if Supabase is not configured)
      if (!supabase) {
        setAuthenticated(Auth.isAuthenticated());
        setLoading(false);
        return;
      }

      // 2. Supabase Mode
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthenticated(!!session);
      } catch (e) {
        console.error("Auth check failed", e);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }

      // 3. Listen for changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setAuthenticated(!!session);
      });

      return () => subscription.unsubscribe();
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-slate-500 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  return authenticated ? <>{children}</> : <Navigate to="/login" replace />;
};