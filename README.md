# URL Checker

Тестовое: пачка URL, проверка в фоне, можно смотреть статус и отменить

Бэк на Express + TS, фронт на React (Vite). Базы нет, всё в памяти — после рестарта задания пропадают

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

Или через Docker, одной командой (нужен запущенный Docker Desktop):

```bash
docker compose up --build
```

Порты те же — бэк на 3000, фронт на 5173. Внутри два образа: бэк собирается в обычный node-контейнер, фронт — сборка Vite, которую потом раздаёт nginx

## Что умеет API

- `POST /api/jobs` — `{ "urls": ["https://..."] }`, в ответе `jobId`
- `GET /api/jobs` — список
- `GET /api/jobs/:id` — одно задание и каждый URL
- `DELETE /api/jobs/:id` — отмена. То, что уже началось, доработает

Пример через curl:

```bash
curl -s -X POST http://localhost:3000/api/jobs \
  -H 'Content-Type: application/json' \
  -d '{"urls":["https://example.com","https://github.com"]}'

curl -s http://localhost:3000/api/jobs/<JOB_ID>
```

Проверка URL идёт в фоне сразу после POST: не больше 5 одновременно (`mapPool.ts`), на каждый запрос таймаут 10 секунд

## Фронт

Форма со списком ссылок, история заданий слева, карточка с деталями справа. Пока задание не завершилось — карточка раз в секунду сама опрашивает `GET /api/jobs/:id` и обновляет статусы (`useJobPolling.ts`), руками жать «обновить» не нужно

Стейт на Zustand (`store/jobsStore.ts`), без Redux — для такого размера стора это лишнее

Стили — обычный CSS с переменными для отступов/цветов/шрифтов (`index.css`) плюс CSS Modules на каждый компонент. Без UI-библиотек и Tailwind — не хотелось тащить зависимость ради одной формы и списка. Из внешнего — только Zustand
