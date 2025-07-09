// 5. リトライ機能付きヘルパー関数
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = Math.pow(2, i) * 1000; // 1秒, 2秒, 4秒
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('最大試行回数に達しました');
};
