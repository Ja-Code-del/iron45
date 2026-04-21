import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('ENV CHECK:', {
  url: supabaseUrl?.substring(0, 30) ?? 'MISSING',
  key: supabaseAnonKey?.substring(0, 20) ?? 'MISSING',
  allKeys: Object.keys(import.meta.env),
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variables Supabase manquantes. Vérifie ton .env.local (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY).'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});