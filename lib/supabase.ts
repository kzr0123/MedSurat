import { createClient } from '@supabase/supabase-js';

// Cast import.meta to any to avoid TypeScript errors when Vite types are missing
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. App will use local mock storage.');
}

// Only export the client if keys are present, otherwise null (fallback to mock in db.ts)
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;