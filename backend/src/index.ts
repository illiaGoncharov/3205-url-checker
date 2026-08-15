// Точка входа, пока только listen
import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Backend запущен на http://localhost:${PORT}`);
});
