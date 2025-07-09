import { deleteCondition } from '@/lib/db/condition';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await deleteCondition(id);

    return NextResponse.json({ message: '削除完了' }, { status: 200 });
  } catch (error) {
    console.error('❌条件削除APIエラー：', error);
    return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
  }
}
