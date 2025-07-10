import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  // カスタムService Workerを指定
  workboxOptions: {
    swSrc: 'src/sw.js', // カスタムSWのソース
    swDest: 'public/sw.js', // 出力先
    mode: 'production',

    // 自動生成ファイルの除外
    exclude: [/\.map$/, /manifest$/, /\.DS_Store$/, /^workbox-.*\.js$/],
  },
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
