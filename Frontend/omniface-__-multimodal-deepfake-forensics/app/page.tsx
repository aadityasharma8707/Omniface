'use client';

import { useCallback, useEffect } from 'react';
import HeroProblemSequence from '@/components/HeroProblemSequence';
import VerticalSectionsFlow from '@/components/VerticalSectionsFlow';
import ScrollEngine from '@/components/ScrollEngine';
import GlobalRoboticFace from '@/components/GlobalRoboticFace';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function LandingPage() {
  // Smooth scroll helper to navigate between sections
  const scrollToSection = useCallback((id: string) => {
    if (id === 'cyber-ronin-hero' || id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const vh = window.innerHeight;

    // Problem Section is settled around ~220vh in the 250vh sequence
    if (id === 'problem-section' || id === 'problem-content') {
      window.scrollTo({ top: vh * 2.2, behavior: 'smooth' });
      return;
    }

    // Standard vertical flow sections (Pipeline, Features, Live Demo, Trust/Tech, Use Cases, Auth, Footer)
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const targetY = (window.pageYOffset || window.scrollY) + rect.top - 24;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }, []);

  // Refresh ScrollTrigger and clean up any stale storage items
  useEffect(() => {
    try {
      localStorage.removeItem('dprki_figure_base');
      localStorage.removeItem('dprki_figure_reveal');
    } catch {
      // ignore
    }

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        overflowX: 'hidden',
      }}
    >
      {/* 
        =============================================================================
        1. MASTER DIRECTIONAL & VERTICAL SCROLL ENGINE
        =============================================================================
      */}
      <ScrollEngine />

      {/* 
        =============================================================================
        2. PERSISTENT GLOBAL ROBOTIC FACE BACKGROUND LAYER
           - Preloads 240-frame sequence
           - Activates seamlessly from Section 3 onwards with continuous scroll parallax
        =============================================================================
      */}
      <GlobalRoboticFace />

      {/* 
        =============================================================================
        3. FOREGROUND CONTENT:
           - HERO -> PROBLEM PINNED SCROLL SEQUENCE (250vh)
           - STABLE VERTICAL SECTIONS: How It Works -> Features -> Live Demo -> Trust/Tech -> Use Cases -> Auth -> Footer
        =============================================================================
      */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '100%' }}>
        {/* HERO TO PROBLEM PINNED SCROLL SEQUENCE */}
        <HeroProblemSequence onScrollTo={scrollToSection} />

        {/* 
          =============================================================================
          VERTICAL SECTIONS FLOW
          Section 3 (How It Works) -> Features -> Live Demo -> Research (Trust & Tech) -> Use Cases -> Verification -> Footer
          =============================================================================
        */}
        <VerticalSectionsFlow onScrollTo={scrollToSection} />
      </div>
    </main>
  );
}
