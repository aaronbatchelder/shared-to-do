-- Add invite_code to households
ALTER TABLE households ADD COLUMN invite_code TEXT UNIQUE;

-- Create index for invite code lookups
CREATE INDEX idx_households_invite_code ON households(invite_code);

-- Allow users to update their household name
CREATE POLICY "Users can update own household" ON households
  FOR UPDATE USING (
    id IN (SELECT household_id FROM users WHERE id = auth.uid())
  );

-- Allow reading households by invite code (for joining)
CREATE POLICY "Anyone can read household by invite code" ON households
  FOR SELECT USING (invite_code IS NOT NULL);
