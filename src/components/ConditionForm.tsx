'use client';

import { CATEGORIES, CategoryItem } from '@/lib/json/categories';
import { useState } from 'react';
import { DynamicSelect } from './DynamicSelect';

export const ITEM_CONDITIONS = [
  { id: '1', label: '新品、未使用' },
  { id: '2', label: '未使用に近い' },
  { id: '3', label: '目立った傷や汚れなし' },
  { id: '4', label: 'やや傷や汚れあり' },
  { id: '5', label: '傷や汚れあり' },
  { id: '6', label: '全体的に状態が悪い' },
];

const ConditionForm = ({ refetch }: { refetch: () => void }) => {
  const [categoryId, setCategoryId] = useState<string>('');
  const [subcategoryId, setSubcategoryId] = useState<string>('');
  const [childCategoryId, setChildCategoryId] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // カテゴリ選択肢を生成
  const getCategoryOptions = (): CategoryItem[] => {
    return Object.entries(CATEGORIES).map(([id, category]) => ({
      value: id,
      name: category.name,
    }));
  };

  // サブカテゴリ選択肢を生成
  const getSubcategoryOptions = (): CategoryItem[] => {
    if (!categoryId || !CATEGORIES[categoryId]) return [];

    return Object.entries(CATEGORIES[categoryId].subcategories).map(
      ([id, subcategory]) => ({
        value: id,
        name: subcategory.name,
      })
    );
  };

  // 子カテゴリ選択肢を生成
  const getChildCategoryOptions = (): CategoryItem[] => {
    if (
      !categoryId ||
      !subcategoryId ||
      !CATEGORIES[categoryId]?.subcategories[subcategoryId]
    )
      return [];

    return Object.entries(
      CATEGORIES[categoryId].subcategories[subcategoryId].children
    ).map(([id, child]) => ({
      value: id,
      name: child.name,
    }));
  };

  // 最終選択肢を生成
  const getFinalOptions = (): CategoryItem[] => {
    if (
      !categoryId ||
      !subcategoryId ||
      !childCategoryId ||
      !CATEGORIES[categoryId]?.subcategories[subcategoryId]?.children[
        childCategoryId
      ]
    )
      return [];

    return CATEGORIES[categoryId].subcategories[subcategoryId].children[
      childCategoryId
    ].items;
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
    setSubcategoryId('');
    setChildCategoryId('');
    setSelectedItems([]);
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubcategoryId(e.target.value);
    setChildCategoryId('');
    setSelectedItems([]);
  };

  const handleChildCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setChildCategoryId(e.target.value);
    setSelectedItems([]);
  };

  // アイテムのチェックボックス変更ハンドラー
  const handleItemChange = (itemValue: string) => {
    setSelectedItems(prev =>
      prev.includes(itemValue)
        ? prev.filter(item => item !== itemValue)
        : [...prev, itemValue]
    );
  };

  const handleConditionChange = (id: string) => {
    setSelectedConditions(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const finalCategoryId = childCategoryId || subcategoryId || categoryId;

      const res = await fetch('/api/conditions', {
        method: 'POST',
        body: JSON.stringify({
          keyword: formData.get('keyword'),
          categoryId,
          subcategoryId,
          childCategoryId,
          finalCategoryId,
          selectedItems,
          selectedConditions,
          priceMin: formData.get('priceMin')
            ? Number(formData.get('priceMin'))
            : null,
          priceMax: formData.get('priceMax')
            ? Number(formData.get('priceMax'))
            : null,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`条件の保存に失敗しました (${res.status})`);
      }

      alert('条件を保存しました！');
      (e.target as HTMLFormElement).reset();
      setCategoryId('');
      setSubcategoryId('');
      setChildCategoryId('');
      setSelectedItems([]);
      refetch();
    } catch (err) {
      console.error('送信エラー:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            条件を保存する
          </h2>
          <p className="text-sm text-gray-600">希望する条件を保存できます</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              キーワード
            </label>
            <input
              type="text"
              name="keyword"
              placeholder="検索キーワードを入力"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリ
                </label>
                <DynamicSelect
                  value={categoryId}
                  onChange={handleCategoryChange}
                  options={getCategoryOptions()}
                  placeholder="カテゴリを選択"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                />
              </div>

              {categoryId && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    サブカテゴリ
                  </label>
                  <DynamicSelect
                    value={subcategoryId}
                    onChange={handleSubcategoryChange}
                    options={getSubcategoryOptions()}
                    placeholder="サブカテゴリを選択"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  />
                </div>
              )}

              {subcategoryId && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    詳細カテゴリ
                  </label>
                  <DynamicSelect
                    value={childCategoryId}
                    onChange={handleChildCategoryChange}
                    options={getChildCategoryOptions()}
                    placeholder="詳細カテゴリを選択"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  />
                </div>
              )}
            </div>

            {childCategoryId && getFinalOptions().length > 0 && (
              <div className="mt-4 animate-fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  アイテム（複数選択可）
                </label>
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto">
                  <div className="space-y-3">
                    {getFinalOptions().map(item => (
                      <label
                        key={item.value}
                        className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-white transition-colors"
                      >
                        <input
                          type="checkbox"
                          value={item.value}
                          checked={selectedItems.includes(item.value)}
                          onChange={() => handleItemChange(item.value)}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700 flex-1">
                          {item.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                {selectedItems.length > 0 && (
                  <div className="mt-2 px-2 py-1 bg-blue-50 rounded text-xs text-blue-600 inline-block">
                    選択中: {selectedItems.length}件
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              商品の状態
            </label>
            <div className="space-y-3">
              {ITEM_CONDITIONS.map(cond => (
                <label
                  key={cond.id}
                  className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    value={cond.id}
                    checked={selectedConditions.includes(cond.id)}
                    onChange={() => handleConditionChange(cond.id)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {cond.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              価格範囲
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  最低価格
                </label>
                <input
                  name="priceMin"
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  最高価格
                </label>
                <input
                  name="priceMax"
                  type="number"
                  placeholder="上限なし"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="sticky bottom-4 z-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white font-medium py-4 rounded-lg transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>保存中...</span>
                </div>
              ) : (
                '保存'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConditionForm;
