/*
  # Update users table schema

  1. Changes
    - Remove password_hash column from users table as it's handled by Supabase auth
    - This resolves the constraint violation when inserting user profiles

  2. Security
    - No changes to RLS policies needed
    - Password management remains with Supabase auth system
*/

-- Remove the password_hash column as it's not needed in our custom users table
-- Supabase auth handles password management separately
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE users DROP COLUMN password_hash;
  END IF;
END $$;