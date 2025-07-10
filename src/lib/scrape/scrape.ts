import { prisma } from '@/lib/db/prisma';
import type { Item } from '@/types/item';
import { buildSearchUrl } from './searchUrl';
import { handleNewItems } from '../notify/handle-newItems';
import { checkMemoryUsage } from '../utils/check-memory';
import { getRandomUserAgent } from './userAgent';
import { getRandomViewport } from './viewport';
import { chunkArray } from '../utils/chunkArray';
import { Cluster } from 'puppeteer-cluster';
import { naturalDelay } from './delay';
import { Condition } from '@/types/cond';

interface ProcessingStats {
  processed: number;
  errors: number;
  startTime: number;
}

export const scrape = async (): Promise<void> => {
  const stats: ProcessingStats = {
    processed: 0,
    errors: 0,
    startTime: Date.now(),
  };

  let cluster: Cluster | null = null;

  try {
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      puppeteerOptions: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--disable-images',
          '--disable-blink-features=AutomationControlled',
        ],
      },
      timeout: 90000,
    });

    // タスク定義
    await cluster.task(async ({ page, data }) => {
      const { url, userId, conditionId } = data;

      try {
        const randomUA = getRandomUserAgent();
        await page.setUserAgent(randomUA);

        const randomVT = getRandomViewport();
        await page.setViewport(randomVT);

        await page.setExtraHTTPHeaders({
          'Accept-Language': 'ja-JP,ja;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
        });

        // WebDriverプロパティを隠す
        await page.evaluateOnNewDocument(() => {
          Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
          });

          Object.defineProperty(navigator, 'plugins', {
            get: () => [
              {
                name: 'Chrome PDF Plugin',
                description: 'Portable Document Format',
              },
              { name: 'Chrome PDF Viewer', description: 'PDF Viewer' },
              { name: 'Native Client', description: 'Native Client' },
            ],
          });

          Object.defineProperty(navigator, 'languages', {
            get: () => ['ja', 'en-US', 'en'],
          });

          Object.defineProperty(navigator, 'permissions', {
            get: () => ({
              query: () => Promise.resolve({ state: 'granted' }),
            }),
          });
        });

        await naturalDelay(500, 1500);
        // 1000,3000

        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 60000,
        });

        await naturalDelay(1000, 3000);
        // 5000, 8000

        // スクロール処理
        await page.evaluate(async () => {
          await new Promise<void>(resolve => {
            let totalHeight = 0;
            const distance = 300 + Math.random() * 200;
            let attempts = 0;
            const maxAttempts = 3;

            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;

              const scrollAmount = distance * (0.8 + Math.random() * 0.4);
              window.scrollBy(0, scrollAmount);
              totalHeight += scrollAmount;

              if (totalHeight >= scrollHeight) {
                attempts++;
              } else {
                attempts = 0;
              }

              if (attempts >= maxAttempts) {
                clearInterval(timer);
                resolve();
              }
            }, 400 + Math.random() * 300);
          });
        });

        await naturalDelay(500, 1500);
        // 1000, 3000

        const items: Item[] = await page.evaluate(() => {
          const list: Item[] = [];
          document
            .querySelectorAll('li[data-testid="item-cell"]')
            .forEach(el => {
              const linkElement = el.querySelector(
                'a[data-testid="thumbnail-link"]'
              );
              const href = linkElement
                ? linkElement.getAttribute('href')
                : null;

              const imgDiv = el.querySelector('div[role="img"]');
              const id = imgDiv ? imgDiv.getAttribute('id') : null;
              const title = imgDiv ? imgDiv.getAttribute('aria-label') : null;

              if (!href || !id || !title) return;
              list.push({ id, title, url: `https://jp.mercari.com${href}` });
            });

          return list;
        });

        console.log(
          `📦 抽出したアイテム数: ${items.length} conditionId: ${conditionId} 🔗url: ${url} `
        );

        await handleNewItems(userId, conditionId, items);
        stats.processed++;

        // 定期的に進捗をログ出力
        if (stats.processed % 10 === 0) {
          const elapsed = Date.now() - stats.startTime;
          const rate = stats.processed / (elapsed / 1000);
          console.log(
            `Progress: ${stats.processed} processed, ${
              stats.errors
            } errors, ${rate.toFixed(2)}/sec `
          );
          checkMemoryUsage();
        }
      } catch (error) {
        stats.errors++;
        console.error(
          `❌スクレイピングエラー - User: ${userId}, - URL: ${url}, - Condition: ${conditionId}❌`,
          error
        );
      }
    });

    const data = await prisma.condition.findMany({});
    const conditions: Condition[] = data.map(c => ({
      ...c,
      conditionStatusIds: c.conditionStatusIds as string[] | null,
      itemCategoryIds: c.itemCategoryIds as string[] | null,
    }));
    const CONDITION_BATCH_SIZE = 5;
    const conditionBatches = chunkArray(conditions, CONDITION_BATCH_SIZE);

    for (const batch of conditionBatches) {
      const promises = batch.map(async cond => {
        const url = buildSearchUrl(cond);
        await cluster!.queue({
          url,
          userId: cond.userId,
          conditionId: cond.id,
        });
      });

      await Promise.allSettled(promises);
    }

    await cluster.idle();

    // 最終統計出力
    const elapsed = Date.now() - stats.startTime;
    const rate = stats.processed / (elapsed / 1000);
    console.log(`\n=== 処理完了 ===`);
    console.log(`処理件数: ${stats.processed}`);
    console.log(`エラー件数: ${stats.errors}`);
    console.log(`処理時間: ${Math.round(elapsed / 1000)}秒`);
    console.log(`処理速度: ${rate.toFixed(2)}件/秒`);

    checkMemoryUsage();
  } catch (error) {
    console.error('スクレイピング処理で致命的エラー:', error);
    throw error;
  } finally {
    if (cluster) {
      await cluster.close();
    }
  }
};

