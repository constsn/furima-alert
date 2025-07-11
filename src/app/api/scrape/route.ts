import { scrape } from '@/lib/scrape/scrape';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('スクレイピング開始です');
    await scrape();
    return NextResponse.json({ message: 'スクレイピング完了しました！' });
  } catch (error) {
    console.error('スクレイピングAPIエラー:', error);
    return NextResponse.json(
      {
        error: 'スクレイピング処理でエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
