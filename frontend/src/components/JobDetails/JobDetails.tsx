import { useState, useMemo } from 'react';
import { useJobsStore } from '../../store/jobsStore';
import { Badge } from '../ui/Badge';
import type { JobStatus, UrlStatus } from '../../types';
import styles from './JobDetails.module.css';

type FilterTab = 'all' | 'success' | 'error';

const jobStatusConfig: Record<JobStatus, { label: string; tone: 'muted' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  pending: { label: 'В очереди', tone: 'muted' },
  in_progress: { label: 'В процессе', tone: 'primary' },
  completed: { label: 'Готово', tone: 'success' },
  cancelled: { label: 'Отменено', tone: 'warning' },
  failed: { label: 'Ошибка', tone: 'danger' },
};

const urlStatusConfig: Record<UrlStatus, { label: string; tone: 'muted' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  pending: { label: 'В очереди', tone: 'muted' },
  in_progress: { label: 'Проверяется', tone: 'primary' },
  success: { label: 'Успех', tone: 'success' },
  error: { label: 'Ошибка', tone: 'danger' },
  cancelled: { label: 'Отменено', tone: 'warning' },
};

export function JobDetails() {
  const activeJobId = useJobsStore((state) => state.activeJobId);
  const activeJob = useJobsStore((state) => state.activeJob);
  const cancelJob = useJobsStore((state) => state.cancelJob);

  const [filter, setFilter] = useState<FilterTab>('all');

  // Вычисляем счётчики статусов
  const stats = useMemo(() => {
    if (!activeJob) {
      return { total: 0, processed: 0, success: 0, error: 0, inProgress: 0 };
    }

    const total = activeJob.urls.length;
    let success = 0;
    let error = 0;
    let inProgress = 0;
    let processed = 0;

    for (const u of activeJob.urls) {
      if (u.status === 'success') {
        success++;
        processed++;
      } else if (u.status === 'error') {
        error++;
        processed++;
      } else if (u.status === 'cancelled') {
        processed++;
      } else if (u.status === 'in_progress') {
        inProgress++;
      }
    }

    return { total, processed, success, error, inProgress };
  }, [activeJob]);

  // Фильтруем ссылки в зависимости от выбранной вкладки
  const filteredUrls = useMemo(() => {
    if (!activeJob) return [];
    if (filter === 'all') return activeJob.urls;
    if (filter === 'success') return activeJob.urls.filter((u) => u.status === 'success');
    if (filter === 'error') return activeJob.urls.filter((u) => u.status === 'error');
    return activeJob.urls;
  }, [activeJob, filter]);

  // Ничего не выбрано
  if (!activeJobId) {
    return <div className={`card ${styles.empty}`}>Выберите задание слева или запустите новую проверку</div>;
  }

  // Данные ещё грузятся
  if (!activeJob || activeJob.id !== activeJobId) {
    return (
      <div className={`card ${styles.loading}`}>
        <span className="spinner" />
        Загружаем детали...
      </div>
    );
  }

  const canCancel = activeJob.status === 'pending' || activeJob.status === 'in_progress';
  const jobStatus = jobStatusConfig[activeJob.status];

  // Проценты для прогресс-бара
  const successPercent = stats.total > 0 ? (stats.success / stats.total) * 100 : 0;
  const errorPercent = stats.total > 0 ? (stats.error / stats.total) * 100 : 0;
  const inProgressPercent = stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0;

  return (
    <div className="card">
      {/* Шапка карточки */}
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>Задание {activeJob.id.slice(0, 8)}</h3>
            <Badge label={jobStatus.label} tone={jobStatus.tone} />
          </div>
          <div className={styles.subHeader}>
            <span className={styles.timestamp}>{new Date(activeJob.createdAt).toLocaleTimeString()}</span>
            <span className={styles.progress}>
              Обработано: {stats.processed} из {stats.total}
            </span>
          </div>
        </div>

        {canCancel && (
          <button onClick={() => cancelJob(activeJob.id)} className={styles.cancelButton}>
            Отменить
          </button>
        )}
      </div>

      {/* Прогресс-бар выполнения */}
      <div className={styles.progressBar}>
        <div className={`${styles.progressSegment} ${styles.progressSuccess}`} style={{ width: `${successPercent}%` }} />
        <div className={`${styles.progressSegment} ${styles.progressError}`} style={{ width: `${errorPercent}%` }} />
        <div
          className={`${styles.progressSegment} ${styles.progressInProgress}`}
          style={{ width: `${inProgressPercent}%` }}
        />
      </div>

      {/* Фильтр-табы */}
      <div className={styles.filterRow}>
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`${styles.filterButton} ${filter === 'all' ? styles.filterButtonActive : ''}`}
        >
          Все ({stats.total})
        </button>
        <button
          type="button"
          onClick={() => setFilter('success')}
          className={`${styles.filterButton} ${filter === 'success' ? styles.filterButtonActive : ''}`}
        >
          Успешные ({stats.success})
        </button>
        {stats.error > 0 && (
          <button
            type="button"
            onClick={() => setFilter('error')}
            className={`${styles.filterButton} ${filter === 'error' ? styles.filterButtonActive : ''}`}
          >
            Ошибки ({stats.error})
          </button>
        )}
      </div>

      {/* Список ссылок */}
      {filteredUrls.length === 0 ? (
        <div className={styles.filterEmpty}>Нет ссылок с выбранным статусом</div>
      ) : (
        <div className={styles.urlList}>
          {filteredUrls.map((item, index) => {
            const status = urlStatusConfig[item.status];

            return (
              <div key={index} className={styles.urlRow}>
                <div className={styles.urlRowTop}>
                  <span className={styles.urlText}>{item.url}</span>

                  <div className={styles.urlMeta}>
                    {item.httpStatus && (
                      <span
                        className={`${styles.httpStatus} ${
                          item.httpStatus < 400 ? styles.httpStatusOk : styles.httpStatusFail
                        }`}
                      >
                        HTTP {item.httpStatus}
                      </span>
                    )}

                    {item.durationMs !== undefined && <span className={styles.duration}>{item.durationMs} мс</span>}

                    <Badge label={status.label} tone={status.tone} />
                  </div>
                </div>

                {item.error && <p className={styles.urlError}>{item.error}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
