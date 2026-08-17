import React, { useState } from 'react';
import { useJobsStore } from '../../store/jobsStore';
import styles from './CreateJobForm.module.css';

export function CreateJobForm() {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const createJob = useJobsStore((state) => state.createJob);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Парсим введенные строки
    const urls = text
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);

    if (urls.length === 0) {
      setFormError('Введите хотя бы одну ссылку');
      return;
    }

    setIsSubmitting(true);
    try {
      await createJob(urls);
      setText('');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Не удалось создать задание');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`card ${styles.card}`}>
      <form onSubmit={handleSubmit}>
        <h2 className={styles.title}>Новая проверка</h2>
        <p className={styles.hint}>Вставьте список ссылок, каждая с новой строки</p>

        <textarea
          className={styles.textarea}
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={'https://example.com\nhttps://github.com\nhttps://google.com'}
          disabled={isSubmitting}
        />

        {formError && <p className={styles.formError}>{formError}</p>}

        <div className={styles.submitRow}>
          <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
            {isSubmitting && <span className="spinner" />}
            {isSubmitting ? 'Создаём...' : 'Запустить проверку'}
          </button>
        </div>
      </form>
    </div>
  );
}
