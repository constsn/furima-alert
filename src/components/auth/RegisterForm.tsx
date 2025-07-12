'use client';

import { useActionState, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { createUser } from '@/lib/actions/createUser';
import Link from 'next/link';

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(createUser, {
    success: false,
    errors: {},
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
              新規登録
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              アカウントを作成
            </h2>
            <p className="text-gray-600 text-sm">
              フリマ通知を使い始めましょう
            </p>
          </div>
          <form action={formAction} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                お名前
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors border-gray-300`}
                  placeholder="田中太郎"
                />
              </div>
              {state?.errors?.name && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.name.join(',')}
                </p>
              )}
            </div>

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
                />
              </div>
              {state?.errors?.email && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.email.join(',')}
                </p>
              )}
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
                  placeholder="8文字以上で入力"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {state?.errors?.password && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.password.join(',')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パスワード確認
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors border-gray-300"
                  placeholder="もう一度入力してください"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {state?.errors?.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.confirmPassword.join(',')}
                </p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-xs leading-relaxed">
                アカウントを作成することで、
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

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isPending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>登録中...</span>
                </div>
              ) : (
                '新規登録'
              )}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-600 text-sm">
                すでにアカウントをお持ちですか？
                <button className="text-red-500 font-medium ml-1 hover:text-red-600 transition-colors">
                  <Link href="/login">ログイン</Link>
                </button>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterForm;
