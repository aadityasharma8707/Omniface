'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Terminal, ShieldX } from 'lucide-react';
import { captureException } from '@/lib/monitoring';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Dispatch exception to monitoring telemetry
    captureException(error, { boundary: 'route-error-boundary', digest: error.digest });
  }, [error]);

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#06080D',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--f-body)',
      }}
    >
      {/* Background Cyber Grid */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255, 77, 77, 0.08) 0%, transparent 60%),
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Warning Hexagon Badge */}
      <div
        style={{
          position: 'relative',
          width: '88px',
          height: '88px',
          borderRadius: '24px',
          backgroundColor: 'rgba(255, 77, 77, 0.12)',
          border: '1px solid rgba(255, 77, 77, 0.4)',
          boxShadow: '0 0 40px rgba(255, 77, 77, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          zIndex: 10,
        }}
      >
        <ShieldX size={44} color="#FF4D4D" />
      </div>

      {/* Error Details Card */}
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 77, 77, 0.1)',
            border: '1px solid rgba(255, 77, 77, 0.3)',
            borderRadius: '100px',
            padding: '6px 14px',
            marginBottom: '16px',
          }}
        >
          <AlertTriangle size={13} color="#FF4D4D" />
          <span
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#FF4D4D',
              textTransform: 'uppercase',
            }}
          >
            CRITICAL EXCEPTION // RECOVERY MODE
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 'clamp(26px, 4vw, 38px)',
            fontWeight: 800,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            marginBottom: '14px',
            lineHeight: 1.2,
            color: '#FFFFFF',
          }}
        >
          FORENSIC PIPELINE <span style={{ color: '#FF4D4D' }}>HALTED</span>
        </h1>

        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#94A3B8',
            marginBottom: '24px',
          }}
        >
          An unexpected runtime anomaly prevented the application from rendering this forensic component. The error has been captured to telemetry diagnostics.
        </p>

        {/* Diagnostic Error Digest Box */}
        <div
          style={{
            backgroundColor: 'rgba(10, 14, 22, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '28px',
            textAlign: 'left',
            fontFamily: 'monospace',
            fontSize: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94A3B8',
              marginBottom: '8px',
              fontSize: '10.5px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            <Terminal size={12} color="#94A3B8" />
            <span>DIAGNOSTIC OUTPUT</span>
          </div>
          <div
            style={{
              color: '#FF6B6B',
              wordBreak: 'break-word',
              lineHeight: 1.4,
            }}
          >
            {error.message || 'Unknown forensic exception occurred in rendering lifecycle.'}
          </div>
          {error.digest && (
            <div
              style={{
                marginTop: '8px',
                fontSize: '11px',
                color: '#64748B',
              }}
            >
              DIGEST ID: {error.digest}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={() => reset()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#00E5FF',
              color: '#06080D',
              border: '1px solid #00E5FF',
              borderRadius: '100px',
              padding: '12px 24px',
              fontFamily: 'var(--f-display)',
              fontSize: '11.5px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 0 24px rgba(0, 229, 255, 0.55)',
              minHeight: '44px',
              transition: 'all 0.2s ease',
            }}
          >
            <RefreshCw size={15} />
            <span>RETRY OPERATION</span>
          </button>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              borderRadius: '100px',
              padding: '12px 22px',
              fontFamily: 'var(--f-display)',
              fontSize: '11.5px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              minHeight: '44px',
              transition: 'all 0.2s ease',
            }}
          >
            <Home size={15} />
            <span>RETURN HOME</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
