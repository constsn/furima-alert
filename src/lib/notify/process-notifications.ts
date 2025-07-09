import { Item } from '@/types/item';
import { chunkArray } from '../utils/chunkArray';
import { sendNotificationToUser } from './push-notification';
import { retryWithBackoff } from '../utils/retry-withBackoff';

export const processNotifications = async (userId: string, items: Item[]) => {
  const NOTIFICATION_BATCH_SIZE = 5;
  const batches = chunkArray(items, NOTIFICATION_BATCH_SIZE);

  for (const batch of batches) {
    const promise = batch.map(item =>
      retryWithBackoff(() =>
        sendNotificationToUser(userId, {
          title: item.title as string,
          url: item.url as string,
        })
      ).catch(error => {
        console.error(
          `--- 通知送信プロセスエラー - User: ${userId}, Item: ${item.id} ---`,
          error
        );
        return null; // エラーを記録するが処理は続行
      })
    );

    await Promise.allSettled(promise);
  }
};
