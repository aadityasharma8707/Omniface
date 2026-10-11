'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, Terminal, RefreshCw } from 'lucide-react';

export default function NotFound() {
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
      {/* Background Cyber Grid & Vignette */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.08) 0%, transparent 60%),
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Holographic Radar Scanner Container */}
      <div
        style={{
          position: 'relative',
          width: 'clamp(200px, 32vw, 280px)',
          height: 'clamp(200px, 32vw, 280px)',
          borderRadius: '50%',
          border: '1px solid rgba(0, 229, 255, 0.35)',
          backgroundColor: 'rgba(6, 8, 13, 0.85)',
          boxShadow: '0 0 50px rgba(0, 229, 255, 0.2), inset 0 0 40px rgba(0, 229, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '28px',
          overflow: 'hidden',
        }}
      >
        {/* Radar Concentric Rings */}
        <div
          style={{
            position: 'absolute',
            width: '75%',
            height: '75%',
            borderRadius: '50%',
            border: '1px dashed rgba(0, 229, 255, 0.25)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            border: '1px solid rgba(0, 229, 255, 0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '25%',
            height: '25%',
            borderRadius: '50%',
            border: '1px dashed rgba(0, 229, 255, 0.25)',
          }}
        />

        {/* Crosshair Axes */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(0, 229, 255, 0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '1px',
            height: '100%',
            backgroundColor: 'rgba(0, 229, 255, 0.2)',
          }}
        />

        {/* Radar Sweeping Beam */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0, 229, 255, 0.4) 360deg)',
            animation: 'radarSweep 3.5s linear infinite',
            transformOrigin: 'center center',
          }}
        />

        {/* Central Blinking Warning Beacon */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 77, 77, 0.15)',
              border: '1px solid #FF4D4D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 77, 77, 0.5)',
              animation: 'pulse 1.8s ease-in-out infinite',
            }}
          >
            <ShieldAlert size={24} color="#FF4D4D" />
          </div>
          <span
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#FF4D4D',
              letterSpacing: '0.1em',
            }}
          >
            PING FAILED
          </span>
        </div>
      </div>

      {/* Main 404 Glitch Title */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '620px',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 229, 255, 0.08)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            borderRadius: '100px',
            padding: '6px 14px',
            marginBottom: '16px',
          }}
        >
          <Terminal size={13} color="#00E5FF" />
          <span
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#00E5FF',
              textTransform: 'uppercase',
            }}
          >
            ERROR // 404_SIGNAL_NOT_FOUND
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 'clamp(28px, 4.5vw, 44px)',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '14px',
            lineHeight: 1.15,
            color: '#FFFFFF',
            textShadow: '0 0 24px rgba(0, 229, 255, 0.3)',
          }}
        >
          FORENSIC TARGET <span style={{ color: '#00E5FF' }}>UNRESOLVED</span>
        </h1>

        <p
          style={{
            fontSize: '14.5px',
            lineHeight: 1.65,
            color: '#94A3B8',
            marginBottom: '28px',
            maxWidth: '520px',
            margin: '0 auto 30px auto',
          }}
        >
          The biometric telemetry endpoint or forensic investigation coordinate you requested does not exist on the OmniFace neural grid. It may have been quarantined, moved, or purged.
        </p>

        {/* Telemetry Status Box */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(12px, 3vw, 24px)',
            padding: '12px 18px',
            backgroundColor: 'rgba(13, 17, 26, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            marginBottom: '32px',
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#94A3B8',
            flexWrap: 'wrap',
          }}
        >
          <span>SECTOR: <strong style={{ color: '#FFFFFF' }}>OFF-GRID</strong></span>
          <span>•</span>
          <span>LATENCY: <strong style={{ color: '#FFFFFF' }}>0.00ms</strong></span>
          <span>•</span>
          <span>RADAR: <strong style={{ color: '#FF4D4D' }}>NO_ECHO</strong></span>
        </div>

        {/* Action CTAs: Primary vs Secondary */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '14px',
          }}
        >
          <Link
            href="/dashboard"
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
              textDecoration: 'none',
              boxShadow: '0 0 24px rgba(0, 229, 255, 0.55)',
              minHeight: '44px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>Return to Dashboard</span>
            <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </Link>

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
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
