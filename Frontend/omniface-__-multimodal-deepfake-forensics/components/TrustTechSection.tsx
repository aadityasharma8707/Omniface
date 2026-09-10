'use client';

import { Layers, GitMerge, ShieldCheck, Database, ArrowDown, Eye, Volume2, Clock } from 'lucide-react';

export default function TrustTechSection() {
  return (
    <section className="page-section" id="trust-tech-section" style={{ position: 'relative', zIndex: 10 }}>
      {/* Section Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'clamp(20px, 3vh, 32px)' }}>
        <h2 className="section-title" id="trust-tech-title">
          RESEARCH-GRADE ARCHITECTURE &amp; BENCHMARK RIGOR
        </h2>
        <p className="section-subtitle" id="trust-tech-subtitle">
          Built for measurable, reliable detection.
        </p>
      </div>

      {/* Main Architecture & Fusion Flow Card */}
      <div
        className="forensic-card"
        id="architecture-flow-card"
        style={{
          padding: 'clamp(20px, 3vh, 32px)',
          marginBottom: 'clamp(20px, 3vh, 28px)',
          border: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background glow accent */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
            borderRadius: '50%',
          }}
        />

        {/* Section 1: Modular Architecture */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgba(0, 229, 255, 0.12)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Layers size={15} color="#00E5FF" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: 'clamp(14px, 1.8vw, 17px)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                textTransform: 'uppercase',
              }}
            >
              MODULAR ARCHITECTURE
            </h3>
          </div>
          <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.5, marginLeft: '38px', marginBottom: '16px' }}>
            Independent visual, audio, and temporal analysis modules.
          </p>

          {/* 3 Independent Modality Sub-modules */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '12px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              <Eye size={18} color="#00E5FF" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: '11px', fontWeight: 700, color: '#00E5FF', letterSpacing: '0.05em' }}>
                  VISUAL MODULE
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px' }}>
                  Spatial &amp; Artifact Inspection
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              <Volume2 size={18} color="#00F5A0" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: '11px', fontWeight: 700, color: '#00F5A0', letterSpacing: '0.05em' }}>
                  AUDIO MODULE
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px' }}>
                  Acoustic &amp; Spectral Forensics
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              <Clock size={18} color="#00E5FF" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: '11px', fontWeight: 700, color: '#00E5FF', letterSpacing: '0.05em' }}>
                  TEMPORAL MODULE
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px' }}>
                  Inter-Frame Coherence
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transition Connector */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '14px 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(0, 229, 255, 0.08)',
              border: '1px solid rgba(0, 229, 255, 0.2)',
            }}
          >
            <ArrowDown size={14} color="#00E5FF" />
            <span style={{ fontSize: '10px', fontFamily: 'var(--f-display)', color: '#00E5FF', letterSpacing: '0.08em', fontWeight: 700 }}>
              CROSS-MODAL CONVERGENCE
            </span>
            <ArrowDown size={14} color="#00E5FF" />
          </div>
        </div>

        {/* Section 2: Multimodal Fusion (Visually Prominent Final Stage) */}
        <div
          id="multimodal-fusion-stage"
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.14) 0%, rgba(0, 245, 160, 0.12) 100%)',
            border: '2px solid #00E5FF',
            borderRadius: '14px',
            padding: 'clamp(18px, 2.5vh, 26px)',
            boxShadow: '0 0 28px rgba(0, 229, 255, 0.22), inset 0 0 20px rgba(0, 245, 160, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(0, 229, 255, 0.2)',
                  border: '1.5px solid #00E5FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(0, 229, 255, 0.4)',
                }}
              >
                <GitMerge size={18} color="#00E5FF" />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--f-display)',
                    fontSize: 'clamp(16px, 2vw, 20px)',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    textShadow: '0 0 12px rgba(0, 229, 255, 0.5)',
                  }}
                >
                  MULTIMODAL FUSION
                </h3>
              </div>
            </div>

            <div
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '4px 10px',
                borderRadius: '6px',
                background: '#00E5FF',
                color: '#06080D',
                textTransform: 'uppercase',
              }}
            >
              FINAL FUSION LAYER
            </div>
          </div>

          <p
            style={{
              fontSize: '14px',
              color: '#FFFFFF',
              fontWeight: 500,
              lineHeight: 1.6,
              marginLeft: '42px',
              maxWidth: '750px',
            }}
          >
            A dedicated fusion layer combines evidence across modalities.
          </p>
        </div>
      </div>

      {/* Evaluation & Reproducibility Pillars */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '20px',
        }}
        id="rigor-pillars-grid"
      >
        {/* Pillar 1: Robust Evaluation */}
        <div className="forensic-card" id="tech-pillar-robust-eval" style={{ padding: 'clamp(18px, 2.5vh, 24px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgba(0, 245, 160, 0.12)',
                border: '1px solid rgba(0, 245, 160, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={16} color="#00F5A0" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: '14px',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
              }}
            >
              ROBUST EVALUATION
            </h3>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.75)', marginLeft: '38px' }}>
            Models are evaluated using established forensic benchmarks and performance metrics.
          </p>
        </div>

        {/* Pillar 2: Reproducible Results */}
        <div className="forensic-card" id="tech-pillar-reproducible" style={{ padding: 'clamp(18px, 2.5vh, 24px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'rgba(0, 229, 255, 0.12)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Database size={16} color="#00E5FF" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: '14px',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
              }}
            >
              REPRODUCIBLE RESULTS
            </h3>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.75)', marginLeft: '38px' }}>
            Consistent evaluation across diverse manipulated and authentic media.
          </p>
        </div>
      </div>
    </section>
  );
}
