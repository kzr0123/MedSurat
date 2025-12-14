import { supabase } from './supabase';

export const Auth = {
  isAuthenticated: (): boolean => {
    return localStorage.getItem('medsurat_auth') === 'true';
  },
  
  // Note: Login logic is now primarily handled in components/auth/Login.tsx to support async Supabase flow directly.
  // This helper is kept for legacy mock support or simple checks.
  login: (id: string, password: string): boolean => {
    // Demo login fallback
    if ((id === 'admin' || id === 'admin@medsurat.com') && password === 'password') {
      localStorage.setItem('medsurat_auth', 'true');
      return true;
    }
    return false;
  },
  
  logout: async () => {
    localStorage.removeItem('medsurat_auth');
    if (supabase) {
      await supabase.auth.signOut();
    }
  }
};