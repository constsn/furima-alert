'use client';

import { useActionState, useState } from 'react';
import { authenticate } from '@/lib/actions/authenticate';
import { ArrowLeft, Bell, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

const LoginForm = () => {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <header className="bg-white shadow-sm border-b border-red-100">
        <div className="px-4 py-3">
          <div className="flex items-center">
            <button className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Link href="/">
                <ArrowLeft className="w-6 h-6" />
              </Link>
            </button>
            <h1 className="flex-1 text-center text-xl font-bold text-gray-900 pr-10">
              ログイン
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-6">
              <Bell className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              おかえりなさい
            </h2>
            <p className="text-gray-600 text-sm">
              フリマ通知にログインして
              <br />
              条件をチェックしましょう
            </p>
          </div>

          <div className="space-y-6">
            <form action={formAction}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors 
                    border-gray-300
                  `}
                    placeholder="example@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors 
                   border-gray-300
                  `}
                    placeholder="パスワードを入力"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex h-8 items-end space-x-1">
                {errorMessage && (
                  <div className=" text-red-500">
                    <p className="text-sm text-red-500">{errorMessage}</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isPending
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                }`}
              >
                {isPending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>ログイン中...</span>
                  </div>
                ) : (
                  'ログイン'
                )}
              </button>
            </form>
            <div className="text-center pt-6">
              <p className="text-gray-600 text-sm mb-4">
                まだアカウントをお持ちでない場合
              </p>
              <button className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                <Link href="/register">新規アカウント作成</Link>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              ログインすることで、
              <span className="text-red-600 underline cursor-pointer">
                利用規約
              </span>
              および
              <span className="text-red-600 underline cursor-pointer">
                プライバシーポリシー
              </span>
              に同意したものとみなされます。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginForm;
