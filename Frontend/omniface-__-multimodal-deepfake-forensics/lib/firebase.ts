/**
 * lib/firebase.ts — Client-side Firebase App & Auth SDK Initialization.
 *
 * Security & Architecture:
 * - Uses the official modular Firebase JS SDK v11+.
 * - Uses public client configuration parameters (NEXT_PUBLIC_FIREBASE_*).
 * - NEVER uses, requests, or stores Firebase Admin credentials or private keys.
 * - Guarded against multiple initializations during Next.js client renders and fast-refresh.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported, logEvent, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let analyticsInstance: Analytics | null = null;

function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

if (getApps().length > 0) {
  app = getApp();
  auth = getAuth(app);
} else {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    // Provide a dummy/graceful config in environments where env vars haven't been provided yet
    // to prevent build-time crashes.
    if (typeof window !== 'undefined') {
      console.warn(
        '[OmniFace] Firebase Client environment variables are not yet configured in .env.local.\n' +
        'Please define NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID.'
      );
    }
    app = initializeApp({
      apiKey: 'UNCONFIGURED_API_KEY',
      authDomain: 'unconfigured.firebaseapp.com',
      projectId: 'unconfigured',
      appId: '1:000000000000:web:0000000000000000000000',
    });
    auth = getAuth(app);
  }
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Checks whether user has explicitly granted analytics consent in CookieConsentBanner.
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem('omniface_cookie_consent');
    if (!stored) return false;
    const parsed = JSON.parse(stored);
    return parsed?.analytics === true;
  } catch {
    return false;
  }
}

/**
 * Safely initializes Firebase Analytics if running in a supported browser
 * and if user granted cookie consent.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  if (!isFirebaseConfigured()) return null;
  if (!hasAnalyticsConsent()) return null;
  if (analyticsInstance) return analyticsInstance;

  try {
    const supported = await isSupported();
    if (supported) {
      analyticsInstance = getAnalytics(app);
      return analyticsInstance;
    }
  } catch (err) {
    console.debug('[OmniFace] Analytics initialization deferred:', err);
  }
  return null;
}

/**
 * Helper to log forensic and telemetry events.
 * Gracefully respects consent preferences and prevents blocking UI operations.
 */
export async function logForensicEvent(
  eventName: string,
  eventParams?: Record<string, any>
): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;

  try {
    const instance = await getFirebaseAnalytics();
    if (instance) {
      logEvent(instance, eventName, eventParams);
    }
  } catch (err) {
    console.debug('[OmniFace Analytics Log]:', eventName, eventParams, err);
  }
}

export { app, auth, googleProvider, isFirebaseConfigured };
