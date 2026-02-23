import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Waddi',
    short_name: 'Waddi',
    description: 'Lagos\'s Trusted Event Planner Marketplace',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#7d3aed',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
