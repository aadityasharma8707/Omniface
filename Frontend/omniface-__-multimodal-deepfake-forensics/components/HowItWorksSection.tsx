'use client';

import { UploadCloud, Cpu, Scan, Binary, GitMerge, ShieldCheck } from 'lucide-react';

export default function HowItWorksSection() {
  const pipelineStages = [
    {
      num: '01',
      title: '01 — INPUT',
      desc: 'Image • Video • Audio',
      icon: UploadCloud,
      color: '#00E5FF',
      isFusion: false,
    },
    {
      num: '02',
      title: '02 — PREPROCESSING',
      desc: 'Frame & audio feature extraction',
      icon: Cpu,
      color: '#00E5FF',
      isFusion: false,
    },
    {
      num: '03',
      title: '03 — MODAL ANALYSIS',
      desc: 'Visual • Audio • Temporal analysis',
      icon: Scan,
      color: '#38BDF8',
      isFusion: false,
    },
    {
      num: '04',
      title: '04 — FEATURE EXTRACTION',
      desc: 'Deep forensic representations',
      icon: Binary,
      color: '#818CF8',
      isFusion: false,
    },
    {
      num: '05',
      title: '05 — FUSION LAYER',
      desc: 'Combines multimodal evidence',
      icon: GitMerge,
      color: '#00E5FF',
      isFusion: true,
      highlightTag: 'MULTIMODAL FUSION',
    },
    {
      num: '06',
      title: '06 — FINAL VERDICT',
      desc: 'Real • Fake + Confidence Score',
      icon: ShieldCheck,
      color: '#00F5A0',
      isFusion: false,
    },
  ];

  return (
    <section className="page-section" id="how-it-works-section" style={{ position: 'relative', zIndex: 10 }}>
      {/* Section Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'clamp(24px, 3.5vh, 36px)' }}>
        <h2 className="section-title" id="how-it-works-title" style={{ margin: 0 }}>
          END-TO-END MULTIMODAL FORENSIC PIPELINE
        </h2>
        <p className="section-subtitle" id="how-it-works-subtitle" style={{ margin: 0, color: 'rgba(255, 255, 255, 0.85)' }}>
          Multiple signals. One unified verdict.
        </p>
      </div>

      {/* 6 Stage Pipeline Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(14px, 2vh, 20px)',
        }}
        id="pipeline-stages-grid"
      >
        {pipelineStages.map((stage) => {
          const IconComponent = stage.icon;
          return (
            <div
              key={stage.num}
              className="forensic-card"
              id={`pipeline-stage-${stage.num}`}
              style={{
                background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.04) 0%, rgba(10, 16, 26, 0.35) 45%, rgba(6, 10, 16, 0.48) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 'clamp(20px, 2.6vh, 26px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Row: Tag / Badge & Icon */}
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
                    color: '#00E5FF',
                    border: '1px solid rgba(0, 229, 255, 0.6)',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    background: 'rgba(0, 229, 255, 0.14)',
                    boxShadow: '0 0 10px rgba(0, 229, 255, 0.15)',
                  }}
                >
                  {stage.isFusion ? stage.highlightTag : `STAGE // ${stage.num}`}
                </span>

                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(0, 229, 255, 0.15)',
                    border: '1px solid rgba(0, 229, 255, 0.5)',
                    color: '#00E5FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 16px rgba(0, 229, 255, 0.25)',
                  }}
                >
                  <IconComponent size={18} />
                </div>
              </div>

              {/* Stage Title */}
              <h3
                style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  marginBottom: '8px',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                }}
              >
                {stage.title}
              </h3>

              {/* Stage Description / Content */}
              <p
                style={{
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontWeight: 500,
                  margin: 0,
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                }}
              >
                {stage.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
