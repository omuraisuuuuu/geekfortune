-- =====================================================
-- SQL COMMANDS FOR UPDATING LEADERBOARDS
-- Run these in your Supabase SQL Editor
-- =====================================================

-- 1. Rename the existing leaderboard table to quick_leaderboard
ALTER TABLE IF EXISTS leaderboard RENAME TO quick_leaderboard;

-- 2. Update indexes for quick_leaderboard
DROP INDEX IF EXISTS idx_leaderboard_score;
DROP INDEX IF EXISTS idx_leaderboard_date;
CREATE INDEX IF NOT EXISTS idx_quick_leaderboard_score ON quick_leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_quick_leaderboard_date ON quick_leaderboard(date DESC);

-- 3. Create standard_leaderboard table
CREATE TABLE IF NOT EXISTS standard_leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  score INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create endless_leaderboard table
CREATE TABLE IF NOT EXISTS endless_leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  score INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_standard_leaderboard_score ON standard_leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_standard_leaderboard_date ON standard_leaderboard(date DESC);
CREATE INDEX IF NOT EXISTS idx_standard_leaderboard_user ON standard_leaderboard(user_id);

CREATE INDEX IF NOT EXISTS idx_endless_leaderboard_score ON endless_leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_endless_leaderboard_date ON endless_leaderboard(date DESC);
CREATE INDEX IF NOT EXISTS idx_endless_leaderboard_user ON endless_leaderboard(user_id);

-- 6. Enable RLS on new tables
ALTER TABLE standard_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE endless_leaderboard ENABLE ROW LEVEL SECURITY;

-- 7. Create policies for quick_leaderboard (update old policy names)
DROP POLICY IF EXISTS "Anyone can read leaderboard" ON quick_leaderboard;
DROP POLICY IF EXISTS "Anyone can insert leaderboard" ON quick_leaderboard;
DROP POLICY IF EXISTS "Anyone can read quick_leaderboard" ON quick_leaderboard;
DROP POLICY IF EXISTS "Anyone can insert quick_leaderboard" ON quick_leaderboard;

CREATE POLICY "Anyone can read quick_leaderboard" ON quick_leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert quick_leaderboard" ON quick_leaderboard
  FOR INSERT WITH CHECK (true);

-- 8. Create policies for standard_leaderboard
DROP POLICY IF EXISTS "Anyone can read standard_leaderboard" ON standard_leaderboard;
DROP POLICY IF EXISTS "Anyone can insert standard_leaderboard" ON standard_leaderboard;

CREATE POLICY "Anyone can read standard_leaderboard" ON standard_leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert standard_leaderboard" ON standard_leaderboard
  FOR INSERT WITH CHECK (true);

-- 9. Create policies for endless_leaderboard
DROP POLICY IF EXISTS "Anyone can read endless_leaderboard" ON endless_leaderboard;
DROP POLICY IF EXISTS "Anyone can insert endless_leaderboard" ON endless_leaderboard;

CREATE POLICY "Anyone can read endless_leaderboard" ON endless_leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert endless_leaderboard" ON endless_leaderboard
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- If the quick_scores, standard_scores, endless_scores tables 
-- were created from before, you can drop them and use these instead:
-- =====================================================
DROP TABLE IF EXISTS quick_scores;
DROP TABLE IF EXISTS standard_scores;
DROP TABLE IF EXISTS endless_scores;

-- =====================================================
-- DONE! All leaderboard tables are now set up.
-- =====================================================

