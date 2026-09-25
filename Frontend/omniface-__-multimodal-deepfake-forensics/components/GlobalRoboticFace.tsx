'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { globalScrollState } from '@/components/ScrollEngine';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 150;
const MAX_CONCURRENT = 4; // Tunable concurrency limit to eliminate network contention

export default function GlobalRoboticFace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  
  // High-performance animation registers
  const lastRenderedFrameRef = useRef(-1);
  const lastRenderedImgRef = useRef<HTMLImageElement | null>(null);
  const lastRenderedOpacityRef = useRef(-1);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const robotProgressRef = useRef(0);

  // 1. Preload image sequence with controlled concurrency queue
  useEffect(() => {
    let isCancelled = false;
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    imagesRef.current = images;

    // Queue prioritizing keyframes first (every 4th), then in-between frames
    const queue: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i += 4) {
      if (i !== 0) queue.push(i);
    }
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (i % 4 !== 0) queue.push(i);
    }

    let activeCount = 0;

    const pumpQueue = () => {
      if (isCancelled) return;
      while (activeCount < MAX_CONCURRENT && queue.length > 0) {
        const nextIdx = queue.shift()!;
        if (images[nextIdx]) continue;
        activeCount++;
        loadSingleFrame(nextIdx);
      }
    };

    const schedulePump = () => {
      if (isCancelled) return;
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(pumpQueue, { timeout: 100 });
      } else {
        setTimeout(pumpQueue, 16);
      }
    };

    const loadSingleFrame = (index: number) => {
      const img = new Image();
      const frameNum = String(index + 1).padStart(4, '0');
      img.src = `/assets/robot_frames/frame_${frameNum}.jpg`;
      img.onload = () => {
        if (isCancelled) return;
        images[index] = img;
        activeCount--;
        pumpQueue();
      };
      img.onerror = () => {
        if (isCancelled) return;
        activeCount--;
        pumpQueue();
      };
    };

    // Priority 1: Initiate Frame 001 immediately on mount
    loadSingleFrame(0);

    // Priority 2: Dispatch paced queue for remaining frames
    schedulePump();

    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. Mouse Parallax Tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mousePosRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      mousePosRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. Dedicated GSAP ScrollTrigger tracking Section 3 onwards
  useEffect(() => {
    const targetEl = document.getElementById('vertical-sections-container');
    if (!targetEl) return;

    // Robot stands in the background at Frame 1 (visible, no pop-in glitch)
    robotProgressRef.current = 0;
    globalScrollState.globalProgress = 0;
    globalScrollState.globalOpacity = 0.85;

    const trigger = ScrollTrigger.create({
      trigger: targetEl,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      refreshPriority: -1,
      onUpdate: (self) => {
        // Before Section 3 (Pipeline) reaches top, keep robot locked on frame 0001
        if (self.scroll() < self.start) {
          robotProgressRef.current = 0;
          globalScrollState.globalProgress = 0;
          globalScrollState.globalOpacity = 0.85;
          return;
        }

        const p = Math.max(0, Math.min(1, self.progress));
        robotProgressRef.current = p;
        globalScrollState.globalProgress = p;
        globalScrollState.globalOpacity = 0.85;
      },
      onLeaveBack: () => {
        robotProgressRef.current = 0;
        globalScrollState.globalProgress = 0;
        globalScrollState.globalOpacity = 0.85;
      },
      onLeave: () => {
        robotProgressRef.current = 1;
        globalScrollState.globalProgress = 1;
        globalScrollState.globalOpacity = 0.85;
      },
      onRefresh: (self) => {
        globalScrollState.globalOpacity = 0.85;
        if (self.scroll() < self.start) {
          robotProgressRef.current = 0;
          globalScrollState.globalProgress = 0;
        } else {
          const p = Math.max(0, Math.min(1, self.progress));
          robotProgressRef.current = p;
          globalScrollState.globalProgress = p;
        }
      },
    });

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      trigger.kill();
    };
  }, []);

  // 3. Hardware-Accelerated Canvas Rendering Loop (60/120fps)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let cachedW = 0;
    let cachedH = 0;

    const render = () => {
      const opacity = globalScrollState.globalOpacity;
      // Authoritative frame progression directly from dedicated #vertical-sections-container ScrollTrigger
      const progress = robotProgressRef.current;

      // Mouse parallax smooth lerp
      const mp = mousePosRef.current;
      mp.x += (mp.targetX - mp.x) * 0.08;
      mp.y += (mp.targetY - mp.y) * 0.08;

      if (opacity <= 0.005) {
        if (lastRenderedOpacityRef.current > 0.005) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          lastRenderedOpacityRef.current = 0;
        }
        animId = requestAnimationFrame(render);
        return;
      }

      // Map global progress to frame index
      const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(progress * (TOTAL_FRAMES - 1))));

      // Handle Canvas DPI scaling efficiently
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = window.innerWidth;
      const displayH = window.innerHeight;

      if (cachedW !== displayW || cachedH !== displayH) {
        cachedW = displayW;
        cachedH = displayH;
        canvas.width = Math.round(displayW * dpr);
        canvas.height = Math.round(displayH * dpr);
      }

      // O(1) visual continuity lookup (prevents O(150) loop scans while maintaining visual continuity)
      const images = imagesRef.current;
      let img = images[targetFrame];
      if (!img) {
        img = lastRenderedImgRef.current || images[0];
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (img && img.complete && img.naturalWidth > 0) {
        lastRenderedImgRef.current = img;
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.globalAlpha = opacity;

        // Aspect ratio cover calculation
        const imgRatio = 1280 / 720;
        const canvasRatio = displayW / displayH;

        let renderW = displayW;
        let renderH = displayH;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          renderW = displayW;
          renderH = displayW / imgRatio;
          offsetY = (displayH - renderH) / 2;
        } else {
          renderH = displayH;
          renderW = displayH * imgRatio;
          offsetX = (displayW - renderW) / 2;
        }

        // Continuous scroll-driven vertical motion range: translateY(-8vh) -> translateY(+8vh)
        // 0% -> -8vh, 50% -> 0vh, 100% -> +8vh
        const continuousParallaxY = -0.08 * displayH + progress * (0.16 * displayH);
        const parallaxX = mp.x * 12;
        const parallaxY = mp.y * 9 + continuousParallaxY;

        // Draw image frame at integer pixel bounds (faster GPU blit)
        ctx.drawImage(
          img,
          Math.round(offsetX + parallaxX),
          Math.round(offsetY + parallaxY),
          Math.round(renderW),
          Math.round(renderH)
        );

        // Subtle Cyber HUD scanning line
        const scanY = ((Date.now() % 3400) / 3400) * displayH;
        const scanGrad = ctx.createLinearGradient(0, scanY - 35, 0, scanY + 35);
        scanGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
        scanGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.08)');
        scanGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, Math.round(scanY - 35), displayW, 70);

        // Subtle radial vignette for text contrast & dark cyber immersion
        const vignette = ctx.createRadialGradient(
          displayW / 2, displayH / 2, displayW * 0.15,
          displayW / 2, displayH / 2, displayW * 0.75
        );
        vignette.addColorStop(0, 'rgba(6, 8, 13, 0.05)');
        vignette.addColorStop(0.65, 'rgba(6, 8, 13, 0.45)');
        vignette.addColorStop(1, 'rgba(6, 8, 13, 0.85)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, displayW, displayH);

        ctx.restore();
      }

      lastRenderedFrameRef.current = targetFrame;
      lastRenderedOpacityRef.current = opacity;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="global-robotic-face-layer"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        maxWidth: '100%',
        height: '100dvh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}
