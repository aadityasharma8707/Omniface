'use client';

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';

const TOTAL_FRAMES = 240;

export interface RoboticFaceStageHandle {
  setProgress: (progress: number) => void;
}

interface RoboticFaceStageProps {
  activeSection?: string;
  progress?: number;
  onFrameUpdate?: (frameIndex: number, progress: number) => void;
}

const RoboticFaceStage = forwardRef<RoboticFaceStageHandle, RoboticFaceStageProps>(
  function RoboticFaceStage({ progress: initialProgress, onFrameUpdate }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
    const targetFrameRef = useRef(0);
    const currentFrameRef = useRef(0);
    const scrollProgressRef = useRef(initialProgress ?? 0);
    const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
    const [, setLoadedPercent] = useState(0);

    // Expose imperative setProgress method
    useImperativeHandle(ref, () => ({
      setProgress: (p: number) => {
        const clampedP = Math.max(0, Math.min(1, p));
        scrollProgressRef.current = clampedP;
        const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(clampedP * (TOTAL_FRAMES - 1))));
        targetFrameRef.current = targetFrame;
        if (onFrameUpdate) {
          onFrameUpdate(targetFrame, clampedP);
        }
      },
    }));

    // Update if progress prop changes
    useEffect(() => {
      if (initialProgress !== undefined) {
        const clampedP = Math.max(0, Math.min(1, initialProgress));
        scrollProgressRef.current = clampedP;
        targetFrameRef.current = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(clampedP * (TOTAL_FRAMES - 1))));
      }
    }, [initialProgress]);

    // 1. Progressive Image Sequence Preloader
    useEffect(() => {
      const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
      imagesRef.current = images;

      let loadedCount = 0;

      const loadFrame = (index: number): Promise<void> => {
        return new Promise((resolve) => {
          if (images[index]) {
            resolve();
            return;
          }
          const img = new Image();
          const frameNum = String(index + 1).padStart(3, '0');
          img.src = `/assets/robot_frames/ezgif-frame-${frameNum}.png`;
          img.onload = () => {
            images[index] = img;
            loadedCount++;
            setLoadedPercent(Math.round((loadedCount / TOTAL_FRAMES) * 100));
            resolve();
          };
          img.onerror = () => {
            resolve();
          };
        });
      };

      // Tier 1: Load every 4th frame (keyframes) immediately for instant scrub
      const tier1Promises: Promise<void>[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i += 4) {
        tier1Promises.push(loadFrame(i));
      }

      Promise.all(tier1Promises).then(() => {
        // Tier 2: Load remaining frames in background
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          if (!images[i]) {
            loadFrame(i);
          }
        }
      });
    }, []);

    // 2. Mouse Tracking with subtle spring physics
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const nx = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
        const ny = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
        mousePosRef.current.targetX = nx;
        mousePosRef.current.targetY = ny;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // 3. Ultra-smooth Canvas Render Loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      let animId: number;

      const render = () => {
        // Smooth frame interpolation (Lerp)
        const diff = targetFrameRef.current - currentFrameRef.current;
        currentFrameRef.current += diff * 0.15;
        const frameIdx = Math.round(currentFrameRef.current);
        const clampedIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIdx));

        // Smooth mouse parallax lerp
        const mp = mousePosRef.current;
        mp.x += (mp.targetX - mp.x) * 0.06;
        mp.y += (mp.targetY - mp.y) * 0.06;

        // Handle Canvas DPI scaling
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        const displayWidth = rect.width;
        const displayHeight = rect.height;

        if (displayWidth > 0 && displayHeight > 0) {
          if (canvas.width !== Math.round(displayWidth * dpr) || canvas.height !== Math.round(displayHeight * dpr)) {
            canvas.width = Math.round(displayWidth * dpr);
            canvas.height = Math.round(displayHeight * dpr);
          }
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Find best available frame (exact frame or closest loaded keyframe)
        const images = imagesRef.current;
        let img = images[clampedIdx];
        if (!img) {
          // Find nearest loaded frame
          for (let offset = 1; offset < 24; offset++) {
            if (images[clampedIdx - offset]) {
              img = images[clampedIdx - offset];
              break;
            }
            if (images[clampedIdx + offset]) {
              img = images[clampedIdx + offset];
              break;
            }
          }
        }

        if (img && img.complete && img.naturalWidth > 0 && displayWidth > 0 && displayHeight > 0) {
          ctx.save();
          ctx.scale(dpr, dpr);

          // Aspect ratio cover calculation to fill the entire viewport background
          const imgRatio = 1280 / 720;
          const canvasRatio = displayWidth / displayHeight;

          let renderW = displayWidth;
          let renderH = displayHeight;
          let offsetX = 0;
          let offsetY = 0;

          if (canvasRatio > imgRatio) {
            renderW = displayWidth;
            renderH = displayWidth / imgRatio;
            offsetY = (displayHeight - renderH) / 2;
          } else {
            renderH = displayHeight;
            renderW = displayHeight * imgRatio;
            offsetX = (displayWidth - renderW) / 2;
          }

          // Apply subtle mouse parallax tilt & translation
          const parallaxX = mp.x * 14;
          const parallaxY = mp.y * 10;

          // Draw robotic face frame
          ctx.drawImage(
            img,
            Math.round(offsetX + parallaxX),
            Math.round(offsetY + parallaxY),
            Math.round(renderW),
            Math.round(renderH)
          );

          // Cybernetic HUD scan line subtle sheen
          const scanY = ((Date.now() % 3200) / 3200) * displayHeight;
          const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
          grad.addColorStop(0, 'rgba(0, 229, 255, 0)');
          grad.addColorStop(0.5, 'rgba(0, 229, 255, 0.12)');
          grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, Math.round(scanY - 40), displayWidth, 80);

          // Cybernetic background vignette for contrast and readability
          const vignette = ctx.createRadialGradient(
            displayWidth / 2, displayHeight / 2, displayWidth * 0.15,
            displayWidth / 2, displayHeight / 2, displayWidth * 0.75
          );
          vignette.addColorStop(0, 'rgba(6, 8, 13, 0.1)');
          vignette.addColorStop(0.65, 'rgba(6, 8, 13, 0.55)');
          vignette.addColorStop(1, 'rgba(6, 8, 13, 0.88)');
          ctx.fillStyle = vignette;
          ctx.fillRect(0, 0, displayWidth, displayHeight);

          ctx.restore();
        }

        animId = requestAnimationFrame(render);
      };

      animId = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(animId);
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className="robotic-face-canvas-wrap"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <canvas
          ref={canvasRef}
          className="robotic-face-canvas"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </div>
    );
  }
);

export default RoboticFaceStage;
