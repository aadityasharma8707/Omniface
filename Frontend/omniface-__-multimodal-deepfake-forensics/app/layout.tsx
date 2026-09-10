import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OmniFace // Multimodal Deepfake Forensics',
  description: 'OmniFace multimodal deepfake recognition and media integrity software featuring interactive live forensics for images, video, and audio, research-grade benchmarks, and explainable AI.',
  openGraph: {
    title: 'OmniFace // Multimodal Deepfake Forensics',
    description: 'OmniFace multimodal deepfake recognition and media integrity software featuring interactive live forensics for images, video, and audio, research-grade benchmarks, and explainable AI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniFace // Multimodal Deepfake Forensics',
    description: 'OmniFace multimodal deepfake recognition and media integrity software featuring interactive live forensics for images, video, and audio, research-grade benchmarks, and explainable AI.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
