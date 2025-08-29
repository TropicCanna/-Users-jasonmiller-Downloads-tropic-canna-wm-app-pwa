
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  const name = process.env.NEXT_PUBLIC_BRAND_NAME || process.env.BRAND_NAME || 'Tropic Canna';
  const short = (name || 'Tropic Canna').slice(0, 12);
  const theme = process.env.NEXT_PUBLIC_PRIMARY_COLOR || process.env.PRIMARY_COLOR || '#FF6DAE';
  return {
    name,
    short_name: short,
    description: 'Browse our live menu and shop on Weedmaps.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: theme,
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-256.png', sizes: '256x256', type: 'image/png' },
      { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  };
}
