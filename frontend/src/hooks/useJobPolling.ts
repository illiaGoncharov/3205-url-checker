// Опрос активного задания: раз в секунду подтягивает свежий статус с бэка
import { useEffect } from 'react';
import { useJobsStore } from '../store/jobsStore';
import * as jobsApi from '../api/jobsApi';

const TERMINAL_STATUSES = ['completed', 'cancelled', 'failed'];

export function useJobPolling() {
  const activeJobId = useJobsStore((state) => state.activeJobId);
  const setActiveJob = useJobsStore((state) => state.setActiveJob);
  const syncJobInList = useJobsStore((state) => state.syncJobInList);

  useEffect(() => {
    // Ничего не выбрано -- опрашивать нечего
    if (!activeJobId) return;

    let cancelled = false;

    const loadJob = async () => {
      const job = await jobsApi.getJob(activeJobId).catch(() => null);
      // Если за время запроса пользователь выбрал другое задание -- эти данные больше не актуальны
      if (cancelled || !job) return;

      setActiveJob(job);
      syncJobInList(job); // Обновляем и карточку в списке слева тоже

      return job;
    };

    // Первая загрузка сразу, не ждём секунду до первого тика
    loadJob();

    const intervalId = setInterval(async () => {
      const job = await loadJob();
      if (job && TERMINAL_STATUSES.includes(job.status)) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [activeJobId, setActiveJob, syncJobInList]);
}
