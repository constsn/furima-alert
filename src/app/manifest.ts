import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'フリマ通知',
    short_name: 'フリマ通知',
    description: '新着商品の出品をお知らせします',
    start_url: '/',
    display: 'standalone',
    background_color: '#fef2f2',
    theme_color: '#ef4444',
    orientation: 'portrait',
    scope: '/',
    lang: 'ja',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
