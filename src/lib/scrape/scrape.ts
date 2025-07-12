import { prisma } from '@/lib/db/prisma';
import type { Item } from '@/types/item';
import { buildSearchUrl } from './searchUrl';
import { handleNewItems } from '../notify/handle-newItems';
import { checkMemoryUsage } from '../utils/check-memory';
import { getRandomUserAgent } from '../utils/userAgent';
import { getRandomViewport } from '../utils/viewport';
import { chunkArray } from '../utils/chunkArray';
import { Cluster } from 'puppeteer-cluster';
import { naturalDelay } from '../utils/delay';
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
      maxConcurrency: 1,
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
          '--disable-accelerated-2d-canvas',
          '--disable-web-security',
          '--disable-features=IsolateOrigins',
          '--disable-site-isolation-trials',
        ],
      },
      timeout: 120000,
      retryLimit: 0,
      retryDelay: 5000,
    });

    // タスク定義
    await cluster.task(async ({ page, data }) => {
      const { url, userId, conditionId } = data;
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries) {
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

          await naturalDelay(1000, 4000);
          // 1000,3000

          await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 90000,
          });

          // ページが正常に読み込まれたか確認
          await page.waitForSelector('body', { timeout: 10000 });

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

                const match = title.match(/[\d,]+円/);

                const price = match ? match[0] : '???';

                list.push({
                  id,
                  title,
                  price,
                  url: `https://jp.mercari.com${href}`,
                });
              });

            return list;
          });

          if (items.length === 0) {
            const htmlSnippet = await page.content();
            console.error(`❗ DOM構造変更の可能性があります — items.length = 0
          URL: ${url}
          ConditionId: ${conditionId}
          サンプルHTML (先頭1000文字): ${htmlSnippet.substring(0, 1000)}
          `);
            throw new Error('DOM structure may have changed — no items found');
          }

          console.log(
            `📦 抽出したアイテム数: ${items.length} 🔗メルカリ条件ページ: ${url} conditionId: ${conditionId}  `
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
          break; // 成功したらループを抜ける
        } catch (error) {
          retryCount++;
          const errorMessage =
            error instanceof Error ? error.message : String(error);

          if (
            errorMessage.includes('Target closed') ||
            errorMessage.includes('Session closed')
          ) {
            console.log(
              `⚠️ ページがクローズされました。リトライ ${retryCount}/${maxRetries}...`
            );
            if (retryCount <= maxRetries) {
              await naturalDelay(3000, 5000);
              continue;
            }
          }

          stats.errors++;
          console.error(
            `❌スクレイピングエラー - User: ${userId}, - URL: ${url}, - Condition: ${conditionId} - Retry: ${retryCount}/${maxRetries}❌`,
            error
          );

          if (retryCount > maxRetries) {
            break;
          }
        }
      }
    });

    const data = await prisma.condition.findMany({});
    const conditions: Condition[] = data.map(c => ({
      ...c,
      conditionStatusIds: c.conditionStatusIds as string[] | null,
      itemCategoryIds: c.itemCategoryIds as string[] | null,
      brandId: c.brandId as number[] | null,
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

      if (batch !== conditionBatches[conditionBatches.length - 1]) {
        await naturalDelay(5000, 8000);
      }
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
