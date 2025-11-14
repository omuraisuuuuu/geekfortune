# 🚀 Настройка нового проекта Supabase

## 📋 Шаг 1: Получение ключей из нового проекта

### 1.1 Откройте новый проект Supabase

1. Перейдите на https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct
2. Войдите в свой аккаунт

### 1.2 Получите Project URL и API Keys

1. В левом меню найдите **Settings** → **API**
2. Найдите следующие ключи:
   - **Project URL** (например: `https://qxkmwmrjsyjxmtydahct.supabase.co`)
   - **anon public key** (ключ начинается с `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
3. Скопируйте эти ключи - они понадобятся позже

## 📋 Шаг 2: Создание таблиц в новом проекте

### 2.1 Откройте SQL Editor

1. В левом меню найдите **SQL Editor** (иконка базы данных)
2. Нажмите **New query**

### 2.2 Выполните SQL скрипт

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

### 2.3 Проверка создания таблиц

1. Перейдите в **Table Editor** (в левом меню)
2. Вы должны увидеть две таблицы:
   - `users`
   - `leaderboard`

## 📋 Шаг 3: Обновление конфигурации проекта

### 3.1 Создайте файл .env

Создайте файл `.env` в корне проекта с содержимым:

```env
VITE_SUPABASE_URL=https://qxkmwmrjsyjxmtydahct.supabase.co
VITE_SUPABASE_ANON_KEY=ваш_anon_public_key_здесь
```

**Важно:** Замените `ваш_anon_public_key_здесь` на реальный anon public key из вашего проекта!

### 3.2 Обновите переменные окружения в Vercel

1. Откройте https://vercel.com
2. Выберите проект `geek-fortune-project-1`
3. Перейдите в **Settings** → **Environment Variables**
4. Обновите или добавьте следующие переменные:
   - `VITE_SUPABASE_URL` = `https://qxkmwmrjsyjxmtydahct.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = ваш anon public key
5. Нажмите **Save**
6. Пересоберите проект (Redeploy)

## 📋 Шаг 4: Обновление кода (если нужно)

Если нужно обновить код проекта для использования нового проекта Supabase, обновите файл `src/lib/supabase.ts`:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qxkmwmrjsyjxmtydahct.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'ваш_anon_public_key'
```

**Но лучше использовать переменные окружения!** Не храните ключи в коде.

## ✅ Проверка работы

1. Запустите проект локально:
   ```bash
   npm run dev
   ```

2. Откройте приложение в браузере
3. Зарегистрируйте нового пользователя
4. Сыграйте игру
5. Проверьте лидерборд
6. Проверьте в Supabase Table Editor, что данные сохраняются

## 🔍 Отладка

Если что-то не работает:

1. **Проверьте консоль браузера** (F12) на наличие ошибок
2. **Проверьте Network tab** - должны быть запросы к Supabase API
3. **Проверьте Supabase Dashboard**:
   - Table Editor - должны появляться новые записи
   - Logs - должны быть логи запросов
4. **Проверьте RLS политики** - они должны быть созданы и активны
5. **Проверьте переменные окружения** - они должны быть правильно настроены

## 🔗 Полезные ссылки

- **Supabase Dashboard**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct
- **SQL Editor**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/sql
- **Table Editor**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/editor
- **API Settings**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/settings/api
- **Documentation**: https://supabase.com/docs

## 🎉 Готово!

После выполнения всех шагов ваше приложение будет работать с новым проектом Supabase!
Все данные будут храниться в новой облачной базе данных и доступны с любого устройства.

