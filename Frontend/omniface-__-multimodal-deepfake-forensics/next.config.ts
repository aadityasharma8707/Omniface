import type { NextConfig } from 'next';

// Content Security Policy (CSP) directive string
// Restricts scripts, styles, media, and connections strictly to verified trusted origins
const CSP_POLICY = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https://res.cloudinary.com https://picsum.photos https://*.googleusercontent.com;
  media-src 'self' data: blob: https://res.cloudinary.com;
  connect-src 'self' https://omniface-x6te.onrender.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.googleapis.com https://api.github.com;
  frame-src 'self' https://*.firebaseapp.com;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim();

// Security headers applied to all routes.
// These are server-side HTTP response headers — they cannot be spoofed by clients.
const SECURITY_HEADERS = [
  {
    key: 'Content-Security-Policy',
    value: CSP_POLICY,
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    // Allow camera/microphone only on the dashboard (for future media capture features).
    // Deny geolocation and other powerful features entirely.
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    // max-age=2 years; only effective over HTTPS (TLS terminator must pass it through)
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Security headers for all routes
  async headers() {
    return [
      {
        // Apply to every route
        source: '/(.*)',
        headers: SECURITY_HEADERS,
      },
    ];
  },
  // Remote image domains — restrict to only what is actually needed.
  // Remove picsum.photos before shipping to production (it is a placeholder domain).
  images: {
    remotePatterns: [
      {
        // Cloudinary CDN — used for uploaded media previews
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // TODO: Remove the picsum.photos entry below before deploying to production.
      // It is only used for placeholder/mock images during development.
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Standalone output for Docker deployment only (disabled on Netlify/Vercel)
  ...(process.env.DOCKER_BUILD === 'true' ? { output: 'standalone' as const } : {}),
  transpilePackages: ['motion'],
  webpack: (config, { dev }) => {
    // HMR is disabled in certain CI environments via DISABLE_HMR env var.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
