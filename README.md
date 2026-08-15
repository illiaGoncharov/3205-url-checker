# URL Checker

Тестовое: пачка URL, проверка в фоне, можно смотреть статус и отменить.

Бэк на Express + TS, фронт на React (Vite). Базы нет, всё в памяти — после рестарта задания пропадают.

## Запуск

Два терминала:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Бэк: http://localhost:3000  
Фронт: http://localhost:5173

## Что умеет API

- `POST /api/jobs` — `{ "urls": ["https://..."] }`, в ответе `jobId`
- `GET /api/jobs` — список
- `GET /api/jobs/:id` — одно задание и каждый URL
- `DELETE /api/jobs/:id` — отмена. То, что уже началось, доработает.

Пока сервер только слушает порт, роуты пустые. Дальше — store и обработка.
