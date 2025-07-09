import Header from '@/components/Header';
import { Search, Smartphone, Settings } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            欲しい商品を見逃さない
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            メルカリで探している商品の条件を登録して、
            <br />
            新しく出品されたらすぐに通知を受け取りましょう
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-red-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">条件を登録</h3>
                <p className="text-sm text-gray-600">
                  商品名、価格帯、カテゴリなど詳細な条件を設定できます
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-red-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">通知をON</h3>
                <p className="text-sm text-gray-600">
                  条件に合う商品が出品されたら即座にプッシュ通知でお知らせ
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-red-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Smartphone className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  ホーム画面に追加
                </h3>
                <p className="text-sm text-gray-600">
                  「ホーム画面に追加」でスマートフォンでも通知が届きます
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Settings className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">
                ホーム画面に追加する方法
              </h3>
              <div className="text-sm text-amber-700 space-y-1">
                <div>• Safari: 共有ボタン → 「ホーム画面に追加」</div>
                <div>• Chrome: メニュー → 「ホーム画面に追加」</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="px-4 py-6 space-y-3 bg-white border-t border-gray-100">
        <button className="w-full bg-red-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors shadow-lg">
          <Link href="/register">新規登録 </Link>
        </button>
        <button className="w-full bg-white text-red-500 py-4 rounded-lg font-semibold text-lg border-2 border-red-500 hover:bg-red-50 transition-colors">
          <Link href="/login">ログイン </Link>
        </button>
        <p className="text-xs text-gray-500 text-center pt-2">
          アカウントを作成することで、利用規約とプライバシーポリシーに同意したものとみなされます
        </p>
      </div>
    </div>
  );
}
