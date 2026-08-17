import { useEffect } from 'react';
import { useJobsStore } from '../../store/jobsStore';
import { Badge } from '../ui/Badge';
import type { JobStatus } from '../../types';
import styles from './JobsList.module.css';

const statusConfig: Record<JobStatus, { label: string; tone: 'muted' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  pending: { label: 'В очереди', tone: 'muted' },
  in_progress: { label: 'В процессе', tone: 'primary' },
  completed: { label: 'Готово', tone: 'success' },
  cancelled: { label: 'Отменено', tone: 'warning' },
  failed: { label: 'Ошибка', tone: 'danger' },
};

export function JobsList() {
  const jobs = useJobsStore((state) => state.jobs);
  const activeJobId = useJobsStore((state) => state.activeJobId);
  const listLoading = useJobsStore((state) => state.listLoading);
  const fetchJobs = useJobsStore((state) => state.fetchJobs);
  const selectJob = useJobsStore((state) => state.selectJob);

  // Загружаем список при старте
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="card">
      <div className={styles.header}>
        <h3 className={styles.title}>История ({jobs.length})</h3>
        <button onClick={() => fetchJobs()} disabled={listLoading} className={styles.refreshButton}>
          {listLoading ? 'Обновление...' : 'Обновить'}
        </button>
      </div>

      {jobs.length === 0 && !listLoading && <p className={styles.empty}>Нет заданий. Создайте первое выше</p>}

      <div className={styles.list}>
        {jobs.map((job) => {
          const isSelected = job.id === activeJobId;
          const time = new Date(job.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          const status = statusConfig[job.status];

          return (
            <div
              key={job.id}
              onClick={() => selectJob(job.id)}
              className={`${styles.item} ${isSelected ? styles.selected : ''}`}
            >
              <div className={styles.itemHeader}>
                <span className={styles.itemTime}>{time}</span>
                <Badge label={status.label} tone={status.tone} />
              </div>

              <div className={styles.itemStats}>
                <span>Всего: {job.total}</span>
                <span className={styles.itemStatsSuccess}>Успех: {job.success}</span>
                {job.error > 0 && <span className={styles.itemStatsError}>Ошибок: {job.error}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
