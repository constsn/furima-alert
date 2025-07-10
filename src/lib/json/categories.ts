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
              { value: '308', name: 'パーカー' },
              { value: '310', name: 'トレーナー・スウェット' },
              { value: '307', name: 'ニット・セーター' },
              { value: '309', name: 'カーディガン' },
              { value: '311', name: 'ジャージ' },
              { value: '312', name: 'ベスト' },
              { value: '306', name: 'タンクトップ' },
              { value: '313', name: 'その他' },
            ],
          },
          '31': {
            name: 'ジャケット',
            items: [
              { value: '317', name: 'レザージャケット・ライダース' },
              { value: '318', name: 'ダウンジャケット' },
              { value: '330', name: 'ジャンパー・ブルゾン' },
              { value: '321', name: 'ナイロンジャケット' },
              { value: '332', name: 'マウンテンパーカー' },
              { value: '314', name: 'テーラードジャケット' },
              { value: '316', name: 'Gジャン・デニムジャケット' },
              { value: '320', name: 'ミリタリージャケット' },
              { value: '328', name: 'スタジャン' },
              { value: '334', name: 'ダウンベスト・キルティングベスト' },
              { value: '325', name: 'ステンカラーコート' },
              { value: '322', name: 'MA-1・フライトジャケット' },
              { value: '1140', name: 'チェスターコート' },
              { value: '329', name: 'スカジャン' },
              { value: '326', name: 'トレンチコート' },
              { value: '327', name: 'モッズコート' },
              { value: '333', name: 'カバーオール' },
              { value: '324', name: 'ピーコート・ウールコート' },
              { value: '323', name: 'ダッフルコート' },
              { value: '315', name: 'ノーカラージャケット' },
              { value: '1722', name: 'キルティングジャケット' },
              { value: '1697', name: 'フリースジャケット・ボアジャケット' },
              { value: '335', name: 'その他' },
            ],
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
