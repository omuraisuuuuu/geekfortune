# 🔌 Подключение нового проекта Supabase

## 📋 Быстрая инструкция

### Шаг 1: Получите ключи из нового проекта Supabase

1. Откройте https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct
2. Войдите в свой аккаунт
3. Перейдите в **Settings** → **API**
4. Найдите следующие ключи:
   - **Project URL** (например: `https://qxkmwmrjsyjxmtydahct.supabase.co`)
   - **anon public key** (ключ начинается с `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
5. Скопируйте эти ключи

### Шаг 2: Создайте таблицы в новом проекте

1. В Supabase Dashboard перейдите в **SQL Editor**
2. Нажмите **New query**
3. Скопируйте содержимое файла `setup_new_supabase.sql`
4. Вставьте в SQL Editor
5. Нажмите **Run** (или `Ctrl+Enter`)
6. Проверьте, что таблицы созданы (перейдите в **Table Editor**)

### Шаг 3: Настройте переменные окружения

#### 3.1 Локально (для разработки)

1. Создайте файл `.env` в корне проекта
2. Скопируйте содержимое из `.env.example`
3. Замените `your_anon_public_key_here` на реальный anon public key
4. Убедитесь, что `VITE_SUPABASE_URL` правильный

#### 3.2 На Vercel (для production)

1. Откройте https://vercel.com
2. Выберите проект `geek-fortune-project-1`
3. Перейдите в **Settings** → **Environment Variables**
4. Обновите или добавьте следующие переменные:
   - `VITE_SUPABASE_URL` = `https://qxkmwmrjsyjxmtydahct.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = ваш anon public key
5. Нажмите **Save**
6. Пересоберите проект (Redeploy)

### Шаг 4: Проверьте работу

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

## 📝 Примечания

- **Не коммитьте файл `.env`** в Git (он уже в `.gitignore`)
- **Используйте переменные окружения** вместо захардкоженных ключей
- **Проверьте RLS политики** - они должны разрешать доступ к таблицам
- **Проверьте индексы** - они должны быть созданы для производительности

## 🔗 Полезные ссылки

- **Supabase Dashboard**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct
- **SQL Editor**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/sql
- **Table Editor**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/editor
- **API Settings**: https://supabase.com/dashboard/project/qxkmwmrjsyjxmtydahct/settings/api
- **Documentation**: https://supabase.com/docs

## 🎉 Готово!

После выполнения всех шагов ваше приложение будет работать с новым проектом Supabase!

