import { create } from "zustand";
import type { Job, JobSummary } from "../types";
import * as jobsApi from "../api/jobsApi";

// Интерфейс состояния
interface JobsState {
  jobs: JobSummary[];
  activeJobId: string | null;
  activeJob: Job | null;
  listLoading: boolean;
  error: string | null;

  fetchJobs: () => Promise<void>;
  createJob: (urls: string[]) => Promise<void>; 
  selectJob: (id: string) => void; 
  cancelJob: (id: string) => Promise<void>; 
  setActiveJob: (job: Job | null) => void; 
}

// Реализация состояния
export const useJobsStore = create<JobsState>()((set, get) => ({
  // Состояние по умолчанию
  jobs: [],
  activeJobId: null,
  activeJob: null,
  listLoading: false,
  error: null,

  // Загрузить список заданий
  fetchJobs: async () => {
    set({ listLoading: true });
    try {
      const jobs = await jobsApi.getJobs();
      set({ jobs });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Неизвестная ошибка" });
    } finally {
      set({ listLoading: false });
    }
  },

  // Создать задание
  createJob: async (urls: string[]) => {
    set({ listLoading: true });
    try {
      const jobId = await jobsApi.createJob(urls);
      set({ activeJobId: jobId });
      await get().fetchJobs(); // Обновить список заданий
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Неизвестная ошибка" });
    } finally {
      set({ listLoading: false });
    }
  },

  // Выбрать задание для просмотра
  selectJob: (id: string) => {
    set({ activeJobId: id, activeJob: null });
  },

  // Отменить задание
  cancelJob: async (id: string) => {
    try {
      await jobsApi.cancelJob(id);

      // Сразу локально ставим статус 'cancelled' в списке
      const updatedJobs = get().jobs.map((j) =>
        j.id === id ? { ...j, status: "cancelled" as const } : j
      );

      // И в открытой карточке
      const active = get().activeJob;
      // Если активное задание -- отменить его
      const updatedActive =
        active && active.id === id
          ? { ...active, status: "cancelled" as const }
          : active;

      set({ jobs: updatedJobs, activeJob: updatedActive });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Не удалось отменить задание",
      });
    }
  },

  // Положить актуальные данные задания
  setActiveJob: (job: Job | null) => {
    set({ activeJob: job });
  },
}));
