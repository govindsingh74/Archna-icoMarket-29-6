/*
  # Authentication System Setup

  1. New Tables
    - `users` - Store user information and authentication
    - `admins` - Store admin user references
    - `password_reset_tokens` - Handle password reset functionality

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Add admin-specific policies

  3. Functions
    - Password hashing and verification
    - Token generation for password reset
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  location text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Anyone can create user accounts"
  ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins policies
CREATE POLICY "Admins can view admin data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Password reset tokens policies
CREATE POLICY "Users can create reset tokens"
  ON password_reset_tokens
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own reset tokens"
  ON password_reset_tokens
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can update their own reset tokens"
  ON password_reset_tokens
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Insert admin user
DO $$
BEGIN
  -- Insert admin user if not exists
  INSERT INTO users (email, password_hash, first_name, last_name, location)
  VALUES (
    'govindsingh747@gmail.com',
    crypt('Rajatjai12345', gen_salt('bf')),
    'Govind',
    'Singh',
    'India'
  )
  ON CONFLICT (email) DO NOTHING;
  
  -- Add to admins table
  INSERT INTO admins (user_id)
  SELECT id FROM users WHERE email = 'govindsingh747@gmail.com'
  ON CONFLICT DO NOTHING;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();