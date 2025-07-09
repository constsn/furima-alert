import { auth } from '@/auth';
import { sendNotificationToUser } from '@/lib/notify/push-notification';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: '認証エラーです' });
  }

  await sendNotificationToUser(userId, {
    title: 'kanye tシャツ 6000円',
    url: 'https://jp.mercari.com/',
  });

  return NextResponse.json({ message: 'スクレイピング完了しました！' });
}
