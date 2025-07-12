import { Item } from '@/types/item';
import { prisma } from '../db/prisma';
import { processNotifications } from './process-notifications';

//  DB登録 & 通知処理
export const handleNewItems = async (
  userId: string,
  conditionId: string,
  items: Item[]
) => {
  if (!items || items.length === 0) return;

  try {
    // 有効なアイテムのみをフィルタリング
    const validItems = items.filter(
      item => item.id && item.title && item.url && item.price
    );

    if (validItems.length === 0) {
      console.log('有効なアイテムがありません');
      return;
    }

    // 既存のアイテムを一度に取得（初回判定のため全件取得）
    const existingIds = await prisma.notifiedItem.findMany({
      where: {
        userId,
        conditionId,
      },
      select: { itemId: true },
    });

    const existingItemIds = new Set(existingIds.map(e => e.itemId));
    const isFirstTime = existingIds.length === 0;
    if (isFirstTime) {
      await prisma.notifiedItem.createMany({
        data: validItems.map(item => ({
          itemId: item.id!,
          title: item.title!,
          url: item.url!,
          price: Number(item.price)!,
          userId,
          conditionId,
        })),
      });

      console.log(
        `✅初回は保存のみします。 保存したアイテム数: ${validItems.length} conditionId: ${conditionId}`
      );
      return;
    }

    const newItems = validItems.filter(
      item => !existingItemIds.has(item.id as string)
    );

    if (newItems.length === 0) {
      console.log(
        `✅新しい商品はありませんでした。 conditionId: ${conditionId}✅`
      );
      return;
    } else {
      console.log(
        `✅ 新しい商品: ${newItems.length}件 既にある商品: ${existingIds.length}件 conditionId: ${conditionId}⭐️`
      );
    }

    console.log(newItems[0].title, '✅商品タイトル');
    console.log(newItems[1].title, '✅商品タイトル');
    console.log(newItems[2].title, '✅商品タイトル');

    // 2. トランザクションを使用してDB操作を最適化
    await prisma.$transaction(async tx => {
      // バッチでアイテムを作成
      await tx.notifiedItem.createMany({
        data: newItems.map(item => ({
          itemId: item.id as string,
          title: item.title as string,
          url: item.url as string,
          price: Number(item.price),
          userId,
          conditionId,
        })),
      });
    });

    // 3. 通知処理を並列化（DB操作後に実行）
    await processNotifications(userId, newItems);
  } catch (error) {
    console.error(`handleNewItems error for user ${userId}:`, error);
    throw error;
  }
};
