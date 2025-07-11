import { scrape } from '@/lib/scrape/scrape';
import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// GitHub Actions用のPOSTエンドポイント
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // 認証チェック
  const authHeader = request.headers.get('authorization');
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedAuth) {
    console.log(
      '❌ Unauthorized cron request from:',
      request.headers.get('user-agent')
    );
    return NextResponse.json(
      {
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    );
  }

  try {
    console.log('🚀 GitHub Actions triggered scraping started');
    console.log('⏰ Start time:', new Date().toISOString());

    await scrape();

    const duration = Math.round((Date.now() - startTime) / 1000);
    const result = {
      success: true,
      message: 'スクレイピング完了しました！',
      duration: `${duration}秒`,
      timestamp: new Date().toISOString(),
      trigger: 'GitHub Actions',
    };

    console.log('✅ GitHub Actions scraping completed:', result);
    return NextResponse.json(result);
  } catch (error) {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const errorResult = {
      success: false,
      error: 'スクレイピング処理でエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}秒`,
      timestamp: new Date().toISOString(),
      trigger: 'GitHub Actions',
    };

    console.error('❌ GitHub Actions scraping failed:', errorResult);
    return NextResponse.json(errorResult, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const healthCheck = url.searchParams.get('health');

  // ?health=true の場合はヘルスチェックのみ
  if (healthCheck === 'true') {
    try {
      // データベース接続チェック
      await prisma.$queryRaw`SELECT 1`;

      return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        message: 'アプリケーションは正常に動作しています',
        endpoint: 'scrape (health check mode)',
      });
    } catch (error) {
      console.error('Health check failed:', error);
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          database: 'disconnected',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  }

  // 従来の手動スクレイピング（後方互換性のため残す）
  try {
    console.log('スクレイピング開始です（手動実行）');
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
