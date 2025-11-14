# 🚀 Быстрый старт - Supabase интеграция

## ✅ Что уже сделано автоматически:

1. ✅ Установлена зависимость `@supabase/supabase-js`
2. ✅ Создан файл `src/lib/supabase.ts` с клиентом Supabase
3. ✅ Обновлен `App.tsx` для работы с Supabase
4. ✅ Обновлен `LoginPage.tsx` для работы с Supabase
5. ✅ Обновлен `Leaderboard.tsx` для работы с Supabase
6. ✅ Создан `.gitignore` для защиты конфиденциальных данных
7. ✅ Создан туториал `SUPABASE_SETUP.md`

## 📋 Что нужно сделать ВРУЧНУЮ (2 шага):

### Шаг 1: Создать .env файл

**Создайте файл `.env` в корне проекта** (там же, где `package.json`) со следующим содержимым:

```env
VITE_SUPABASE_URL=https://yfehfkmeruawtuwduyvt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZWhma21lcnVhd3R1d2R1eXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzkxMTUsImV4cCI6MjA3ODcxNTExNX0.XKJGee3n30KF8Cts-Jdpr34N38ztInpF3qwRdXbqeyY
```

### Шаг 2: Создать таблицы в Supabase

1. Перейдите на https://app.supabase.com/project/yfehfkmeruawtuwduyvt
2. Откройте **SQL Editor** (слева в меню)
3. Нажмите **New query**
4. Скопируйте и выполните SQL скрипт из файла `SUPABASE_SETUP.md`

**Или выполните этот SQL скрипт:**

```sql
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

CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  score INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_date ON leaderboard(date DESC);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON users FOR UPDATE USING (true);

CREATE POLICY "Anyone can read leaderboard" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Anyone can insert leaderboard" ON leaderboard FOR INSERT WITH CHECK (true);
```

### Шаг 3: Запустить проект

```bash
npm run dev
```

## 🎉 Готово!

После выполнения этих шагов приложение будет работать с Supabase!

## 📚 Подробная инструкция

Смотрите файл `SETUP_INSTRUCTIONS.md` для подробной информации.