{
  /*for (const batch of conditionBatches) {
      for (const condition of batch) {
        const url = buildSearchUrl(condition);
        await cluster!.queue({
          url,
          userId: condition.userId,
          conditionId: condition.id,
        });
      }
      // バッチ間で少し待機
      if (conditionBatches.length > 1) {
        await naturalDelay(8000, 15000);
      }
    } */
}

{
  /* export const scrape = async (): Promise<void> => {
  const stats: ProcessingStats = {
    processed: 0,
    errors: 0,
    startTime: Date.now(),
  };

  let cluster: Cluster | null = null;

  try {
    const maxConcurrency = 1;

    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency,
      puppeteerOptions: {
        headless: true,
        args: [
          '--proxy-server=http://us-ca.proxymesh.com:31280',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--disable-images',
          '--disable-blink-features=AutomationControlled',
        ],
      },
      timeout: 60000,
    });

    // 10. エラーハンドリング付きタスク定義
    await cluster.task(async ({ page, data }) => {
      const { url, userId, conditionId } = data;

      try {
        // ✅ プロキシ認証を追加
        await page.authenticate({
          username: 'siyutein',
          password: 'Shuto324',
        });

        const randomUA = getRandomUserAgent();
        await page.setUserAgent(randomUA);

        const randomVT = getRandomViewport();
        await page.setViewport(randomVT);

        await page.setExtraHTTPHeaders({
          'Accept-Language': 'ja-JP,ja;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
        });

        // WebDriverプロパティを隠す
        await page.evaluateOnNewDocument(() => {
          // navigator.webdriver を削除
          Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
          });

          // プラグインの偽装
          Object.defineProperty(navigator, 'plugins', {
            get: () => [
              {
                name: 'Chrome PDF Plugin',
                description: 'Portable Document Format',
              },
              { name: 'Chrome PDF Viewer', description: 'PDF Viewer' },
              { name: 'Native Client', description: 'Native Client' },
            ],
          });
          // 言語設定の偽装
          Object.defineProperty(navigator, 'languages', {
            get: () => ['ja', 'en-US', 'en'],
          });

          // Chrome固有のプロパティを追加
          Object.defineProperty(navigator, 'permissions', {
            get: () => ({
              query: () => Promise.resolve({ state: 'granted' }),
            }),
          });
        });

        // 接続前の遅延（より長く）
        await naturalDelay(3000, 7000);

        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 60000,
        });

        // 🔧 修正3: メルカリ特有の要素が読み込まれるまで待機
        try {
          await page.waitForSelector('li[data-testid="item-cell"]', {
            timeout: 20000,
            visible: true,
          });
          console.log(`✅ アイテム要素の読み込み確認`);
        } catch (error) {
          console.log(`⚠️ アイテム要素が見つかりません、追加で待機...`);
          await naturalDelay(10000, 15000);
        }

        // ページ読み込み後の待機
        await naturalDelay(2000, 5000);

        // 11. スクロール処理の最適化
        await page.evaluate(async () => {
          await new Promise<void>(resolve => {
            let totalHeight = 0;
            const distance = 300 + Math.random() * 200;
            let attempts = 0;
            const maxAttempts = 4;

            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;

              const scrollAmount = distance * (0.8 + Math.random() * 0.4);
              window.scrollBy(0, scrollAmount);
              totalHeight += scrollAmount;

              if (totalHeight >= scrollHeight) {
                attempts++;
              } else {
                attempts = 0;
              }

              if (attempts >= maxAttempts) {
                clearInterval(timer);
                resolve();
              }
            }, 400 + Math.random() * 300); // ランダムな間隔
          });
        });

        // 最終的な遅延
        await naturalDelay(1000, 3000);

        const items: Item[] = await page.evaluate(() => {
          const list: Item[] = [];
          document
            .querySelectorAll('li[data-testid="item-cell"]')
            .forEach(el => {
              const linkElement = el.querySelector(
                'a[data-testid="thumbnail-link"]'
              );
              const href = linkElement
                ? linkElement.getAttribute('href')
                : null;

              const imgDiv = el.querySelector('div[role="img"]');
              const id = imgDiv ? imgDiv.getAttribute('id') : null;
              const title = imgDiv ? imgDiv.getAttribute('aria-label') : null;

              if (!href || !id || !title) return;
              list.push({ id, title, url: `https://jp.mercari.com${href}` });
            });

          return list;
        });

        console.log(
          `📦 抽出したアイテム数: ${items.length} conditionId: ${conditionId} 🔗url: ${url} 🌐プロキシ: us-ca.proxymesh.com (IP: 45.32.71.203)`
        );

        await handleNewItems(userId, conditionId, items);
        stats.processed++;

        // 定期的に進捗をログ出力
        if (stats.processed % 10 === 0) {
          const elapsed = Date.now() - stats.startTime;
          const rate = stats.processed / (elapsed / 1000);
          console.log(
            `Progress: ${stats.processed} processed, ${
              stats.errors
            } errors, ${rate.toFixed(2)}/sec`
          );
          checkMemoryUsage();
        }
      } catch (error) {
        stats.errors++;
        console.error(
          `❌スクレイピングエラー - User: ${userId}, - URL: ${url}, - Condition: ${conditionId}❌`,
          error
        );
      }
    });

    // 今後はアクティブな条件のみ取得
    const conditions = await prisma.condition.findMany({});

    const CONDITION_BATCH_SIZE = 5;
    const conditionBatches = chunkArray(conditions, CONDITION_BATCH_SIZE);

    for (const batch of conditionBatches) {
      for (const condition of batch) {
        const url = buildSearchUrl(condition);
        await cluster!.queue({
          url,
          userId: condition.userId,
          conditionId: condition.id,
        });
      }
      // バッチ間で少し待機（負荷分散）
      if (conditionBatches.length > 1) {
        await naturalDelay(8000, 15000);
      }
    }

    await cluster.idle();

    // 13. 最終統計出力
    const elapsed = Date.now() - stats.startTime;
    const rate = stats.processed / (elapsed / 1000);
    console.log(`\n=== 処理完了 ===`);
    console.log(`処理件数: ${stats.processed}`);
    console.log(`エラー件数: ${stats.errors}`);
    console.log(`処理時間: ${Math.round(elapsed / 1000)}秒`);
    console.log(`処理速度: ${rate.toFixed(2)}件/秒`);
    console.log(`🌐 プロキシ: us-ca.proxymesh.com (認証済み) 使用`); // ✅ 追加

    checkMemoryUsage();
  } catch (error) {
    console.error('スクレイピング処理で致命的エラー:', error);
    throw error;
  } finally {
    if (cluster) {
      await cluster.close();
    }
  }
};*/
}

