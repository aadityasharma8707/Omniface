import type { Metadata } from 'next';
import { Orbitron, Inter } from 'next/font/google';
import './globals.css';
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { ThemeProvider } from '@/lib/theme/ThemeContext';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: false,
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: false,
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'https://omniface--multimodal-deepfake-foren.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'OmniFace // Multimodal Deepfake Forensics & AI Detection',
    template: '%s // OmniFace',
  },
  description: 'OmniFace multimodal deepfake recognition and media integrity software featuring interactive live forensics for images, video, and audio, research-grade benchmarks, and explainable AI.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'OmniFace // Multimodal Deepfake Forensics & AI Detection',
    description: 'OmniFace multimodal deepfake recognition and media integrity software featuring interactive live forensics for images, video, and audio, research-grade benchmarks, and explainable AI.',
    url: APP_URL,
    siteName: 'OmniFace Deepfake Forensics',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'OmniFace Multimodal Deepfake Forensics Console',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniFace // Multimodal Deepfake Forensics & AI Detection',
    description: 'OmniFace multimodal deepfake recognition and media integrity software featuring interactive live forensics for images, video, and audio, research-grade benchmarks, and explainable AI.',
    images: ['/twitter-image'],
    creator: '@OmniFaceAI',
  },
  verification: {
    google: 'tPobSXVnj6Yf6Zq3qWdW1e_4esx_n-NFIKhDTzT8_Ew',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="tPobSXVnj6Yf6Zq3qWdW1e_4esx_n-NFIKhDTzT8_Ew" />
        <link rel="preload" as="image" href="/hero-base.webp" type="image/webp" />
        <script src="/theme-init.js" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <CookieConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
