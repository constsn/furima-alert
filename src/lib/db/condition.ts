'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export const deleteCondition = async (conditionId: string) => {
  try {
    await prisma.$transaction(async tx => {
      await tx.notifiedItem.deleteMany({
        where: {
          conditionId,
        },
      });

      await tx.condition.delete({
        where: {
          id: conditionId,
        },
      });
    });

    console.log(
      `✅ Condition（ID: ${conditionId}）と紐づくNotifiedItemを削除しました`
    );

    revalidatePath('/dashboard');
  } catch (error) {
    console.error(`❌ Condition削除時にエラーが発生しました:`, error);
    throw error;
  }
};

export const getConditionsByUserId = async (userId: string) => {
  return await prisma.condition.findMany({
    where: { userId },
  });
};
