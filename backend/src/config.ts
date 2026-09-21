export interface AppConfig {
  port: number;
  corsOrigin: string;
}

let cachedConfig: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const rawPort = process.env.PORT;
  // Переводим в число в 10-ричной системе счисления:
  const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : 3000;
  // Если вписали не число (NaN), страхуемся дефолтом:
  const port = Number.isNaN(parsedPort) ? 3000 : parsedPort;

  const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

  // Сохраняем вычисленный конфиг в замыкание
  cachedConfig = {
    port,
    corsOrigin,
  };

  return cachedConfig;
}