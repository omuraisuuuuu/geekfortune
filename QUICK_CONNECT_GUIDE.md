# ⚡ Быстрое подключение нового проекта Supabase

## 🎯 Цель
Подключить проект к новому проекту Supabase: `qxkmwmrjsyjxmtydahct`

## 📋 Шаг 1: Получите ключи из нового проекта

1. Откройте: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/settings/api
2. Скопируйте:
   - **Project URL** (например: `https://qxkmwmrjsyjxmtydahct.supabase.co`)
   - **anon public key** (длинный ключ, начинается с `eyJ...`)

## 📋 Шаг 2: Создайте таблицы

1. Откройте: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/sql
2. Нажмите **New query**
3. Скопируйте весь код из файла `setup_new_supabase.sql`
4. Вставьте в SQL Editor
5. Нажмите **Run** (или `Ctrl+Enter`)
6. Проверьте результат: должно быть сообщение "Success"

## 📋 Шаг 3: Настройте переменные окружения

### Для локальной разработки:

1. Создайте файл `.env` в корне проекта
2. Добавьте следующие строки:
   ```
   VITE_SUPABASE_URL=https://qxkmwmrjsyjxmtydahct.supabase.co
   VITE_SUPABASE_ANON_KEY=ваш_anon_public_key_здесь
   ```
3. Замените `ваш_anon_public_key_здесь` на реальный ключ из шага 1

### Для Vercel (production):

1. Откройте: https://vercel.com/aldiyars-projects-deeb61f1/geek-fortune-project-1/settings/environment-variables
2. Обновите или добавьте:
   - `VITE_SUPABASE_URL` = `https://qxkmwmrjsyjxmtydahct.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = ваш anon public key
3. Нажмите **Save**
4. Пересоберите проект: **Deployments** → **Redeploy**

## 📋 Шаг 4: Проверьте работу

1. Запустите проект локально:
   ```bash
   npm run dev
   ```

2. Откройте http://localhost:3000
3. Зарегистрируйтесь как новый пользователь
4. Сыграйте игру
5. Проверьте лидерборд

## ✅ Готово!

Теперь проект подключен к новому проекту Supabase!

## 🔍 Проверка в Supabase

1. Откройте: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/editor
2. Вы должны увидеть таблицы:
   - `users` (пользователи)
   - `leaderboard` (лидерборд)
3. После регистрации пользователя должны появиться записи в таблице `users`
4. После игры должны появиться записи в таблице `leaderboard`

## 🆘 Проблемы?

Если что-то не работает:

1. **Проверьте консоль браузера** (F12) - должны быть запросы к Supabase
2. **Проверьте переменные окружения** - они должны быть правильно настроены
3. **Проверьте RLS политики** - они должны быть созданы
4. **Проверьте таблицы** - они должны существовать

## 📝 Примечания

- Файл `.env` уже в `.gitignore` - не будет закоммичен
- Переменные окружения в Vercel должны быть настроены для production
- После изменения переменных окружения в Vercel нужно пересобрать проект

