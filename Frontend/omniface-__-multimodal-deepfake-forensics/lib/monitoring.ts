/**
 * lib/monitoring.ts
 * Frontend Observability & Error Monitoring Service.
 * - Captures uncaught frontend exceptions and unhandled promise rejections.
 * - Formats standardized diagnostic telemetry payloads.
 * - Provides pluggable hooks for Sentry / LogRocket or custom backend telemetry.
 */

export interface ErrorReportContext {
  userId?: string;
  userEmail?: string;
  route?: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

export interface TelemetryPayload {
  level: 'fatal' | 'error' | 'warning' | 'info';
  message: string;
  name?: string;
  stack?: string;
  digest?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  screenResolution: string;
  context?: ErrorReportContext;
}

const BACKEND_API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

/**
 * Normalizes unknown thrown errors into a standard Error object.
 */
function normalizeError(error: unknown): { message: string; name: string; stack?: string; digest?: string } {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
      digest: (error as any).digest,
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      name: 'CustomErrorString',
    };
  }

  return {
    message: String(error) || 'Unknown frontend exception occurred',
    name: 'UnhandledException',
  };
}

/**
 * Builds standard telemetry diagnostic payload.
 */
function buildTelemetryPayload(
  error: unknown,
  level: TelemetryPayload['level'] = 'error',
  context?: ErrorReportContext
): TelemetryPayload {
  const norm = normalizeError(error);

  const url = typeof window !== 'undefined' ? window.location.href : 'SSR';
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/SSR';
  const screenResolution =
    typeof window !== 'undefined'
      ? `${window.innerWidth}x${window.innerHeight}`
      : 'N/A';

  return {
    level,
    message: norm.message,
    name: norm.name,
    stack: norm.stack,
    digest: norm.digest,
    url,
    userAgent,
    timestamp: new Date().toISOString(),
    screenResolution,
    context,
  };
}

/**
 * Dispatches error report to external monitoring APM or backend telemetry endpoint.
 */
async function dispatchReport(payload: TelemetryPayload): Promise<void> {
  // 1. Console diagnostics
  if (process.env.NODE_ENV !== 'production') {
    console.groupCollapsed(`[OmniFace Telemetry ${payload.level.toUpperCase()}]: ${payload.message}`);
    console.error('Payload:', payload);
    if (payload.stack) console.error('Stack:', payload.stack);
    console.groupEnd();
  }

  // 2. Integration hook: Sentry (if initialized on window)
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    try {
      (window as any).Sentry.captureException(new Error(payload.message), {
        extra: payload,
      });
    } catch {
      // Ignore APM dispatch errors
    }
  }

  // 3. Integration hook: LogRocket (if initialized on window)
  if (typeof window !== 'undefined' && (window as any).LogRocket) {
    try {
      (window as any).LogRocket.captureException(new Error(payload.message), {
        extra: payload,
      });
    } catch {
      // Ignore APM dispatch errors
    }
  }

  // 4. Custom Backend Telemetry Endpoint
  if (typeof window !== 'undefined') {
    try {
      // Use non-blocking sendBeacon if available, otherwise fallback to fetch
      const endpoint = `${BACKEND_API_URL}/api/v1/telemetry`;
      const data = JSON.stringify(payload);

      if (navigator.sendBeacon) {
        const blob = new Blob([data], { type: 'application/json' });
        navigator.sendBeacon(endpoint, blob);
      } else {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Suppress telemetry transport errors to keep user experience intact
    }
  }
}

/**
 * Captures an uncaught exception with diagnostic context.
 */
export function captureException(error: unknown, context?: ErrorReportContext): void {
  const payload = buildTelemetryPayload(error, 'error', context);
  dispatchReport(payload);
}

/**
 * Captures an unhandled message or operational event with custom severity.
 */
export function captureMessage(
  message: string,
  level: TelemetryPayload['level'] = 'info',
  context?: ErrorReportContext
): void {
  const payload = buildTelemetryPayload(new Error(message), level, context);
  dispatchReport(payload);
}

/**
 * Registers global window error and unhandled promise rejection listeners.
 */
export function initGlobalErrorMonitoring(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    captureException(event.error || event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    captureException(event.reason, {
      type: 'UnhandledPromiseRejection',
    });
  });
}
