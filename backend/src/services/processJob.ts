// Ядро - асинхронная обработка URL
import { getJob, setJob } from '../store';
import { sleep } from '../utils/sleep';

export async function processJob(jobId: string): Promise<void> {
  const job = getJob(jobId);
  if (!job) return;

  job.status = 'in_progress';
  setJob(job);
  
  // Цикл по URL-ам
  for (const url of job.urls) {
    const fresh = getJob(jobId);
    if (!fresh) return;

    // Если job cancelled и этот url pending -- cancelled, continue
    if (fresh.status === 'cancelled' && url.status === 'pending') {
      url.status = 'cancelled';
      setJob(job);
      continue;
    }

    url.status = 'in_progress';
    url.startedAt = new Date().toISOString();
    setJob(job);

    // Искусственная задержка
    await sleep(Math.random() * 10000);

    // HEAD-запрос
    try { 
      const res = await fetch(url.url, { method: "HEAD" }); 
      url.status = "success"; 
      url.httpStatus = res.status;
    } catch (error) { 
      url.status = "error"; 
      url.error = error instanceof Error ? error.message : "Unknown error";
    }

    // Зафиксировать finishedAt и durationMs
    url.finishedAt = new Date().toISOString();
    url.durationMs =
      new Date(url.finishedAt).getTime() - new Date(url.startedAt).getTime();
    setJob(job);
  }

  // Если job не cancelled -- completed
  const done = getJob(jobId);
  if (done && done.status !== "cancelled") {
    done.status = "completed";
    setJob(done);
  }
}
