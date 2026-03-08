-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Households table
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  household_id UUID REFERENCES households(id) ON DELETE SET NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weeks table
CREATE TABLE weeks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(household_id, start_date)
);

-- Recipes table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source_url TEXT,
  source_image_url TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Week_Recipes junction table
CREATE TABLE week_recipes (
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (week_id, recipe_id)
);

-- Grocery_Items table
CREATE TABLE grocery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC,
  unit TEXT,
  store TEXT,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  checked BOOLEAN DEFAULT FALSE,
  checked_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Errands table
CREATE TABLE errands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  store TEXT,
  checked BOOLEAN DEFAULT FALSE,
  checked_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE week_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE errands ENABLE ROW LEVEL SECURITY;

-- Users can read their own user record
CREATE POLICY "Users can read own record" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own record
CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can read their household
CREATE POLICY "Users can read own household" ON households
  FOR SELECT USING (
    id IN (SELECT household_id FROM users WHERE id = auth.uid())
  );

-- Users can read weeks in their household
CREATE POLICY "Users can read household weeks" ON weeks
  FOR SELECT USING (
    household_id IN (SELECT household_id FROM users WHERE id = auth.uid())
  );

-- Users can insert weeks in their household
CREATE POLICY "Users can insert household weeks" ON weeks
  FOR INSERT WITH CHECK (
    household_id IN (SELECT household_id FROM users WHERE id = auth.uid())
  );

-- Users can read recipes in their household
CREATE POLICY "Users can read household recipes" ON recipes
  FOR SELECT USING (
    household_id IN (SELECT household_id FROM users WHERE id = auth.uid())
  );

-- Users can insert recipes in their household
CREATE POLICY "Users can insert household recipes" ON recipes
  FOR INSERT WITH CHECK (
    household_id IN (SELECT household_id FROM users WHERE id = auth.uid())
  );

-- Users can update recipes in their household
CREATE POLICY "Users can update household recipes" ON recipes
  FOR UPDATE USING (
    household_id IN (SELECT household_id FROM users WHERE id = auth.uid())
  );

-- Users can delete recipes in their household
CREATE POLICY "Users can delete household recipes" ON recipes
  FOR DELETE USING (
    household_id IN (SELECT household_id FROM users WHERE id = auth.uid())
  );

-- Week_recipes policies
CREATE POLICY "Users can read household week_recipes" ON week_recipes
  FOR SELECT USING (
    week_id IN (
      SELECT id FROM weeks WHERE household_id IN (
        SELECT household_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert household week_recipes" ON week_recipes
  FOR INSERT WITH CHECK (
    week_id IN (
      SELECT id FROM weeks WHERE household_id IN (
        SELECT household_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete household week_recipes" ON week_recipes
  FOR DELETE USING (
    week_id IN (
      SELECT id FROM weeks WHERE household_id IN (
        SELECT household_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Grocery items policies
CREATE POLICY "Users can read household grocery_items" ON grocery_items
  FOR SELECT USING (
    week_id IN (
      SELECT id FROM weeks WHERE household_id IN (
        SELECT household_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert household grocery_items" ON grocery_items
  FOR INSERT WITH CHECK (
    week_id IN (
      SELECT id FROM weeks WHERE household_id IN (
        SELECT household_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update household grocery_items" ON grocery_items
  FOR UPDATE USING (
    week_id IN (
      SELECT id FROM weeks WHERE household_id IN (
        SELECT household_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete household grocery_items" ON grocery_items
  FOR DELETE USING (
    week_id IN (
      SELECT id FROM weeks WHERE household_id IN (
        SELECT household_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Errands policies
CREATE POLICY "Users can read household errands" ON errands
  FOR SELECT USING (
    week_id IN (
      SELECT id FROM weeks WHERE household_id IN (
        SELECT household_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert household errands" ON errands
  FOR INSERT WITH CHECK (
    week_id IN (
      SELECT id FROM weeks WHERE household_id IN (
        SELECT household_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update household errands" ON errands
  FOR UPDATE USING (
    week_id IN (
      SELECT id FROM weeks WHERE household_id IN (
        SELECT household_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete household errands" ON errands
  FOR DELETE USING (
    week_id IN (
      SELECT id FROM weeks WHERE household_id IN (
        SELECT household_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Enable realtime for grocery_items and errands
ALTER PUBLICATION supabase_realtime ADD TABLE grocery_items;
ALTER PUBLICATION supabase_realtime ADD TABLE errands;

-- Create indexes for performance
CREATE INDEX idx_users_household ON users(household_id);
CREATE INDEX idx_weeks_household ON weeks(household_id);
CREATE INDEX idx_weeks_start_date ON weeks(start_date);
CREATE INDEX idx_recipes_household ON recipes(household_id);
CREATE INDEX idx_grocery_items_week ON grocery_items(week_id);
CREATE INDEX idx_grocery_items_store ON grocery_items(store);
CREATE INDEX idx_errands_week ON errands(week_id);
