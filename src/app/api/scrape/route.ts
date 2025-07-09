import { scrape } from '@/lib/scrape/scrape';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('スクレイピング開始です');
  await scrape();
  return NextResponse.json({ message: 'スクレイピング完了しました！' });
}
