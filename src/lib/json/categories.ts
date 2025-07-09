// 型定義

export interface CategoryItem {
  value: string;
  name: string;
}

interface ChildCategory {
  name: string;
  items: CategoryItem[];
}

interface Subcategory {
  name: string;
  children: Record<string, ChildCategory>;
}

interface Category {
  name: string;
  subcategories: Record<string, Subcategory>;
}

interface CategoriesData {
  [key: string]: Category;
}

// カテゴリデータ構造
export const CATEGORIES: CategoriesData = {
  '3088': {
    name: 'ファッション',
    subcategories: {
      '2': {
        name: 'メンズ',
        children: {
          '30': {
            name: 'トップス',
            items: [
              { value: '304', name: 'シャツ' },
              { value: '302', name: 'Tシャツ' },
              { value: '305', name: 'ポロシャツ' },
              { value: '303', name: '7分・長袖カットソー' },
            ],
          },
          '31': {
            name: 'ジャケット',
            items: [],
          },
          '32': {
            name: 'パンツ',
            items: [],
          },
          '33': {
            name: '靴',
            items: [],
          },
          '38': {
            name: '小物',
            items: [],
          },
          '34': {
            name: 'バッグ',
            items: [],
          },
          '36': {
            name: '帽子',
            items: [],
          },
          '37': {
            name: 'アクセサリー',
            items: [],
          },
        },
      },
      '1': {
        name: 'レディース',
        children: {},
      },
    },
  },
  '3': {
    name: 'ベビー・キッズ',
    subcategories: {},
  },
  '1328': {
    name: 'ゲーム・おもちゃ・グッズ',
    subcategories: {},
  },
};
