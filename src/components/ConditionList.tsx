'use client';

import type { Condition } from '@/types/cond';
import { useEffect, useState } from 'react';
import DeleteCondDialog from './DeleteCondDialog';
import ConditionForm, { ITEM_CONDITIONS } from './ConditionForm';
import { CATEGORIES } from '@/lib/json/categories';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const ConditionList = ({ userId }: { userId: string }) => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(false);

  const getItemCategoryNames = (condition: Condition) => {
    if (!condition.itemCategoryIds || condition.itemCategoryIds.length === 0) {
      return null;
    }

    // categoryId, subcategoryId, childCategoryIdが存在する場合のみ処理
    if (
      !condition.categoryId ||
      !condition.subcategoryId ||
      !condition.childCategoryId
    ) {
      return null;
    }

    try {
      const items =
        CATEGORIES[condition.categoryId]?.subcategories[condition.subcategoryId]
          ?.children[condition.childCategoryId]?.items;

      if (!items) return null;

      // 選択されたアイテムIDに対応する名前を取得
      const selectedItemNames = condition.itemCategoryIds
        .map((id: string) => {
          const item = items.find(item => item.value === id);
          return item?.name;
        })
        .filter(Boolean); // undefinedを除外

      return selectedItemNames.length > 0 ? selectedItemNames : null;
    } catch (error) {
      console.error('Error getting item names:', error);
      return null;
    }
  };

  const fetchConditions = async () => {
    setLoading(true);

    try {
      const res = await fetch(`api/conditions/top/${userId}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log(data);
      setConditions(data);
    } catch (err) {
      console.error('条件の取得に失敗しました:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConditions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen ">
        <div className="px-4 py-6 sm:px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-red-100 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">条件を読み込み中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              保存済み条件
            </h2>
            <p className="text-sm text-gray-600">
              {conditions.length > 0
                ? `${conditions.length}件の条件が保存されています`
                : '保存された条件はありません'}
            </p>
          </div>

          {conditions.length === 0 ? (
            <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">
                まだ条件が保存されていません
              </p>
              <p className="text-gray-400 text-xs mt-1">
                下のフォームから条件を追加してください
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {conditions.map(cond => (
                <div
                  key={cond.id}
                  className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {cond.keyword && (
                          <div className="mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ">
                              {cond.keyword}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(cond.createdAt), 'yyyy年M月d日', {
                            locale: ja,
                          })}
                        </div>
                      </div>

                      <div className="ml-2 flex-shrink-0">
                        <DeleteCondDialog
                          conditionId={cond.id}
                          onDeleted={fetchConditions}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {cond.categoryId && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          カテゴリ
                        </div>
                        <div className="text-sm text-gray-700">
                          <div className="flex flex-wrap items-center gap-1 text-xs">
                            {CATEGORIES[cond.categoryId]?.name && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {CATEGORIES[cond.categoryId].name}
                              </span>
                            )}
                            {cond.categoryId &&
                              cond.subcategoryId &&
                              CATEGORIES[cond.categoryId]?.subcategories[
                                cond.subcategoryId
                              ]?.name && (
                                <>
                                  <span className="text-gray-400">→</span>
                                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {
                                      CATEGORIES[cond.categoryId].subcategories[
                                        cond.subcategoryId
                                      ].name
                                    }
                                  </span>
                                </>
                              )}
                            {cond.categoryId &&
                              cond.subcategoryId &&
                              cond.childCategoryId &&
                              CATEGORIES[cond.categoryId]?.subcategories[
                                cond.subcategoryId
                              ]?.children[cond.childCategoryId]?.name && (
                                <>
                                  <span className="text-gray-400">→</span>
                                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {
                                      CATEGORIES[cond.categoryId].subcategories[
                                        cond.subcategoryId
                                      ].children[cond.childCategoryId].name
                                    }
                                  </span>
                                </>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                    {(() => {
                      const itemNames = getItemCategoryNames(cond);
                      if (itemNames && itemNames.length > 0) {
                        return (
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-2">
                              選択アイテム
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {itemNames.map((name, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                                >
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {cond.conditionStatusIds &&
                      cond.conditionStatusIds.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-2">
                            商品状態
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {cond.conditionStatusIds.map((id, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                              >
                                {ITEM_CONDITIONS[Number(id) - 1]?.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {(cond.priceMin || cond.priceMax) && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-2">
                          価格範囲
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-700">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-yellow-50 text-yellow-800 border border-yellow-200">
                            💰{' '}
                            {cond.priceMin
                              ? `¥${cond.priceMin.toLocaleString()}`
                              : '下限なし'}
                            〜
                            {cond.priceMax
                              ? `¥${cond.priceMax.toLocaleString()}`
                              : '上限なし'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ConditionForm refetch={fetchConditions} />
    </div>
  );
};

export default ConditionList;
