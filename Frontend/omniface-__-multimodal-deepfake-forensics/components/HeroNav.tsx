'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/lib/api/auth';

interface HeroNavProps {
  onScrollTo?: (id: string) => void;
}

export default function HeroNav({ onScrollTo }: HeroNavProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!authService.getCurrentUser());
    const unsub = authService.onAuthStateChange((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsub();
  }, []);

  const handleScroll = (id: string) => {
    if (onScrollTo) {
      onScrollTo(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="interactive"
      id="hero-nav"
      style={{
        position: 'fixed',
        top: 'clamp(10px, 1.8vh, 18px)',
        left: 'clamp(16px, 3vw, 42px)',
        right: 'clamp(16px, 3vw, 42px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'auto',
      }}
    >
      {/* Brand Badge */}
      <div
        id="brand-badge"
        onClick={() => handleScroll('cyber-ronin-hero')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(10, 10, 10, 0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '100px',
          padding: '6px clamp(10px, 2vw, 16px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
          }}
        >
          OMNIFACE<span className="hidden sm:inline"> <span style={{ color: '#888888' }}>{'//'}</span> FORENSICS</span>
        </span>
      </div>

      {/* Navigation Links - Centered Pill */}
      <div
        id="nav-links-container"
        className="hidden lg:flex"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(10, 10, 10, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '100px',
          padding: '4px 8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        {[
          { id: 'problem-section', label: 'Problem' },
          { id: 'how-it-works-section', label: 'Pipeline' },
          { id: 'features-section', label: 'Features' },
          { id: 'live-demo-section', label: 'Live Demo' },
          { id: 'trust-tech-section', label: 'Trust / Tech' },
          { id: 'use-cases-section', label: 'Use Cases' },
          { id: 'auth-section', label: 'Verify' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            id={`nav-link-${item.id}`}
            onClick={() => handleScroll(item.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '6px 13px',
              fontSize: '11px',
              fontFamily: 'var(--f-display)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.75)',
              cursor: 'pointer',
              borderRadius: '100px',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
              e.currentTarget.style.background = 'none';
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {isLoggedIn ? (
          <button
            type="button"
            id="hero-auth-direct-btn"
            onClick={() => { window.location.href = '/dashboard'; }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#00E5FF',
              color: '#06080D',
              border: '1px solid #00E5FF',
              borderRadius: '100px',
              padding: '6px clamp(10px, 1.8vw, 14px)',
              fontFamily: 'var(--f-display)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 16px rgba(0, 229, 255, 0.4)',
              minHeight: '36px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = '#FFFFFF';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#00E5FF';
              e.currentTarget.style.borderColor = '#00E5FF';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 229, 255, 0.4)';
            }}
          >
            <span>Dashboard</span>
            <span style={{ fontSize: '12px' }}>→</span>
          </button>
        ) : (
          <button
            type="button"
            id="hero-auth-direct-btn"
            onClick={() => handleScroll('auth-section')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFFFFF',
              color: '#0A0A0A',
              border: '1px solid #0A0A0A',
              borderRadius: '100px',
              padding: '6px clamp(10px, 1.8vw, 14px)',
              fontFamily: 'var(--f-display)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              minHeight: '36px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F0F0F0';
              e.currentTarget.style.borderColor = '#000000';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = '#0A0A0A';
              e.currentTarget.style.color = '#0A0A0A';
            }}
          >
            <span>Log In</span>
          </button>
        )}
      </div>
    </nav>
  );
}
