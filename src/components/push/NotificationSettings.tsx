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

  const isIOS = () => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window)
    );
  };

  // PWAインストール状態の判定
  const isPWAInstalled = () => {
    return window.matchMedia('(display-mode: standalone)').matches;
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

        {/* iOS向けの特別な注意書き */}
        {isIOS() && (
          <div className="mt-3 p-3 bg-orange-100 border border-orange-300 rounded-md">
            <div className="flex items-center mb-2">
              <span className="text-orange-600 mr-2">⚠️</span>
              <span className="font-semibold text-orange-800">
                iPhone/iPadをご利用の方へ
              </span>
            </div>
            <p className="text-orange-700 text-sm leading-relaxed">
              <strong>必ず「ホーム画面に追加」を行ってください。</strong>
              <br />
              Safari のメニューから「ホーム画面に追加」を選択することで、
              プッシュ通知を受け取ることができるようになります。
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 my-10 mx-4 bg-white border border-gray-200 rounded">
      <h3 className="font-semibold text-gray-800 mb-2">プッシュ通知設定</h3>
      <p className="text-gray-600 text-sm mb-4">
        新しい商品が見つかった時に通知を受け取ることができます。
      </p>

      {/* iOS向けの重要な注意書き */}
      {isIOS() && !isPWAInstalled() && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-red-600 mr-2 text-lg">🚨</span>
            <span className="font-bold text-red-800">
              重要：iPhone/iPadをご利用の方
            </span>
          </div>
          <div className="text-red-700 text-sm space-y-2">
            <p className="font-semibold">
              通知を受け取るには「ホーム画面に追加」が必須です
            </p>
            <div className="pl-4 border-l-2 border-red-300">
              <p>1. Safariの下部メニューの「共有」ボタンをタップ</p>
              <p>2. 「ホーム画面に追加」を選択</p>
              <p>3. 「追加」をタップして完了</p>
            </div>
            <p className="text-xs text-red-600">
              ※ ホーム画面に追加しないと通知機能は動作しません
            </p>
          </div>
        </div>
      )}

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
