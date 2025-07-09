'use client';

import { PushNotificationManager } from '@/lib/notify/push-client';
import { useEffect, useState } from 'react';

const NotificationSettings = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pushManager] = useState(new PushNotificationManager());

  useEffect(() => {
    checkNotificationSupport();
  }, []);

  // 🔥 詳細なデバッグ情報追加
  const checkDetailedSupport = () => {
    console.log('=== iOS Push Notification Debug ===');
    console.log('User Agent:', navigator.userAgent);
    console.log('Service Worker:', 'serviceWorker' in navigator);
    console.log('PushManager:', 'PushManager' in window);
    console.log('Notification:', 'Notification' in window);

    // 重要：スタンドアロンモードの確認
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;
    const isNavigatorStandalone = (window.navigator as any).standalone;

    console.log('Display Mode Standalone:', isStandalone);
    console.log('Navigator Standalone:', isNavigatorStandalone);
    console.log('Final Standalone:', isStandalone || isNavigatorStandalone);

    // Push API の実際の存在確認
    try {
      const hasRealPushAPI =
        'PushManager' in window && 'subscribe' in PushManager.prototype;
      console.log('Real Push API:', hasRealPushAPI);
    } catch (e) {
      console.log('Push API Error:', e);
    }

    console.log('=== End Debug ===');
  };

  const checkNotificationSupport = async () => {
    try {
      // 🔥 デバッグ情報を出力
      checkDetailedSupport();

      // 基本的なサポート確認
      const hasServiceWorker = 'serviceWorker' in navigator;
      const hasPushManager = 'PushManager' in window;
      const hasNotification = 'Notification' in window;

      if (!hasServiceWorker || !hasPushManager || !hasNotification) {
        console.log('Basic support missing');
        setIsSupported(false);
        return;
      }

      // 🔥 iOS の場合のスタンドアロンモード確認
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isIOS) {
        const isStandalone = window.matchMedia(
          '(display-mode: standalone)'
        ).matches;
        const isNavigatorStandalone = (window.navigator as any).standalone;
        const isInStandaloneMode = isStandalone || isNavigatorStandalone;

        if (!isInStandaloneMode) {
          console.log('iOS detected but not in standalone mode');
          setIsSupported(false);
          return;
        }
      }

      // ここまで来たら対応している
      setIsSupported(true);
      await pushManager.initialize();
      const subscribed = await pushManager.isSubscribed();
      setIsSubscribed(subscribed);
    } catch (error) {
      console.error('Error checking notification support:', error);
      setIsSupported(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);

      // 通知許可をリクエスト
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);

      if (permission === 'granted') {
        await pushManager.subscribe();
        setIsSubscribed(true);

        // 🔥 テスト通知を送信
        if ('Notification' in window) {
          new Notification('フリマ通知', {
            body: 'プッシュ通知が有効になりました！',
            icon: '/icon-192x192.png',
          });
        }
      } else {
        alert('通知を有効にするには、ブラウザで通知を許可してください。');
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      alert('通知の設定に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setIsLoading(true);
      await pushManager.unsubscribe();
      setIsSubscribed(false);
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      alert('通知の解除に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 iOS対応の詳細なエラーメッセージ
  if (!isSupported) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;
    const isNavigatorStandalone = (window.navigator as any).standalone;
    const isInStandaloneMode = isStandalone || isNavigatorStandalone;

    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">
          📱 プッシュ通知を有効にする方法
        </h3>

        {isIOS && !isInStandaloneMode ? (
          <div className="text-yellow-700 text-sm space-y-3">
            <p className="font-medium">
              iOSでプッシュ通知を使用するには以下の手順が必要です：
            </p>

            <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Safariで<strong>「共有」ボタン（□↑）</strong>をタップ
                </li>
                <li>
                  <strong>「ホーム画面に追加」</strong>をタップ
                </li>
                <li>
                  <strong>「追加」</strong>をタップしてアプリを作成
                </li>
                <li>
                  <strong>ホーム画面からアプリを起動</strong>（重要！）
                </li>
                <li>アプリ内で通知設定を行う</li>
              </ol>
            </div>

            <div className="text-xs text-yellow-600 mt-2">
              <p>
                ⚠️
                重要：Safariブラウザからではなく、ホーム画面のアプリから開く必要があります
              </p>
              <p>📱 iOS 16.4以降が必要です</p>
            </div>

            {/* 🔥 デバッグ情報を表示 */}
            <details className="mt-2">
              <summary className="cursor-pointer text-xs">
                技術情報を表示
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                Service Worker: {'serviceWorker' in navigator ? '✓' : '✗'}
                {'\n'}
                PushManager: {'PushManager' in window ? '✓' : '✗'}
                {'\n'}
                Notification: {'Notification' in window ? '✓' : '✗'}
                {'\n'}
                iOS: {isIOS ? '✓' : '✗'}
                {'\n'}
                Standalone: {isInStandaloneMode ? '✓' : '✗'}
                {'\n'}
                Display Mode:{' '}
                {window.matchMedia('(display-mode: standalone)').matches
                  ? 'standalone'
                  : 'browser'}
                {'\n'}
                Navigator Standalone: {isNavigatorStandalone ? '✓' : '✗'}
              </pre>
            </details>
          </div>
        ) : (
          <p className="text-yellow-700 text-sm">
            お使いのブラウザではプッシュ通知がサポートされていません。
            <br />
            Chrome、Firefox、Safari（iOS
            16.4以降）などの最新ブラウザをお使いください。
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 my-4 mx-4 bg-white border border-gray-200 rounded">
      <h3 className="font-semibold text-gray-800 mb-2">プッシュ通知設定</h3>
      <p className="text-gray-600 text-sm mb-4">
        新しい商品が見つかった時に通知を受け取ることができます。
      </p>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              isSubscribed ? 'bg-green-500' : 'bg-gray-300'
            }`}
          ></div>
          <span className="text-sm text-gray-700">
            {isSubscribed ? '通知が有効です' : '通知が無効です'}
          </span>
        </div>
        <button
          onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isSubscribed
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading
            ? '処理中...'
            : isSubscribed
            ? '通知を無効にする'
            : '通知を有効にする'}
        </button>
      </div>
      {Notification.permission === 'denied' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">
            通知が拒否されています。ブラウザの設定で通知を許可してください。
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;

{
  /* 'use client';

import { PushNotificationManager } from '@/lib/notify/push-client';
import { useEffect, useState } from 'react';

const NotificationSettings = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pushManager] = useState(new PushNotificationManager());

  useEffect(() => {
    checkNotificationSupport();
  }, []);

  const checkNotificationSupport = async () => {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        setIsSupported(true);
        await pushManager.initialize();
        const subscribed = await pushManager.isSubscribed();
        setIsSubscribed(subscribed);
      } else {
        setIsSupported(false);
      }
    } catch (error) {
      console.error('Error checking notification support:', error);
      setIsSupported(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);

      // 通知許可をリクエスト
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        await pushManager.subscribe();
        setIsSubscribed(true);
      } else {
        alert('通知を有効にするには、ブラウザで通知を許可してください。');
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      alert('通知の設定に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setIsLoading(true);
      await pushManager.unsubscribe();
      setIsSubscribed(false);
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      alert('通知の解除に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">通知機能について</h3>
        <p className="text-yellow-700 text-sm">
          お使いのブラウザではプッシュ通知がサポートされていません。
          Chrome、Firefox、Safari（iOS
          16.4以降）などの最新ブラウザをお使いください。
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 my-4 mx-4 bg-white border border-gray-200 rounded">
      <h3 className="font-semibold text-gray-800 mb-2">プッシュ通知設定</h3>
      <p className="text-gray-600 text-sm mb-4">
        新しい商品が見つかった時に通知を受け取ることができます。
      </p>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              isSubscribed ? 'bg-green-500' : 'bg-gray-300'
            }`}
          ></div>
          <span className="text-sm text-gray-700">
            {isSubscribed ? '通知が有効です' : '通知が無効です'}
          </span>
        </div>
        <button
          onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isSubscribed
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gray-900 hover:bg-gray-500 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading
            ? '処理中...'
            : isSubscribed
            ? '通知を無効にする'
            : '通知を有効にする'}
        </button>
      </div>
      {Notification.permission === 'denied' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">
            通知が拒否されています。ブラウザの設定で通知を許可してください。
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
 */
}
