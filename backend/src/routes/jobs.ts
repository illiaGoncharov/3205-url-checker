// Роуты заданий
import { Router } from "express";
// Генерируем UUID
import { v4 as uuidv4 } from "uuid";
import { setJob, getAllJobs, getJob } from "../store";
import { processJob } from "../services/processJob";
import type { Job, JobSummary } from "../types";

const router = Router();

// Создание задания
router.post("/", (req, res) => {
  const rawUrls = req.body.urls;

  // Иначе .map/.trim упадут
  if (!Array.isArray(rawUrls)) {
    return res.status(400).json({ error: "urls must be a non-empty array" });
  }

  // Строки, trim, пустые выкинуть
  const urls = rawUrls
    .filter((url): url is string => typeof url === "string")
    .map((url) => url.trim())
    .filter(Boolean);

  if (urls.length === 0) {
    return res.status(400).json({ error: "urls must be a non-empty array" });
  }

  // Создаем задание
  const job: Job = {
    id: uuidv4(),
    urls: urls.map((url) => ({ url, status: "pending" as const })),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  setJob(job);
  void processJob(job.id);
  res.status(201).json({ jobId: job.id });
});

// Список заданий
router.get("/", (req, res) => {
  const jobs = getAllJobs();

  // Функция для преобразования задания в сводку
  function toSummary(job: Job): JobSummary {
    return {
      id: job.id,
      createdAt: job.createdAt,
      status: job.status,
      total: job.urls.length,
      success: job.urls.filter((url) => url.status === "success").length,
      error: job.urls.filter((url) => url.status === "error").length,
    };
  }

  // Преобразуем задания в сводки 
  const summaries = jobs.map(toSummary);
  res.json(summaries);
});

// Одно задание
router.get("/:id", (req, res) => {
  const job = getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json(job);
});

router.delete("/:id", (req, res) => {
  const job = getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  if (
    job.status === "cancelled" ||
    job.status === "completed" ||
    job.status === "failed"
  ) {
    return res.status(409).json({ error: "Job already finished" });
  }
  job.status = "cancelled";
  // Только не начатые. Которые уже идут — не трогаем
  job.urls.forEach((url) => {
    if (url.status === "pending") {
      url.status = "cancelled";
    }
  });
  setJob(job);
  res.json(job);
});

export default router;
