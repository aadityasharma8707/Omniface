import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard'];
const AUTH_ROUTES = ['/login', '/register'];
const SESSION_COOKIE = 'omniface_session';

export function middleware(request: NextRequest): NextResponse {
  // 1. Force HTTPS in production environment (behind reverse proxies / load balancers)
  const proto = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('host') || request.nextUrl.host;
  const isProduction = process.env.NODE_ENV === 'production';
  const isLocalhost =
    request.nextUrl.hostname === 'localhost' ||
    request.nextUrl.hostname === '127.0.0.1' ||
    request.nextUrl.hostname.endsWith('.local');

  if (isProduction && !isLocalhost && proto === 'http') {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = 'https:';
    if (host) {
      httpsUrl.host = host;
    }
    return NextResponse.redirect(httpsUrl, 301);
  }

  // 2. Auth routing protection
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const isAuthenticated = !!sessionCookie;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtected && !isAuthenticated) {
    const landingUrl = new URL('/', request.url);
    const response = NextResponse.redirect(landingUrl);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    return response;
  }

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  if (isAuthRoute && isAuthenticated) {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg, apple-icon.png, manifest.webmanifest
     * - media files
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)',
  ],
};