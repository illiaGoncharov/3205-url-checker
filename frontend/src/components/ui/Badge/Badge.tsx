// Бейдж статуса: цветная точка + текст, без иконок
import styles from './Badge.module.css';

export type BadgeTone = 'muted' | 'primary' | 'success' | 'warning' | 'danger';

export function Badge({ label, tone }: { label: string; tone: BadgeTone }) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      <span className={styles.dot} />
      {label}
    </span>
  );
}
