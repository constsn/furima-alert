// 7. メモリ使用量監視
export const checkMemoryUsage = (): void => {
  const used = process.memoryUsage();
  const memoryUsageMB = {
    rss: Math.round(used.rss / 1024 / 1024),
    heapUsed: Math.round(used.heapUsed / 1024 / 1024),
  };

  console.log(
    `Memory usage: RSS=${memoryUsageMB.rss}MB, Heap=${memoryUsageMB.heapUsed}MB`
  );

  // メモリ使用量が閾値を超えた場合の警告
  if (memoryUsageMB.heapUsed > 512) {
    console.warn('⚠️ High memory usage detected');
  }
};
