'use client';

import { useEffect, useRef } from 'react';

// Global scroll state accessible across components without React re-renders
export const globalScrollState = {
  targetScrollY: 0,
  currentScrollY: 0,
  globalProgress: 0,
  globalOpacity: 0.35,
  horizontalProgress: 0,
};

export default function ScrollEngine() {
  const isRunningRef = useRef(false);

  useEffect(() => {
    let viewportHeight = window.innerHeight;
    let docHeight = document.documentElement.scrollHeight;

    const heroEl = document.getElementById('cyber-ronin-hero');
    const heroElements = heroEl
      ? Array.from(heroEl.querySelectorAll<HTMLElement>('#hero-copy, #product-card, #specs-card, #hero-scroll-prompt'))
      : [];

    // Hardware acceleration hints
    heroElements.forEach((el) => (el.style.willChange = 'transform, opacity'));

    const measureBounds = () => {
      viewportHeight = window.innerHeight;
      docHeight = document.documentElement.scrollHeight;
    };

    const initTimer = setTimeout(measureBounds, 100);

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measureBounds, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Immediate synchronous scroll listener
    const updateScrollState = () => {
      const currY = window.scrollY || window.pageYOffset;
      globalScrollState.targetScrollY = currY;
      globalScrollState.currentScrollY = currY;
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    // High-performance RAF Loop to keep state responsive during momentum / trackpad scrolling
    let rafId: number;
    isRunningRef.current = true;

    const tick = () => {
      if (!isRunningRef.current) return;
      updateScrollState();
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      isRunningRef.current = false;
      cancelAnimationFrame(rafId);
      clearTimeout(initTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateScrollState);
    };
  }, []);

  return null;
}
