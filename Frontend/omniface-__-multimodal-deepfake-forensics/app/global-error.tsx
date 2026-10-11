'use client';

import { useEffect } from 'react';
import { captureException } from '@/lib/monitoring';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log exception to global error monitoring
    captureException(error, { boundary: 'global-root-error', digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          backgroundColor: '#06080D',
          color: '#FFFFFF',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '24px',
          paddingRight: '24px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Subtle Background Glow */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '560px',
            width: '100%',
            textAlign: 'center',
            backgroundColor: 'rgba(13, 17, 26, 0.92)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '16px',
            padding: '40px 32px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(239, 68, 68, 0.15)',
          }}
        >
          {/* Warning Icon Badge */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EF4444',
              fontSize: '28px',
              fontWeight: 900,
            }}
          >
            ⚠
          </div>

          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.15em',
              color: '#EF4444',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            CRITICAL SYSTEM FAULT // ROOT EXCEPTION
          </div>

          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 12px 0',
              letterSpacing: '-0.01em',
            }}
          >
            OmniFace Kernel Halted
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.5,
              margin: '0 0 24px 0',
            }}
          >
            An unrecoverable exception occurred in the root runtime hierarchy. The failure has been
            captured and dispatched to forensic telemetry for diagnosis.
          </p>

          {/* Digest Box */}
          {error.digest && (
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                marginBottom: '24px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: 'rgba(0, 229, 255, 0.85)',
              }}
            >
              FAULT_DIGEST: {error.digest}
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: '#00E5FF',
                border: 'none',
                color: '#06080D',
                fontSize: '12.5px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.35)',
              }}
            >
              Reload System
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/';
              }}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                cursor: 'pointer',
              }}
            >
              Return Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
