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
        children: {
          '11': {
            name: 'トップス',
            items: [
              { value: '3092', name: 'シャツ・ブラウス' },
              { value: '3089', name: 'Tシャツ・カットソー' },
              { value: '127', name: 'ニット・セーター' },
              { value: '129', name: 'カーディガン・ボレロ・アンサンブル' },
              { value: '131', name: 'ベスト・ジレ・ビスチェ' },
              { value: '128', name: 'チュニック' },
              { value: '123', name: 'ポロシャツ' },
              { value: '132', name: 'パーカー' },
              { value: '133', name: 'トレーナー・スウェット' },
              { value: '125', name: 'タンクトップ' },
              { value: '124', name: 'キャミソール' },
              { value: '134', name: 'ベアトップ・チューブトップ' },
              { value: '135', name: 'ジャージ' },
              { value: '136', name: 'その他' },
            ],
          },
          '12': {
            name: 'ジャケット・アウター',
            items: [
              { value: '140', name: 'レザージャケット・ライダース' },
              { value: '141', name: 'ダウンジャケット' },
              { value: '149', name: 'ロングコート' },
              { value: '145', name: 'ジャンパー・ブルゾン' },
              { value: '137', name: 'テーラードジャケット' },
              { value: '138', name: 'ノーカラージャケット' },
              { value: '150', name: 'トレンチコート・スプリングコート' },
              { value: '153', name: '毛皮・ファーコート' },
              { value: '139', name: 'Gジャン・デニムジャケット・カバーオール' },
              { value: '1443', name: 'フリースジャケット・ボアジャケット' },
              { value: '144', name: 'ダウンベスト・キルティングベスト' },
              { value: '1446', name: 'キルティングジャケット' },
              { value: '1447', name: 'ムートンコート' },
              { value: '1129', name: 'チェスターコート' },
              { value: '146', name: 'ポンチョ・ケープコート' },
              { value: '152', name: 'ピーコート・ウールコート' },
              { value: '151', name: 'ダッフルコート' },
              { value: '1149', name: 'モッズコート' },
              { value: '143', name: 'ミリタリージャケット' },
              { value: '1444', name: 'MA-1' },
              { value: '147', name: 'スタジャン' },
              { value: '148', name: 'スカジャン' },
              { value: '1445', name: 'マウンテンパーカー' },
              { value: '155', name: 'その他' },
            ],
          },
          '13': {
            name: 'パンツ',
            items: [
              { value: '156', name: 'デニム・ジーンズ' },
              { value: '158', name: 'カジュアルパンツ' },
              { value: '157', name: 'ショートパンツ・ハーフパンツ' },
              { value: '161', name: 'ワークパンツ・カーゴパンツ' },
              { value: '1476', name: 'ワイドパンツ・イージーパンツ' },
              { value: '1478', name: 'スラックス' },
              { value: '1479', name: 'スキニーパンツ' },
              { value: '170', name: 'キュロット' },
              { value: '1128', name: 'ガウチョパンツ' },
              { value: '165', name: 'サルエルパンツ' },
              { value: '1480', name: 'ジョガーパンツ・スウェットパンツ' },
              { value: '160', name: 'チノパン' },
              { value: '166', name: 'その他' },
            ],
          },
          '14': {
            name: 'スカート',
            items: [
              { value: '169', name: 'ロングスカート' },
              { value: '168', name: 'ひざ丈スカート' },
              { value: '167', name: 'ミニスカート' },
              { value: '171', name: 'その他' },
            ],
          },
          '15': {
            name: 'ワンピース',
            items: [
              { value: '174', name: 'ロングワンピース' },
              { value: '173', name: 'ひざ丈ワンピース' },
              { value: '172', name: 'ミニワンピース' },
              { value: '175', name: 'その他' },
            ],
          },
          '20': {
            name: 'バッグ',
            items: [
              { value: '214', name: 'ショルダーバッグ' },
              { value: '209', name: 'トートバッグ' },
              { value: '208', name: 'ハンドバッグ' },
              { value: '211', name: 'リュック・バックパック' },
              { value: '216', name: 'ポーチ' },
              { value: '212', name: 'ボストンバッグ・旅行用バッグ' },
              { value: '221', name: 'キャリーケース' },
              { value: '210', name: 'エコバッグ' },
              { value: '224', name: 'かごバッグ' },
              { value: '217', name: 'ボディバッグ・ウエストポーチ' },
              { value: '215', name: 'クラッチバッグ' },
              { value: '218', name: 'マザーズバッグ' },
              { value: '220', name: 'ビジネスバッグ' },
              { value: '288', name: 'パーティーバッグ' },
              { value: '225', name: 'その他' },
            ],
          },
          '21': {
            name: 'アクセサリー',
            items: [
              { value: '226', name: 'ネックレス' },
              { value: '1559', name: 'チョーカー' },
              { value: '229', name: 'リング・指輪' },
              { value: '227', name: 'ブレスレット' },
              { value: '228', name: 'バングル・リストバンド' },
              { value: '231', name: 'ピアス(両耳用)' },
              { value: '230', name: 'ピアス(片耳用)' },
              { value: '232', name: 'イヤリング' },
              { value: '1532', name: 'ノンホールピアス・マグネットピアス' },
              { value: '1535', name: 'イヤーカフ・イヤーフック' },
              { value: '234', name: 'ブローチ・コサージュ' },
              { value: '235', name: 'チャーム' },
              { value: '233', name: 'アンクレット' },
              { value: '1533', name: 'ボディピアス' },
              { value: '10844', name: 'ループタイ' },
              { value: '1536', name: 'キークロシェット' },
              { value: '236', name: 'その他' },
            ],
          },
          '23': {
            name: '小物',
            items: [],
          },
          '16': {
            name: '靴',
            items: [],
          },
          '26': {
            name: '着物・浴衣',
            items: [],
          },
          '27': {
            name: 'スーツ・フォーマル・ドレス',
            items: [],
          },
          '1488': {
            name: 'セットアップ',
            items: [],
          },
          '24': {
            name: '時計',
            items: [],
          },
          '19': {
            name: '帽子',
            items: [],
          },
          '22': {
            name: 'ヘアアクセサリー',
            items: [],
          },
          '1326': {
            name: '下着・アンダーウェア',
            items: [],
          },
          '18': {
            name: 'レッグウェア',
            items: [],
          },
          '17': {
            name: 'ルームウェア・パジャマ',
            items: [],
          },
          '1661': {
            name: '水着・ラッシュガード',
            items: [],
          },
        },
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
