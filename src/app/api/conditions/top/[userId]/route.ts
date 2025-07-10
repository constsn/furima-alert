import { getConditionsByUserId } from '@/lib/db/condition';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  const data = await getConditionsByUserId(userId);

  try {
    return NextResponse.json(data);
  } catch (error) {
    console.error('条件表示エラー', error);
    return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
  }
}
