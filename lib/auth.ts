import { supabase } from './supabase';

export const Auth = {
  /**
   * Checks if user is authenticated via Supabase Session
   */
  isAuthenticated: async (): Promise<boolean> => {
    if (!supabase) return false;
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },
  
  /**
   * Logs out via Supabase
   */
  logout: async () => {
    localStorage.removeItem('medsurat_auth'); // Cleanup legacy
    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  /**
   * Helper to get current user details
   */
  getUser: async () => {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};