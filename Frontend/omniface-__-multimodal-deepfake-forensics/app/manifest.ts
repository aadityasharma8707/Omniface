import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OmniFace // Multimodal Deepfake Forensics',
    short_name: 'OmniFace',
    description: 'Multimodal deepfake recognition and media integrity forensic platform.',
    start_url: '/',
    display: 'standalone',
    background_color: '#06080D',
    theme_color: '#00E5FF',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  };
}
