/*
  # Create company logos table

  1. New Tables
    - `company_logos`
      - `id` (integer, primary key)
      - `company_name` (text)
      - `logo_url` (text)
      - `alt_text` (text, optional)
      - `display_order` (integer, for ordering logos)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `company_logos` table
    - Add policy for public to read active logos
    - Add policy for authenticated users to manage logos

  3. Indexes
    - Index on `is_active` for filtering
    - Index on `display_order` for sorting
*/

CREATE TABLE IF NOT EXISTS company_logos (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  company_name text NOT NULL,
  logo_url text NOT NULL,
  alt_text text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE company_logos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active company logos"
  ON company_logos
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert company logos"
  ON company_logos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update company logos"
  ON company_logos
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete company logos"
  ON company_logos
  FOR DELETE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_company_logos_is_active ON company_logos (is_active);
CREATE INDEX IF NOT EXISTS idx_company_logos_display_order ON company_logos (display_order);

-- Trigger for updated_at
CREATE TRIGGER update_company_logos_updated_at
  BEFORE UPDATE ON company_logos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO company_logos (company_name, logo_url, alt_text, display_order) VALUES
('TechCorp', 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=200&h=100', 'TechCorp Logo', 1),
('InnovateLab', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=200&h=100', 'InnovateLab Logo', 2),
('CryptoVentures', 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=200&h=100', 'CryptoVentures Logo', 3),
('BlockchainPro', 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=200&h=100', 'BlockchainPro Logo', 4),
('DigitalAssets', 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=200&h=100', 'DigitalAssets Logo', 5);