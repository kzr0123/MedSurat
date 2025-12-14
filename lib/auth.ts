import { supabase } from './supabase';

export const Auth = {
  /**
   * Checks if user is authenticated via Supabase Session OR Local Mock
   */
  isAuthenticated: async (): Promise<boolean> => {
    // 1. Supabase Mode
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    }
    
    // 2. Mock Mode Fallback
    // Since this is async to match Supabase signature, we return a promise resolving to the storage check
    return Promise.resolve(localStorage.getItem('medsurat_auth') === 'true');
  },
  
  /**
   * Logs out
   */
  logout: async () => {
    localStorage.removeItem('medsurat_auth');
    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  /**
   * Helper to get current user details
   */
  getUser: async () => {
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
    // Mock user
    if (localStorage.getItem('medsurat_auth') === 'true') {
      return { email: 'demo@medsurat.com', id: 'mock-user-id' };
    }
    return null;
  }
};