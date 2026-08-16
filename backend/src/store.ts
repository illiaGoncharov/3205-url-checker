// Задания в памяти: Map по jobId
import type { Job } from './types';

// Map заданий
export const jobs = new Map<string, Job>();

// Получить задание по id
export const getJob = (id: string): Job | undefined => jobs.get(id);

// Установить задание
export const setJob = (job: Job): void => {
  jobs.set(job.id, job);
};

// Получить все задания
export const getAllJobs = (): Job[] => Array.from(jobs.values());