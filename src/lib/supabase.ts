import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Session {
  id: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'paused' | 'completed';
  title: string;
}

export interface Command {
  id: string;
  session_id: string;
  created_at: string;
  transcript: string;
  intent: string | null;
  code_generated: string | null;
  explanation: string | null;
  language: string;
}
