# 🚀 Инструкция по настройке Supabase для Geek Fortune

## ✅ Что уже сделано:

1. ✅ Установлена зависимость `@supabase/supabase-js`
2. ✅ Создан файл `src/lib/supabase.ts` с клиентом Supabase
3. ✅ Обновлен `App.tsx` для работы с Supabase
4. ✅ Обновлен `LoginPage.tsx` для работы с Supabase
5. ✅ Обновлен `Leaderboard.tsx` для работы с Supabase
6. ✅ Создан `.gitignore` для защиты конфиденциальных данных

## 📋 Что нужно сделать вручную:

### Шаг 1: Создать .env файл

Создайте файл `.env` в корне проекта (там же, где находится `package.json`) со следующим содержимым:

```env
VITE_SUPABASE_URL=https://yfehfkmeruawtuwduyvt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZWhma21lcnVhd3R1d2R1eXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzkxMTUsImV4cCI6MjA3ODcxNTExNX0.XKJGee3n30KF8Cts-Jdpr34N38ztInpF3qwRdXbqeyY
```

**Важно:** 
- Файл `.env` уже добавлен в `.gitignore`, так что он не будет закоммичен в Git
- После создания `.env` файла перезапустите dev сервер (`npm run dev`)

### Шаг 2: Создать таблицы в Supabase

1. Перейдите на https://app.supabase.com
2. Выберите ваш проект
3. В левом меню найдите **SQL Editor**
4. Нажмите **New query**
5. Скопируйте и выполните SQL скрипт из файла `SUPABASE_SETUP.md` (раздел "Шаг 1.2")

Или выполните этот SQL скрипт:

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

### Шаг 3: Проверка создания таблиц

1. Перейдите в **Table Editor** (в левом меню Supabase)
2. Вы должны увидеть две таблицы:
   - `users`
   - `leaderboard`

### Шаг 4: Запуск проекта

1. Убедитесь, что файл `.env` создан и содержит правильные ключи
2. Перезапустите dev сервер:
   ```bash
   npm run dev
   ```

### Шаг 5: Проверка работы

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
5. **Проверьте .env файл** - убедитесь, что ключи правильные

## 🔗 Полезные ссылки

- **Supabase Dashboard**: https://app.supabase.com/project/yfehfkmeruawtuwduyvt
- **SQL Editor**: https://app.supabase.com/project/yfehfkmeruawtuwduyvt/sql
- **Table Editor**: https://app.supabase.com/project/yfehfkmeruawtuwduyvt/editor
- **API Settings**: https://app.supabase.com/project/yfehfkmeruawtuwduyvt/settings/api
- **Documentation**: https://supabase.com/docs

## 🎉 Готово!

После выполнения всех шагов ваше приложение будет работать с Supabase!
Все данные будут храниться в облачной базе данных и доступны с любого устройства.

## 📝 Примечания

- **Безопасность**: Политики RLS настроены так, что все могут читать и писать данные. Для продакшена рекомендуется настроить более строгие политики безопасности.
- **Пароли**: Сейчас пароли не используются, но поле `password_hash` в таблице `users` оставлено для будущей реализации аутентификации.
- **Хранение данных**: Все данные теперь хранятся в Supabase, а не в localStorage браузера.

