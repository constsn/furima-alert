import webpush from '../webpush';
import { prisma } from '../db/prisma';

export interface NotificationPayload {
  title: string;
  icon?: string;
  badge?: string;
  url?: string;
  price?: string;
}

export async function sendNotificationToUser(
  userId: string,
  payload: NotificationPayload
) {
  try {
    // ユーザーのプッシュサブスクリプションを取得
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
      console.log(`No push subscriptions found for user: ${userId}`);
      return;
    }

    // 通知を送信
    const promises = subscriptions.map(async subscription => {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      };

      try {
        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(payload)
        );
        console.log(`--- 通知を送りました✅ userId: ${userId} ---`);
      } catch (error) {
        console.error(
          `--- 通知を送るのに失敗しました❌ userId: ${userId} ---`,
          error
        );
        const e = error as { statusCode?: number };

        // サブスクリプションが無効な場合は削除
        if (e.statusCode === 410) {
          await prisma.pushSubscription.delete({
            where: { id: subscription.id },
          });
          console.log(`Deleted invalid subscription for user: ${userId}`);
        }
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
}
