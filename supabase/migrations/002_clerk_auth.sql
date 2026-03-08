-- Remove foreign key constraint to auth.users since we're using Clerk
-- First drop dependent policies
DROP POLICY IF EXISTS "Users can read own record" ON users;
DROP POLICY IF EXISTS "Users can update own record" ON users;

-- Drop the foreign key constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Change id column to TEXT to accommodate Clerk user IDs
ALTER TABLE users ALTER COLUMN id TYPE TEXT;

-- Also update foreign keys in other tables that reference users
ALTER TABLE grocery_items DROP CONSTRAINT IF EXISTS grocery_items_checked_by_user_id_fkey;
ALTER TABLE grocery_items ALTER COLUMN checked_by_user_id TYPE TEXT;

ALTER TABLE errands DROP CONSTRAINT IF EXISTS errands_checked_by_user_id_fkey;
ALTER TABLE errands ALTER COLUMN checked_by_user_id TYPE TEXT;

-- Recreate policies for users table (now using TEXT id)
CREATE POLICY "Users can read own record" ON users
  FOR SELECT USING (id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (id = current_setting('app.current_user_id', true));

-- Since we're using service role for sync and anon key for reads,
-- we need to allow anon to read users for household lookups
CREATE POLICY "Anon can read users" ON users
  FOR SELECT USING (true);

-- Allow service role full access (it bypasses RLS anyway, but for clarity)
CREATE POLICY "Service role can manage users" ON users
  FOR ALL USING (true) WITH CHECK (true);
