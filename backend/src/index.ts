// Точка входа Express-приложения
import express from "express";
import cors from 'cors';
import jobsRouter from './routes/jobs';
import { getConfig } from './config';

const app = express();
const config = getConfig();

// Регистрируем middleware и роуты
app.use(cors({ origin: config.corsOrigin }));
// Парсим JSON-тело запроса
app.use(express.json());
// Регируем роуты
app.use('/api/jobs', jobsRouter);

// Запускаем сервер
app.listen(config.port, () => {
  console.log(`Backend запущен на http://localhost:${config.port}`);
});
