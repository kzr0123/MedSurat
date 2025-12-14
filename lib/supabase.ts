import { createClient } from '@supabase/supabase-js';

// Configuration: Prioritize Environment Variables, fallback to provided keys
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://wrbbwgeehasehlkqdtos.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyYmJ3Z2VlaGFzZWhsa3FkdG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NzM2NzksImV4cCI6MjA4MTI0OTY3OX0.qppAHN1fbHeQWpJ_AU3m44RxJNdGwcoBss3l0d0XRVE';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials. App will use local mock storage.');
}

// Only export the client if keys are present
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;