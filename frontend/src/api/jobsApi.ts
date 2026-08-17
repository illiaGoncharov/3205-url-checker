import type { Job, JobSummary } from "../types";

// Базовый URL для API
const API_BASE = "http://localhost:3000/api/jobs";

// Создание задания -- строго массив ссылок + возвращает jobId
export async function createJob(urls: string[]): Promise<string> {
  const response = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ urls }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Ошибка при создании задания");
  }

  // Получаем jobId
  const data = await response.json();
  return data.jobId;
};

// Получение списка заданий -- возвращает массив summary
export async function getJobs(): Promise<JobSummary[]> {
  const response = await fetch(`${API_BASE}`);
  if (!response.ok) {
    throw new Error("Не удалось загрузить список заданий");
  }
  return response.json();
}

// Получение задания по id -- возвращает job
export async function getJob(id: string): Promise<Job> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    throw new Error("Не удалось загрузить задание");
  }
  return response.json();
}

// Отмена задания -- возвращает void
export async function cancelJob(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Не удалось отменить задание");
  }
}