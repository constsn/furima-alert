export const naturalDelay = (
  min: number = 2000,
  max: number = 8000
): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  const jitter = Math.random() * 500 - 250; // ±250msのジッター
  const finalDelay = Math.max(min, delay + jitter);

  return new Promise(resolve => setTimeout(resolve, finalDelay));
};
