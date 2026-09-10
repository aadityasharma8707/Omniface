'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HowItWorksSection from '@/components/HowItWorksSection';
import FeaturesSection from '@/components/FeaturesSection';
import LiveDemoSection from '@/components/LiveDemoSection';
import TrustTechSection from '@/components/TrustTechSection';
import UseCasesSection from '@/components/UseCasesSection';
import AuthSection from '@/components/AuthSection';
import CtaFooterSection from '@/components/CtaFooterSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface VerticalSectionsFlowProps {
  onScrollTo?: (id: string) => void;
}

export default function VerticalSectionsFlow({ onScrollTo }: VerticalSectionsFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Find all vertical section wrappers
      const sections = Array.from(container.querySelectorAll<HTMLElement>('.vertical-section-block'));

      sections.forEach((sec) => {
        const titleElements = sec.querySelectorAll<HTMLElement>('.section-title, .section-subtitle, .hud-telemetry-badge');
        const cards = sec.querySelectorAll<HTMLElement>('.forensic-card, article, #auth-main-card, #cta-main-card');

        if (titleElements.length > 0) {
          gsap.fromTo(
            titleElements,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.06,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sec,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sec,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
    }, containerRef);

    // Refresh ScrollTrigger calculations after mount
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="vertical-sections-container"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        backgroundColor: 'transparent',
        zIndex: 10,
      }}
    >
      {/* SECTION 3: HOW IT WORKS / FORENSIC PIPELINE */}
      <div
        className="vertical-section-block"
        id="how-it-works-wrapper"
        style={{
          width: '100%',
          maxWidth: '100%',
          padding: 'clamp(60px, 9vh, 110px) clamp(20px, 4vw, 56px)',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <HowItWorksSection />
      </div>

      {/* SECTION 4: FEATURES */}
      <div
        className="vertical-section-block"
        id="features-wrapper"
        style={{
          width: '100%',
          maxWidth: '100%',
          padding: 'clamp(60px, 9vh, 110px) clamp(20px, 4vw, 56px)',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <FeaturesSection />
      </div>

      {/* SECTION 5: LIVE DEMO */}
      <div
        className="vertical-section-block"
        id="live-demo-wrapper"
        style={{
          width: '100%',
          maxWidth: '100%',
          padding: 'clamp(60px, 9vh, 110px) clamp(20px, 4vw, 56px)',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <LiveDemoSection />
      </div>

      {/* SECTION 6: RESEARCH ARCHITECTURE (TRUST & TECH) */}
      <div
        className="vertical-section-block"
        id="trust-tech-wrapper"
        style={{
          width: '100%',
          maxWidth: '100%',
          padding: 'clamp(60px, 9vh, 110px) clamp(20px, 4vw, 56px)',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <TrustTechSection />
      </div>

      {/* SECTION 7: USE CASES */}
      <div
        className="vertical-section-block"
        id="use-cases-wrapper"
        style={{
          width: '100%',
          maxWidth: '100%',
          padding: 'clamp(60px, 9vh, 110px) clamp(20px, 4vw, 56px)',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <UseCasesSection />
      </div>

      {/* SECTION 8: AUTH / VERIFICATION */}
      <div
        className="vertical-section-block"
        id="auth-wrapper"
        style={{
          width: '100%',
          maxWidth: '100%',
          padding: 'clamp(60px, 9vh, 110px) clamp(20px, 4vw, 56px) 0 clamp(20px, 4vw, 56px)',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <AuthSection onScrollTo={onScrollTo} />
      </div>

      {/* FOOTER & QUICKSTART SDK */}
      <div
        className="vertical-section-block"
        id="footer-wrapper"
        style={{
          width: '100%',
          maxWidth: '100%',
          padding: '0 clamp(20px, 4vw, 56px) clamp(40px, 6vh, 64px) clamp(20px, 4vw, 56px)',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <CtaFooterSection onScrollTo={onScrollTo || (() => {})} />
      </div>
    </div>
  );
}
