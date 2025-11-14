# 🚀 Туториал по настройке Supabase для Geek Fortune

## 📋 Шаг 1: Создание таблиц в Supabase

### 1.1 Откройте SQL Editor в Supabase

1. Перейдите на https://app.supabase.com
2. Выберите ваш проект
3. В левом меню найдите **SQL Editor** (иконка базы данных)
4. Нажмите **New query**

### 1.2 Выполните SQL скрипт

Скопируйте и выполните следующий SQL скрипт:

```sql
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
```

### 1.3 Проверка создания таблиц

1. Перейдите в **Table Editor** (в левом меню)
2. Вы должны увидеть две таблицы:
   - `users`
   - `leaderboard`

## 📋 Шаг 2: Проверка API ключей

### 2.1 Получение ключей

1. Перейдите в **Settings** → **API** (в левом меню)
2. Убедитесь, что у вас есть:
   - **Project URL**: `https://yfehfkmeruawtuwduyvt.supabase.co`
   - **anon public key**: (должен быть в файле `password_DB.txt`)

### 2.2 Сохранение ключей

Ключи уже сохранены в файле `password_DB.txt`:
- URL: `https://yfehfkmeruawtuwduyvt.supabase.co`
- anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZWhma21lcnVhd3R1d2R1eXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzkxMTUsImV4cCI6MjA3ODcxNTExNX0.XKJGee3n30KF8Cts-Jdpr34N38ztInpF3qwRdXbqeyY`

## 📋 Шаг 3: Установка зависимостей

Выполните в терминале:

```bash
npm install @supabase/supabase-js
```

## 📋 Шаг 4: Настройка проекта

### 4.1 Создание .env файла

Создайте файл `.env` в корне проекта с содержимым:

```env
VITE_SUPABASE_URL=https://yfehfkmeruawtuwduyvt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZWhma21lcnVhd3R1d2R1eXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzkxMTUsImV4cCI6MjA3ODcxNTExNX0.XKJGee3n30KF8Cts-Jdpr34N38ztInpF3qwRdXbqeyY
```

### 4.2 Добавление .env в .gitignore

Убедитесь, что файл `.env` добавлен в `.gitignore` (чтобы не коммитить ключи в Git).

## 📋 Шаг 5: Запуск проекта

После выполнения всех шагов:

```bash
npm run dev
```

## ✅ Проверка работы

1. Откройте приложение в браузере
2. Зарегистрируйте нового пользователя
3. Сыграйте игру
4. Проверьте лидерборд
5. Проверьте в Supabase Table Editor, что данные сохраняются

## 🔍 Отладка

Если что-то не работает:

1. **Проверьте консоль браузера** (F12) на наличие ошибок
2. **Проверьте Network tab** - должны быть запросы к Supabase API
3. **Проверьте Supabase Dashboard**:
   - Table Editor - должны появляться новые записи
   - Logs - должны быть логи запросов
4. **Проверьте RLS политики** - они должны быть созданы и активны

## 🔗 Полезные ссылки

- **Supabase Dashboard**: https://app.supabase.com/project/yfehfkmeruawtuwduyvt
- **SQL Editor**: https://app.supabase.com/project/yfehfkmeruawtuwduyvt/sql
- **Table Editor**: https://app.supabase.com/project/yfehfkmeruawtuwduyvt/editor
- **API Settings**: https://app.supabase.com/project/yfehfkmeruawtuwduyvt/settings/api
- **Documentation**: https://supabase.com/docs

## 🎉 Готово!

После выполнения всех шагов ваше приложение будет работать с Supabase!
Все данные будут храниться в облачной базе данных и доступны с любого устройства.

