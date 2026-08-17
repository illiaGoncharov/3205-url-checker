import { useJobsStore } from '../../store/jobsStore';
import { Badge } from '../ui/Badge';
import type { UrlStatus } from '../../types';
import styles from './JobDetails.module.css';

const statusConfig: Record<UrlStatus, { label: string; tone: 'muted' | 'primary' | 'success' | 'warning' | 'danger' }> = {
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

  return (
    <div className="card">
      {/* Шапка карточки */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Задание {activeJob.id.slice(0, 8)}</h3>
          <p className={styles.timestamp}>{new Date(activeJob.createdAt).toLocaleTimeString()}</p>
        </div>

        {canCancel && (
          <button onClick={() => cancelJob(activeJob.id)} className={styles.cancelButton}>
            Отменить
          </button>
        )}
      </div>

      {/* Список ссылок */}
      <div className={styles.urlList}>
        {activeJob.urls.map((item, index) => {
          const status = statusConfig[item.status];

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
    </div>
  );
}
