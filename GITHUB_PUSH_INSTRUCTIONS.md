# Инструкция по загрузке проекта на GitHub

## ✅ Что уже сделано:

1. ✅ Изменен удаленный репозиторий на: `https://github.com/omuraisuuuuu/geekfortune.git`
2. ✅ Все изменения добавлены в staging
3. ✅ Изменения закоммичены
4. ⚠️ Осталось только запушить на GitHub

## 🔧 Что нужно сделать:

### Вариант 1: Использовать Personal Access Token (рекомендуется)

1. Создайте Personal Access Token на GitHub:
   - Откройте https://github.com/settings/tokens
   - Нажмите "Generate new token" → "Generate new token (classic)"
   - Дайте токену имя (например, "geekfortune")
   - Выберите права: `repo` (полный доступ к репозиториям)
   - Нажмите "Generate token"
   - Скопируйте токен (он показывается только один раз!)

2. Используйте токен для push:
   ```bash
   git push -u origin main
   ```
   - Когда спросит username: введите `omuraisuuuuu`
   - Когда спросит password: вставьте Personal Access Token (не ваш пароль!)

### Вариант 2: Использовать GitHub CLI

1. Установите GitHub CLI (если не установлен):
   ```bash
   winget install GitHub.cli
   ```

2. Авторизуйтесь:
   ```bash
   gh auth login
   ```

3. Запушите:
   ```bash
   git push -u origin main
   ```

### Вариант 3: Использовать SSH ключ

1. Создайте SSH ключ (если нет):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Добавьте ключ в GitHub:
   - Откройте https://github.com/settings/keys
   - Нажмите "New SSH key"
   - Вставьте содержимое файла `~/.ssh/id_ed25519.pub`

3. Измените URL на SSH:
   ```bash
   git remote set-url origin git@github.com:omuraisuuuuu/geekfortune.git
   ```

4. Запушите:
   ```bash
   git push -u origin main
   ```

### Вариант 4: Загрузить через веб-интерфейс GitHub

1. Создайте ZIP архив проекта (исключая `node_modules`, `.git`, `dist`)
2. Откройте https://github.com/omuraisuuuuu/geekfortune
3. Нажмите "uploading an existing file"
4. Загрузите файлы проекта
5. Закоммитьте изменения

## 📝 Примечание:

Текущая ситуация:
- Проект уже закоммичен локально
- Удаленный репозиторий настроен на: `https://github.com/omuraisuuuuu/geekfortune.git`
- Нужно только авторизоваться и запушить

## 🔍 Проверка:

После успешного push проверьте:
- https://github.com/omuraisuuuuu/geekfortune
- Все файлы должны быть там
- Репозиторий должен содержать все изменения

