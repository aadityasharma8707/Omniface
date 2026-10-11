'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { authService } from '@/lib/api/auth';
import Link from 'next/link';

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

  const navItems = [
    { id: 'problem-section', label: 'Problem' },
    { id: 'how-it-works-section', label: 'Pipeline' },
    { id: 'features-section', label: 'Features' },
    { id: 'live-demo-section', label: 'Live Demo' },
    { id: 'trust-tech-section', label: 'Trust / Tech' },
    { id: 'use-cases-section', label: 'Use Cases' },
    { id: 'auth-section', label: 'Verify' },
  ];

  return (
    <>
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
        aria-label="Main Navigation"
      >
        {/* Brand Badge */}
        <div
          id="brand-badge"
          onClick={() => handleScroll('cyber-ronin-hero')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleScroll('cyber-ronin-hero');
            }
          }}
          aria-label="OmniFace Forensics Home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(10, 10, 10, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '100px',
            padding: '8px clamp(12px, 2vw, 18px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
            cursor: 'pointer',
            flexShrink: 0,
            minHeight: '44px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00E5FF',
              boxShadow: '0 0 8px rgba(0, 229, 255, 0.9)',
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
            OMNIFACE<span className="hidden sm:inline"> <span style={{ color: '#94A3B8' }}>{'//'}</span> FORENSICS</span>
          </span>
        </div>

        {/* Desktop Navigation Links - Centered Pill (Hidden on screens < 1024px) */}
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
            minHeight: '44px',
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              id={`nav-link-${item.id}`}
              onClick={() => handleScroll(item.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 14px',
                fontSize: '11px',
                fontFamily: 'var(--f-display)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.85)',
                cursor: 'pointer',
                borderRadius: '100px',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                minHeight: '36px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.background = 'none';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action Controls & Mobile Hamburger Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              id="hero-auth-direct-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#00E5FF',
                color: '#06080D',
                border: '1px solid #00E5FF',
                borderRadius: '100px',
                padding: '8px clamp(12px, 1.8vw, 18px)',
                fontFamily: 'var(--f-display)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 16px rgba(0, 229, 255, 0.45)',
                minHeight: '44px',
                minWidth: '44px',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              <span>Dashboard</span>
              <ArrowRight size={14} />
            </Link>
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
                padding: '8px clamp(12px, 1.8vw, 18px)',
                fontFamily: 'var(--f-display)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                minHeight: '44px',
                minWidth: '44px',
                justifyContent: 'center',
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
    </>
  );
}
