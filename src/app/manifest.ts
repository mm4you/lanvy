import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HSK Pixel Town - Thế giới ôn từ tiếng Trung',
    short_name: 'HSK Town',
    description: 'Game nhập vai 2D pixel giúp ôn từ vựng HSK theo chủ đề, hỗ trợ chơi offline.',
    start_url: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#fffdf4',
    theme_color: '#ef4444',
    icons: [
      { src: '/icon?size=192', sizes: '192x192', type: 'image/png' },
      { src: '/icon?size=512', sizes: '512x512', type: 'image/png' },
    ],
  };
}

