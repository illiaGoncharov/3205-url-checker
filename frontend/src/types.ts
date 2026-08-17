// Статус всего задания
export type JobStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "failed";

// Статус одного URL внутри задания
export type UrlStatus =
  | "pending"
  | "in_progress"
  | "success"
  | "error"
  | "cancelled";

export type UrlResult = {
  url: string;
  status: UrlStatus;
  httpStatus?: number;
  error?: string;
  startedAt?: string;
  finishedAt?: string;
  durationMs?: number;
};

export type Job = {
  id: string;
  createdAt: string;
  status: JobStatus;
  urls: UrlResult[];
};

// Краткая версия для GET /api/jobs
export type JobSummary = {
  id: string;
  createdAt: string;
  status: JobStatus;
  total: number;
  success: number;
  error: number;
};
