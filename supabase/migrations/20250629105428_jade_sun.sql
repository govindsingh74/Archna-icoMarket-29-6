/*
  # Create token listings table

  1. New Tables
    - `token_listings`
      - `id` (integer, primary key, auto-increment)
      - `user_id` (uuid, references auth.users) - ID of the user who created the listing
      - `token_name` (text, required) - Name of the token
      - `token_symbol` (text, required) - Symbol of the token (e.g., BTC, ETH)
      - `token_description` (text, required) - Description of the token project
      - `token_logo_url` (text, optional) - URL of the token logo
      - `website_url` (text, optional) - Project website URL
      - `telegram_url` (text, optional) - Telegram community URL
      - `twitter_url` (text, optional) - Twitter profile URL
      - `contract_address` (text, optional) - Smart contract address
      - `total_supply` (text, optional) - Total token supply
      - `is_active` (boolean, default true) - Whether the listing is active
      - `created_at` (timestamp) - When the listing was created
      - `updated_at` (timestamp) - When the listing was last updated

  2. Security
    - Enable RLS on `token_listings` table
    - Add policy for public read access to active listings
    - Add policy for users to manage their own listings
*/

CREATE TABLE IF NOT EXISTS token_listings (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  token_description TEXT NOT NULL,
  token_logo_url TEXT,
  website_url TEXT,
  telegram_url TEXT,
  twitter_url TEXT,
  contract_address TEXT,
  total_supply TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_token_listings_user_id ON token_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_token_listings_is_active ON token_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_token_listings_created_at ON token_listings(created_at DESC);

-- Enable RLS
ALTER TABLE token_listings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active token listings
CREATE POLICY "Anyone can view active token listings"
  ON token_listings
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow users to view their own listings (including inactive ones)
CREATE POLICY "Users can view their own listings"
  ON token_listings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own listings
CREATE POLICY "Users can create their own listings"
  ON token_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own listings
CREATE POLICY "Users can update their own listings"
  ON token_listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own listings
CREATE POLICY "Users can delete their own listings"
  ON token_listings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger for token_listings
CREATE TRIGGER update_token_listings_updated_at
  BEFORE UPDATE ON token_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();