import { CreateJobForm } from './components/CreateJobForm';
import { JobsList } from './components/JobsList';
import { JobDetails } from './components/JobDetails';
import { useJobsStore } from './store/jobsStore';
import styles from './App.module.css';

export default function App() {
  const error = useJobsStore((state) => state.error);

  return (
    <div className="container">
      {/* Шапка */}
      <header className={styles.header}>
        <h1 className={styles.title}>URL Checker</h1>
        <p className={styles.subtitle}>Фоновая проверка ссылок, не больше 5 запросов одновременно</p>
      </header>

      {/* Баннер ошибки */}
      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* Форма создания */}
      <CreateJobForm />

      {/* Список слева + карточка справа, на мобиле — одна колонка */}
      <div className="app-grid">
        <JobsList />
        <JobDetails />
      </div>
    </div>
  );
}
