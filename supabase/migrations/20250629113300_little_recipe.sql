/*
  # Create ICO listings table

  1. New Tables
    - `ico_listings`
      - Complete project information including listing type, project details, dates, links, etc.
      - All fields from the form specification
      - Proper data types and constraints
  
  2. Security
    - Enable RLS on `ico_listings` table
    - Add policies for authenticated users to create and manage their listings
    - Public can view active listings
*/

CREATE TABLE IF NOT EXISTS ico_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Listing type
  listing_type text NOT NULL CHECK (listing_type IN ('free', 'silver', 'gold')),
  
  -- Project basic info
  project_name text NOT NULL,
  project_symbol text NOT NULL,
  total_supply text,
  contract_address text NOT NULL,
  
  -- Relationship and dates
  relationship_with_project text NOT NULL,
  project_launch_date date,
  country_of_origin text NOT NULL,
  
  -- Project details
  project_tags text, -- comma separated
  project_description text NOT NULL CHECK (length(project_description) >= 120),
  project_keypoints text,
  
  -- Technical details
  network text NOT NULL DEFAULT 'Ethereum (ETH)',
  decimals integer NOT NULL DEFAULT 18,
  
  -- Links and media
  logo_url text NOT NULL,
  website_url text NOT NULL,
  block_explorer_link text NOT NULL,
  whitepaper_link text NOT NULL,
  
  -- Social links
  twitter_url text,
  telegram_url text,
  facebook_url text,
  linkedin_url text,
  
  -- ICO details
  ico_start_date date NOT NULL,
  ico_end_date date NOT NULL,
  ico_price text NOT NULL,
  
  -- Additional info
  comments text,
  
  -- Status and timestamps
  is_active boolean DEFAULT true,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ico_listings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active and approved ICO listings"
  ON ico_listings
  FOR SELECT
  TO public
  USING (is_active = true AND is_approved = true);

CREATE POLICY "Users can view their own ICO listings"
  ON ico_listings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ICO listings"
  ON ico_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ICO listings"
  ON ico_listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ICO listings"
  ON ico_listings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ico_listings_user_id ON ico_listings (user_id);
CREATE INDEX IF NOT EXISTS idx_ico_listings_is_active ON ico_listings (is_active);
CREATE INDEX IF NOT EXISTS idx_ico_listings_is_approved ON ico_listings (is_approved);
CREATE INDEX IF NOT EXISTS idx_ico_listings_created_at ON ico_listings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ico_listings_ico_start_date ON ico_listings (ico_start_date);
CREATE INDEX IF NOT EXISTS idx_ico_listings_network ON ico_listings (network);

-- Trigger for updated_at
CREATE TRIGGER update_ico_listings_updated_at
  BEFORE UPDATE ON ico_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();