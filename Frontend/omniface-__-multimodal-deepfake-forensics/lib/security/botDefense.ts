/**
 * lib/security/botDefense.ts
 * Spam & Bot Defense utilities:
 * - Hidden honeypot field guards and verification.
 * - Sliding-window rate limiting guard against brute-force / spam submissions.
 * - Integration interfaces and hooks for Cloudflare Turnstile & Firebase App Check.
 */

// Honeypot field name (non-obvious, disguised as an accessibility / agency token)
export const HONEYPOT_FIELD_NAME = 'user_department_ref_id';

export interface RateLimitCheckResult {
  isAllowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
}

/**
 * In-memory / sessionStorage rate limit record tracker.
 */
interface RateLimitRecord {
  timestamps: number[];
  lockedUntil?: number;
}

const rateLimitStorage: Map<string, RateLimitRecord> = new Map();

/**
 * Checks sliding-window client rate limits for sensitive actions (e.g. login, register, password reset).
 *
 * @param action - Unique identifier for the guarded action (e.g., 'auth:login', 'auth:register')
 * @param maxAttempts - Maximum allowed attempts within the window (default: 5)
 * @param windowMs - Sliding window duration in milliseconds (default: 60,000ms = 1 minute)
 * @param lockDurationMs - Lockout penalty duration if limit exceeded (default: 60,000ms)
 */
export function checkRateLimit(
  action: string,
  maxAttempts: number = 5,
  windowMs: number = 60000,
  lockDurationMs: number = 60000
): RateLimitCheckResult {
  const now = Date.now();
  let record = rateLimitStorage.get(action);

  if (!record) {
    // Attempt to restore from sessionStorage in browser
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(`omniface_rl_${action}`);
        if (stored) {
          record = JSON.parse(stored);
        }
      } catch {
        // Fallback to in-memory record
      }
    }
  }

  if (!record) {
    record = { timestamps: [] };
  }

  // Check if locked out
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      isAllowed: false,
      remainingAttempts: 0,
      retryAfterSeconds,
    };
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxAttempts) {
    record.lockedUntil = now + lockDurationMs;
    persistRecord(action, record);
    return {
      isAllowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: Math.ceil(lockDurationMs / 1000),
    };
  }

  return {
    isAllowed: true,
    remainingAttempts: maxAttempts - record.timestamps.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Records an attempt execution in the rate-limiting tracker.
 */
export function recordRateLimitAttempt(action: string): void {
  const now = Date.now();
  let record = rateLimitStorage.get(action);
  if (!record) {
    record = { timestamps: [] };
  }
  record.timestamps.push(now);
  persistRecord(action, record);
}

/**
 * Resets rate limit for an action upon successful authentication.
 */
export function resetRateLimit(action: string): void {
  rateLimitStorage.delete(action);
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(`omniface_rl_${action}`);
    } catch {
      // Ignore storage errors
    }
  }
}

function persistRecord(action: string, record: RateLimitRecord) {
  rateLimitStorage.set(action, record);
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(`omniface_rl_${action}`, JSON.stringify(record));
    } catch {
      // Ignore storage errors
    }
  }
}

/**
 * Validates honeypot field value and form fill latency.
 * Automated bots populate hidden fields instantly (<800ms) or fill every input.
 */
export function validateHoneypot(
  honeypotValue: string,
  formMountTimestamp?: number,
  minimumFillTimeMs: number = 700
): { isBot: boolean; reason?: string } {
  // If the hidden honeypot input contains any text, an automated scraper filled it
  if (honeypotValue && honeypotValue.trim().length > 0) {
    return {
      isBot: true,
      reason: 'Automated submission signature identified (honeypot triggered).',
    };
  }

  // If form was submitted unnaturally fast (under 700ms from component mounting)
  if (formMountTimestamp && Date.now() - formMountTimestamp < minimumFillTimeMs) {
    return {
      isBot: true,
      reason: 'Sub-millisecond form submission detected. Automated script blocked.',
    };
  }

  return { isBot: false };
}

/**
 * Integration hook for Cloudflare Turnstile & Firebase App Check.
 * If site keys are provided via environment variables, integrates challenge tokens.
 * Otherwise, provides graceful transparent fallback.
 */
export interface BotChallengeTokenProvider {
  type: 'turnstile' | 'app_check' | 'none';
  getToken: () => Promise<string | null>;
}

export const botProtectionService: BotChallengeTokenProvider = {
  type: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    ? 'turnstile'
    : process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY
    ? 'app_check'
    : 'none',

  getToken: async (): Promise<string | null> => {
    // 1. Cloudflare Turnstile token integration
    if (typeof window !== 'undefined' && (window as any).turnstile) {
      try {
        const token = (window as any).turnstile.getResponse();
        if (token) return token;
      } catch {
        // Fallback
      }
    }

    // 2. Firebase App Check integration hook
    if (typeof window !== 'undefined' && (window as any).firebaseAppCheck) {
      try {
        const appCheckToken = await (window as any).firebaseAppCheck.getToken(false);
        if (appCheckToken?.token) return appCheckToken.token;
      } catch {
        // Fallback
      }
    }

    return null;
  },
};
