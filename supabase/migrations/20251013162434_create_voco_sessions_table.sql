/*
  # VOCO Sessions Database Schema

  ## Description
  Creates the database schema for VOCO voice-based coding assistant to track
  user sessions, commands, and code generation history.

  ## New Tables
  
  ### `sessions`
  Stores user coding sessions with timestamps and status tracking
  - `id` (uuid, primary key) - Unique session identifier
  - `created_at` (timestamptz) - Session creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `status` (text) - Session status (active, paused, completed)
  - `title` (text) - Session title/description
  
  ### `commands`
  Stores voice commands and their processing results
  - `id` (uuid, primary key) - Unique command identifier
  - `session_id` (uuid, foreign key) - References parent session
  - `created_at` (timestamptz) - Command timestamp
  - `transcript` (text) - Raw voice transcript
  - `intent` (text) - Interpreted user intent
  - `code_generated` (text) - Generated code output
  - `explanation` (text) - Code explanation text
  - `language` (text) - Programming language (javascript, python, etc)
  
  ## Security
  - Enable RLS on all tables
  - Public access policies for demo purposes (no authentication required)
  - In production, these should be restricted to authenticated users
  
  ## Indexes
  - Index on session_id for fast command lookups
  - Index on created_at for chronological queries
*/

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text DEFAULT 'active',
  title text DEFAULT 'New Session'
);

-- Create commands table
CREATE TABLE IF NOT EXISTS commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  transcript text NOT NULL,
  intent text,
  code_generated text,
  explanation text,
  language text DEFAULT 'javascript'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_commands_session_id ON commands(session_id);
CREATE INDEX IF NOT EXISTS idx_commands_created_at ON commands(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commands ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
CREATE POLICY "Allow public read access to sessions"
  ON sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to sessions"
  ON sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to sessions"
  ON sessions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to commands"
  ON commands FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to commands"
  ON commands FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to commands"
  ON commands FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);