{
  /* // あなたの認証情報
const PROXY_AUTH = {
  username: 'siyutein',
  password: 'Shuto324',
};

// 利用可能なプロキシリスト
const PROXY_SERVERS = [
  'us-ca.proxymesh.com:31280', // 10並行接続
  'open.proxymesh.com:31280', // 88並行接続
  'world.proxymesh.com:31280', // 21458並行接続（最強）
];

// テスト1: パスワード認証でプロキシテスト
export const testWithPassword = async () => {
  console.log('🧪 パスワード認証テスト開始...');
  console.log(`👤 ユーザー: ${PROXY_AUTH.username}`);
  console.log(`🔑 パスワード: ${PROXY_AUTH.password}`);

  for (const proxy of PROXY_SERVERS) {
    console.log(`\n🔍 ${proxy} をテスト中...`);

    const browser = await puppeteer.launch({
      headless: false, // ブラウザを表示して確認
      args: [`--proxy-server=http://${proxy}`, '--no-sandbox'],
    });

    const page = await browser.newPage();

    try {
      // プロキシ認証設定
      await page.authenticate({
        username: PROXY_AUTH.username,
        password: PROXY_AUTH.password,
      });

      console.log('📍 プロキシ経由でIP確認中...');
      await page.goto('https://httpbin.org/ip', { timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 3000));

      const ipData = await page.evaluate(() => {
        return JSON.parse(document.body.textContent);
      });

      const proxyIP = ipData.origin;
      console.log(`✅ ${proxy} 認証成功!`);
      console.log(`🌐 プロキシIP: ${proxyIP}`);

      // メルカリアクセステスト
      console.log('🛒 メルカリアクセステスト...');
      await page.goto('https://jp.mercari.com/', { timeout: 30000 });
      const title = await page.title();
      console.log(`✅ メルカリアクセス成功: ${title}`);

      await browser.close();

      console.log(`\n🎉 ${proxy} が正常に動作しています！`);
      return {
        proxy,
        ip: proxyIP,
        working: true,
      };
    } catch (error) {
      const err = error as Error;
      console.log(`❌ ${proxy} 失敗: ${err.message.substring(0, 100)}...`);
      await browser.close();

      if (err.message.includes('ERR_INVALID_AUTH_CREDENTIALS')) {
        console.log(
          '💡 認証エラー: ユーザー名またはパスワードが間違っている可能性'
        );
      } else if (err.message.includes('timeout')) {
        console.log('💡 タイムアウト: ネットワーク接続を確認してください');
      }

      continue;
    }
  }

  console.log('\n❌ すべてのプロキシが失敗しました');
  return null;
};
*/
}
