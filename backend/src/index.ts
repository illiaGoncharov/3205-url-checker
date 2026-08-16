// Точка входа Express-приложения
import express from "express";
import cors from 'cors';
import jobsRouter from './routes/jobs';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Регистрируем middleware и роуты
app.use(cors({ origin: 'http://localhost:5173' }));
// Парсим JSON-тело запроса
app.use(express.json());
// Регируем роуты
app.use('/api/jobs', jobsRouter);

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`Backend запущен на http://localhost:${PORT}`);
});
