self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();

    const match = data.title.match(/(\d+円)$/);
    const price = match ? match[1] : '価格情報なし';

    const options = {
      body: price,
      icon: '/icon-192x192.png', // アプリのアイコン
      badge: '/badge-72x72.png', // 通知バッジ
      data: {
        url: data.url, // サーバーから送った URL
      },
      requireInteraction: true, // ユーザーが操作するまで表示し続ける
      vibrate: [200, 100, 200], // バイブレーション パターン
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// 通知クリック時の処理
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = event.notification.data.url || '/';
  event.waitUntil(clients.openWindow(url));
});
