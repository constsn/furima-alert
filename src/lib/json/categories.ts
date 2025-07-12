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
            items: [
              { value: '336', name: 'デニム・ジーンズ' },
              {
                value: '337',
                name: 'ワークパンツ・カーゴパンツ・ペインターパンツ',
              },
              { value: '338', name: 'スラックス' },
              { value: '340', name: 'ショートパンツ・ハーフパンツ' },
              { value: '339', name: 'チノパン' },
              { value: '343', name: 'オーバーオール・つなぎ' },
              { value: '342', name: 'サルエルパンツ' },
              { value: '1724', name: 'ジョガーパンツ・スウェットパンツ' },
              { value: '10851', name: 'スキニーパンツ' },
              { value: '1723', name: 'ワイドパンツ・イージーパンツ' },
              { value: '344', name: 'その他' },
            ],
          },
          '33': {
            name: '靴',
            items: [
              { value: '347', name: 'ブーツ・革靴' },
              { value: '346', name: 'サンダル' },
              { value: '345', name: 'スニーカー' },
              { value: '1725', name: 'スリッポン' },
              { value: '350', name: '長靴・レインシューズ' },
              { value: '351', name: 'その他' },
            ],
          },
          '38': {
            name: '小物',
            items: [
              { value: '401', name: 'サングラス' },
              { value: '2128', name: 'メガネ' },
              { value: '385', name: '折り財布' },
              { value: '384', name: '長財布' },
              { value: '387', name: 'コインケース・小銭入れ' },
              { value: '1775', name: 'フラグメントケース' },
              { value: '394', name: 'ベルト' },
              { value: '391', name: 'ネクタイ' },
              { value: '390', name: 'キーホルダー・キーリング' },
              { value: '7453', name: 'パスケース・定期入れ' },
              { value: '388', name: '名刺入れ' },
              { value: '7470', name: 'カードケース' },
              { value: '389', name: 'キーケース' },
              { value: '395', name: 'マフラー' },
              { value: '392', name: '手袋' },
              { value: '396', name: 'ストール' },
              { value: '398', name: 'ネックウォーマー' },
              { value: '408', name: '耳あて・イヤーマフ' },
              { value: '400', name: 'ウォレットチェーン' },
              { value: '386', name: 'マネークリップ' },
              { value: '393', name: 'ハンカチ' },
              { value: '406', name: 'ネクタイピン' },
              { value: '407', name: 'カフリンクス' },
              { value: '409', name: '傘' },
              { value: '410', name: 'レインコート' },
              { value: '397', name: 'バンダナ' },
              { value: '399', name: 'サスペンダー' },
              { value: '413', name: 'その他' },
            ],
          },
          '34': {
            name: 'バッグ',
            items: [
              { value: '355', name: 'リュック・バックパック' },
              { value: '352', name: 'ショルダーバッグ' },
              { value: '353', name: 'トートバッグ' },
              { value: '357', name: 'ボディバッグ・ウエストポーチ' },
              { value: '359', name: 'ビジネスバッグ' },
              { value: '360', name: 'キャリーケース' },
              { value: '354', name: 'ボストンバッグ・旅行用バッグ' },
              { value: '358', name: 'ドラムバッグ' },
              { value: '362', name: 'エコバッグ' },
              { value: '1738', name: 'クラッチバッグ' },
              { value: '363', name: 'その他' },
            ],
          },
          '39': {
            name: '時計',
            items: [
              { value: '414', name: '腕時計(アナログ)' },
              { value: '415', name: '腕時計(デジタル)' },
              { value: '418', name: '金属ベルト' },
              { value: '417', name: 'レザーベルト' },
              { value: '416', name: 'ラバーベルト' },
              { value: '419', name: 'その他' },
            ],
          },
          '36': {
            name: '帽子',
            items: [
              { value: '369', name: 'キャップ' },
              { value: '371', name: 'ニット帽・ビーニー' },
              { value: '370', name: 'ハット' },
              { value: '1765', name: 'ハンチング' },
              { value: '372', name: 'ベレー帽' },
              { value: '373', name: 'キャスケット' },
              { value: '374', name: 'サンバイザー' },
              { value: '1764', name: '麦わら帽子' },
              { value: '375', name: 'その他' },
            ],
          },
          '37': {
            name: 'アクセサリー',
            items: [
              { value: '376', name: 'ネックレス' },
              { value: '377', name: 'ブレスレット' },
              { value: '379', name: 'リング・指輪' },
              { value: '378', name: 'バングル・リストバンド' },
              { value: '380', name: 'ピアス(片方用)' },
              { value: '381', name: 'ピアス(両耳用)' },
              { value: '1768', name: 'イヤリング' },
              { value: '1766', name: 'ノンホールピアス・マグネットピアス' },
              { value: '1770', name: 'イヤーカフ・イヤーフック' },
              { value: '382', name: 'アンクレット' },
              { value: '1767', name: 'ボディピアス' },
              { value: '10843', name: 'ループタイ' },
              { value: '1771', name: 'キークロシェット' },
              { value: '383', name: 'その他' },
            ],
          },
          '35': {
            name: 'スーツ',
            items: [
              { value: '1752', name: 'フォーマル小物' },
              { value: '1751', name: 'カフス' },
              { value: '368', name: 'その他' },
              { value: '367', name: 'ビジネススーツ' },
              { value: '1744', name: 'カジュアルスーツ' },
              { value: '1745', name: 'ブラックフォーマル' },
              { value: '364', name: 'ビジネスジャケット' },
              { value: '365', name: 'スーツベスト' },
              { value: '366', name: 'スラックス' },
              { value: '1750', name: 'フォーマルシャツ' },
              { value: '1749', name: 'フォーマルベスト' },
              { value: '1747', name: 'モーニング・フロックコート' },
              { value: '1748', name: '燕尾服' },
              { value: '1746', name: 'タキシード' },
            ],
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
