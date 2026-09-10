'use client';

import { useRef, useEffect } from 'react';
import { ShieldAlert, Image as ImageIcon, Mic } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProblemSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Background Video Playback Controller
  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    // Explicitly configure DOM video properties for reliable autoplay & loop
    video.defaultMuted = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    // Direct MP4 source
    const videoSource = '/assets/section2-bg.mp4';
    if (video.src !== window.location.origin + videoSource && !video.src.endsWith(videoSource)) {
      video.src = videoSource;
    }

    let isSectionVisible = false;

    const playVideo = () => {
      if (video.paused && !document.hidden) {
        video.play().catch(() => {});
      }
    };

    const pauseVideo = () => {
      if (!video.paused) {
        video.pause();
      }
    };

    // Viewport IntersectionObserver: plays when visible, pauses when out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isSectionVisible = true;
            playVideo();
          } else {
            isSectionVisible = false;
            pauseVideo();
          }
        });
      },
      { threshold: [0, 0.1, 0.5] }
    );

    observer.observe(wrapper);

    // Infinite loop safeguard
    const handleEnded = () => {
      video.currentTime = 0;
      playVideo();
    };
    video.addEventListener('ended', handleEnded);

    // Page visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseVideo();
      } else if (isSectionVisible) {
        playVideo();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // User gesture unlock
    const handleFirstGesture = () => {
      playVideo();
    };
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true, passive: true });

    return () => {
      observer.disconnect();
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
    };
  }, []);

  return (
    <div className="section-problem-wrapper" id="problem-section" ref={wrapperRef}>
      {/* Video Background Layer (Full coverage, loop) */}
      <div className="section-problem-video-layer" aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="section-problem-video"
          id="problem-bg-video"
          src="/assets/section2-bg.mp4"
        >
          <source src="/assets/section2-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Soft Ambient Scrim for Legibility */}
      <div className="section-problem-scrim" aria-hidden="true" />

      {/* Inverted Section 2 Content */}
      <section className="page-section section-inverted" id="problem-content" ref={sectionRef}>
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 'clamp(28px, 4vh, 40px)' }}>
          <div className="section-badge" id="problem-badge" style={{ alignSelf: 'flex-start' }}>
            THE PROBLEM
          </div>
          <h2 className="section-title" id="problem-title" style={{ margin: 0 }}>
            Seeing isn’t always believing.
          </h2>
          <p className="section-subtitle" id="problem-subtitle" style={{ maxWidth: '820px' }}>
            Deepfakes can make anyone appear to{' '}
            <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>say or do things they never did</strong>
            —making misinformation harder to spot and trust harder to earn.
          </p>
        </div>

        {/* 3 Modality Vector Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '24px',
            marginBottom: 'clamp(28px, 4vh, 40px)',
          }}
          id="problem-vectors-grid"
        >
          {/* Vector 1: Fake Faces */}
          <article className="forensic-card" id="vector-image-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                Modality // Visual
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(255, 255, 255, 0.22)',
                }}
              >
                <ImageIcon size={18} />
              </div>
            </div>

            <h3
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: '17px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                color: '#FFFFFF',
                marginBottom: '10px',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
              id="vector-image-title"
            >
              Fake Faces
            </h3>
            <p
              style={{
                fontSize: '13.5px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.82)',
                marginBottom: '20px',
              }}
              id="vector-image-desc"
            >
              Generative AI models and GAN face-swaps can fabricate hyper-realistic portraits, synthetic expressions, and artificial identities that easily deceive human eyes.
            </p>

            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.14)',
                paddingTop: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontFamily: 'var(--f-display)' }}>
                  Threat Vector
                </span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>Visual Manipulation</span>
              </div>
            </div>
          </article>

          {/* Vector 2: Fake Voices */}
          <article className="forensic-card" id="vector-audio-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                Modality // Audio
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(255, 255, 255, 0.22)',
                }}
              >
                <Mic size={18} />
              </div>
            </div>

            <h3
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: '17px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                color: '#FFFFFF',
                marginBottom: '10px',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
              id="vector-audio-title"
            >
              Fake Voices
            </h3>
            <p
              style={{
                fontSize: '13.5px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.82)',
                marginBottom: '20px',
              }}
              id="vector-audio-desc"
            >
              Neural voice cloning replicates authentic vocal timbre, accent, and inflection from brief audio samples—enabling convincing impersonations and fraud.
            </p>

            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.14)',
                paddingTop: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontFamily: 'var(--f-display)' }}>
                  Threat Vector
                </span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>Synthetic Voice Cloning</span>
              </div>
            </div>
          </article>

          {/* Vector 3: Real Consequences */}
          <article className="forensic-card" id="vector-consequences-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                Impact // Threat
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(255, 255, 255, 0.22)',
                }}
              >
                <ShieldAlert size={18} />
              </div>
            </div>

            <h3
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: '17px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                color: '#FFFFFF',
                marginBottom: '10px',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
              id="vector-consequences-title"
            >
              Real Consequences
            </h3>
            <p
              style={{
                fontSize: '13.5px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.82)',
                marginBottom: '20px',
              }}
              id="vector-consequences-desc"
            >
              From social media and scams to identity theft and misinformation, detecting manipulated content is becoming increasingly difficult as trust erodes.
            </p>

            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.14)',
                paddingTop: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontFamily: 'var(--f-display)' }}>
                  Societal Impact
                </span>
                <span style={{ fontWeight: 600, color: '#FF5252' }}>Scams &amp; Misinformation</span>
              </div>
            </div>
          </article>
        </div>

        {/* Threat Summary Callout Banner */}
        <div
          className="forensic-card"
          id="problem-stats-banner"
          style={{
            background: 'rgba(8, 11, 17, 0.52)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.22)',
            padding: 'clamp(24px, 3.5vh, 36px)',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 'clamp(20px, 2.6vw, 30px)',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: '#FFFFFF',
              textShadow: '0 0 24px rgba(255, 255, 255, 0.35)',
              lineHeight: 1.25,
            }}
            id="problem-callout-heading"
          >
            Fake faces. Fake voices. Real consequences.
          </div>
          <p
            style={{
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              lineHeight: 1.65,
              color: 'rgba(255, 255, 255, 0.85)',
              margin: 0,
              maxWidth: '900px',
            }}
            id="problem-callout-desc"
          >
            From social media and scams to identity theft and misinformation, detecting manipulated content is becoming increasingly difficult.
          </p>
        </div>
      </section>
    </div>
  );
}

