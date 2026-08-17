// Компромисс между скоростью для клиента и стабильностью системы 

export async function mapPool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  // Место под результаты всех задач
  const results = new Array<R>(items.length);
  // Номер следующей задачи в очереди (с 0)
  let next = 0;

  // Логика одного бокса-воркера
  async function run(): Promise<void> {
    while (true) {
      const i = next++; // Берем следующий номер из очереди
      if (i >= items.length) return; // Если задачи кончились — бокс закрывается
      results[i] = await worker(items[i], i); // Делаем работу и ждем окончания
    }
  }

  //  Открываем 5 боксов одновременно
  const runners = Array.from({ length: Math.min(limit, items.length) }, () =>
    run(),
  );

  // Ждем завершения всех боксов
  await Promise.all(runners);

  return results; // Возвращаем все результаты в том же порядке, что в items
}
