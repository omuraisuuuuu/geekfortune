# 🔧 Настройка переменных окружения в Vercel

## ✅ Код обновлен!

Код проекта уже обновлен для использования нового проекта Supabase:
- URL: `https://qxkmwmrjsyjxmtydahct.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4a213bXJqc3lqeG10eWRhaGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDMyNzgsImV4cCI6MjA3ODcxOTI3OH0.xQi4JbxBDk8u2ZtSkcrRTsbVUOtbrpsgGPRICy_2ybo`

## 📋 Настройка Vercel

### Шаг 1: Откройте настройки проекта на Vercel

1. Откройте: https://vercel.com/aldiyars-projects-deeb61f1/geek-fortune-project-1/settings/environment-variables
2. Войдите в свой аккаунт Vercel

### Шаг 2: Добавьте/Обновите переменные окружения

Добавьте или обновите следующие переменные:

**VITE_SUPABASE_URL:**
- Key: `VITE_SUPABASE_URL`
- Value: `https://qxkmwmrjsyjxmtydahct.supabase.co`
- Environment: `Production`, `Preview`, `Development` (отметьте все)

**VITE_SUPABASE_ANON_KEY:**
- Key: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4a213bXJqc3lqeG10eWRhaGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDMyNzgsImV4cCI6MjA3ODcxOTI3OH0.xQi4JbxBDk8u2ZtSkcrRTsbVUOtbrpsgGPRICy_2ybo`
- Environment: `Production`, `Preview`, `Development` (отметьте все)

### Шаг 3: Сохраните изменения

1. Нажмите **Save** для каждой переменной
2. Убедитесь, что обе переменные добавлены

### Шаг 4: Пересоберите проект

1. Перейдите в **Deployments**
2. Найдите последний deployment
3. Нажмите **⋮** (три точки) → **Redeploy**
4. Или создайте новый deployment через:
   ```bash
   vercel --prod
   ```

### Шаг 5: Проверьте работу

1. Откройте сайт: https://geek-fortune-project-1.vercel.app
2. Зарегистрируйтесь как новый пользователь
3. Сыграйте игру
4. Проверьте лидерборд
5. Проверьте в Supabase Table Editor, что данные сохраняются

## 🔍 Проверка

После настройки проверьте:

1. **Vercel Environment Variables** - переменные должны быть добавлены
2. **Vercel Deployments** - должен быть новый deployment
3. **Консоль браузера** (F12) - должны быть запросы к Supabase API
4. **Network tab** - должны быть запросы к `qxkmwmrjsyjxmtydahct.supabase.co`
5. **Supabase Table Editor** - должны появляться новые записи

## 🆘 Если что-то не работает:

1. **Проверьте переменные окружения** - они должны быть правильно настроены
2. **Проверьте таблицы** - они должны существовать в Supabase (выполните SQL скрипт)
3. **Проверьте RLS политики** - они должны быть созданы
4. **Проверьте консоль браузера** - должны быть запросы к Supabase
5. **Проверьте Vercel logs** - должны быть логи деплоя

## 📝 Важно:

- Убедитесь, что таблицы созданы в Supabase (выполните `setup_new_supabase.sql`)
- Убедитесь, что переменные окружения добавлены для всех окружений (Production, Preview, Development)
- После изменения переменных окружения нужно пересобрать проект

## 🔗 Полезные ссылки

- **Vercel Environment Variables**: https://vercel.com/aldiyars-projects-deeb61f1/geek-fortune-project-1/settings/environment-variables
- **Vercel Deployments**: https://vercel.com/aldiyars-projects-deeb61f1/geek-fortune-project-1/deployments
- **Supabase Dashboard**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct
- **Supabase SQL Editor**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/sql
- **Supabase Table Editor**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/editor

