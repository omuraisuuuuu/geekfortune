# 🔧 Обновление переменных окружения в Vercel

## ⚠️ Проблема

Проект на Vercel все еще использует старую базу данных, потому что:
1. Переменные окружения в Vercel могут быть установлены на старые ключи
2. Переменные окружения имеют приоритет над значениями по умолчанию в коде

## ✅ Что уже сделано:

1. ✅ Код обновлен для использования новой базы данных
2. ✅ Изменения закоммичены и запушены в GitHub
3. ✅ Новые ключи в коде: `qxkmwmrjsyjxmtydahct`

## 📋 Что нужно сделать ВАМ:

### Шаг 1: Обновите переменные окружения в Vercel

**Важно:** URL вашего проекта: `https://geekfortune-7s4ift4o5-omuraisus-projects.vercel.app`

Это другой проект, чем `geek-fortune-project-1`. Нужно обновить переменные окружения для правильного проекта.

#### Вариант A: Через веб-интерфейс Vercel

1. Откройте Vercel Dashboard: https://vercel.com
2. Найдите проект, который соответствует URL: `geekfortune-7s4ift4o5-omuraisus-projects.vercel.app`
   - Возможно, это проект связан с GitHub репозиторием `omuraisuuuuu/geekfortune`
3. Перейдите в **Settings** → **Environment Variables**
4. Найдите или создайте следующие переменные:

   **VITE_SUPABASE_URL:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://qxkmwmrjsyjxmtydahct.supabase.co`
   - Environment: `Production`, `Preview`, `Development` ✅
   - Если переменная уже существует со старым значением - удалите её и создайте заново

   **VITE_SUPABASE_ANON_KEY:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4a213bXJqc3lqeG10eWRhaGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDMyNzgsImV4cCI6MjA3ODcxOTI3OH0.xQi4JbxBDk8u2ZtSkcrRTsbVUOtbrpsgGPRICy_2ybo`
   - Environment: `Production`, `Preview`, `Development` ✅
   - Если переменная уже существует со старым значением - удалите её и создайте заново

5. Нажмите **Save** для каждой переменной

#### Вариант B: Удалите переменные окружения (если они есть)

Если переменные окружения установлены на старые ключи, удалите их:

1. Откройте **Settings** → **Environment Variables**
2. Найдите `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`
3. Удалите их (если они установлены на старые значения)
4. Теперь проект будет использовать новые значения из кода

### Шаг 2: Пересоберите проект

1. Перейдите в **Deployments**
2. Найдите последний deployment
3. Нажмите **⋮** (три точки) → **Redeploy**
4. Или создайте новый deployment через GitHub (если проект связан с GitHub)

### Шаг 3: Проверьте работу

1. Откройте сайт: https://geekfortune-7s4ift4o5-omuraisus-projects.vercel.app
2. Зарегистрируйтесь как новый пользователь
3. Сыграйте игру
4. Проверьте лидерборд
5. Проверьте в Supabase Table Editor, что данные сохраняются в новой базе

## 🔍 Как проверить, что используется новая база данных:

1. Откройте консоль браузера (F12)
2. Перейдите на вкладку **Network**
3. Найдите запросы к Supabase API
4. Проверьте URL запросов - должны быть к `qxkmwmrjsyjxmtydahct.supabase.co`
5. Если запросы идут к `yfehfkmeruawtuwduyvt.supabase.co` - значит используются старые ключи

## 🆘 Если проблема сохраняется:

1. **Проверьте переменные окружения** - они должны быть правильно настроены
2. **Проверьте, что проект пересобран** - должен быть новый deployment после изменения переменных
3. **Проверьте, что таблицы созданы** в новой базе данных Supabase
4. **Очистите кеш браузера** - возможно, используется закешированная версия

## 📝 Важно:

- **Переменные окружения имеют приоритет** над значениями по умолчанию в коде
- **После изменения переменных окружения** нужно пересобрать проект
- **Убедитесь, что таблицы созданы** в новой базе данных Supabase

## 🔗 Полезные ссылки:

- **Vercel Dashboard**: https://vercel.com
- **Supabase Dashboard**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct
- **SQL Editor**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/sql
- **Table Editor**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/editor

