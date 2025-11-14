-- ============================================
-- Настройка нового проекта Supabase для Geek Fortune
-- Проект: qxkmwmrjsyjxmtydahct
-- ============================================

-- ============================================
-- Создание таблицы пользователей (users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT NOT NULL,
  password_hash TEXT,
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Создание таблицы лидерборда (leaderboard)
-- ============================================
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  score INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Создание индексов для производительности
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_date ON leaderboard(date DESC);

-- ============================================
-- Включение Row Level Security (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Удаление старых политик (если есть)
-- ============================================
DROP POLICY IF EXISTS "Anyone can read users" ON users;
DROP POLICY IF EXISTS "Anyone can insert users" ON users;
DROP POLICY IF EXISTS "Anyone can update users" ON users;
DROP POLICY IF EXISTS "Anyone can read leaderboard" ON leaderboard;
DROP POLICY IF EXISTS "Anyone can insert leaderboard" ON leaderboard;

-- ============================================
-- Политики безопасности для таблицы users
-- ============================================

-- Разрешаем всем читать пользователей
CREATE POLICY "Anyone can read users" ON users
  FOR SELECT USING (true);

-- Разрешаем всем создавать новых пользователей
CREATE POLICY "Anyone can insert users" ON users
  FOR INSERT WITH CHECK (true);

-- Разрешаем всем обновлять пользователей
CREATE POLICY "Anyone can update users" ON users
  FOR UPDATE USING (true);

-- ============================================
-- Политики безопасности для таблицы leaderboard
-- ============================================

-- Разрешаем всем читать лидерборд
CREATE POLICY "Anyone can read leaderboard" ON leaderboard
  FOR SELECT USING (true);

-- Разрешаем всем добавлять записи в лидерборд
CREATE POLICY "Anyone can insert leaderboard" ON leaderboard
  FOR INSERT WITH CHECK (true);

-- ============================================
-- Готово!
-- ============================================
-- После выполнения этого скрипта:
-- 1. Таблицы users и leaderboard будут созданы
-- 2. Индексы будут созданы для производительности
-- 3. RLS будет включен
-- 4. Политики безопасности будут настроены
-- 
-- Теперь можно использовать проект в приложении!
-- ============================================

