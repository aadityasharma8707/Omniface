'use client';

import { 
  Layers,
  ScanFace,
  AudioWaveform, 
  Activity, 
  GitMerge, 
  ShieldCheck
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      id: 'feature-multimodal-analysis',
      icon: <Layers size={20} />,
      tag: 'MODALITY // 01',
      title: 'MULTIMODAL ANALYSIS',
      description: 'Analyze visual, audio, and temporal signals together.',
      color: '#00E5FF',
    },
    {
      id: 'feature-facial-forensics',
      icon: <ScanFace size={20} />,
      tag: 'FACIAL // 02',
      title: 'FACIAL FORENSICS',
      description: 'Detect subtle facial artifacts and manipulation patterns.',
      color: '#00E5FF',
    },
    {
      id: 'feature-audio-forensics',
      icon: <AudioWaveform size={20} />,
      tag: 'AUDIO // 03',
      title: 'AUDIO FORENSICS',
      description: 'Identify inconsistencies and synthetic voice characteristics.',
      color: '#38BDF8',
    },
    {
      id: 'feature-temporal-analysis',
      icon: <Activity size={20} />,
      tag: 'TEMPORAL // 04',
      title: 'TEMPORAL ANALYSIS',
      description: 'Examine frame-to-frame inconsistencies in video.',
      color: '#818CF8',
    },
    {
      id: 'feature-multimodal-fusion',
      icon: <GitMerge size={20} />,
      tag: 'FUSION // 05',
      title: 'MULTIMODAL FUSION',
      description: 'Combine evidence from multiple modalities for a stronger verdict.',
      color: '#00E5FF',
    },
    {
      id: 'feature-confidence-scoring',
      icon: <ShieldCheck size={20} />,
      tag: 'VERDICT // 06',
      title: 'CONFIDENCE SCORING',
      description: 'Get a clear Real/Fake prediction with an AI confidence score.',
      color: '#00F5A0',
    },
  ];

  return (
    <section className="page-section" id="features-section" style={{ position: 'relative', zIndex: 10 }}>
      {/* Section Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'clamp(20px, 3vh, 32px)' }}>
        <h2 className="section-title" id="features-title" style={{ margin: 0 }}>
          POWERFUL FORENSIC FEATURES
        </h2>
        <p className="section-subtitle" id="features-subtitle" style={{ margin: 0, color: 'rgba(255, 255, 255, 0.85)' }}>
          Built to detect what the eye can’t.
        </p>
      </div>

      {/* Responsive Feature Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(14px, 2vh, 20px)',
        }}
        id="features-grid"
      >
        {features.map((item) => (
          <article
            className="forensic-card"
            key={item.id}
            id={item.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'clamp(18px, 2.4vh, 24px)',
            }}
          >
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
                  color: item.color,
                  border: `1px solid ${item.color}80`,
                  borderRadius: '8px',
                  padding: '4px 10px',
                  background: `${item.color}1A`,
                  boxShadow: `0 0 10px ${item.color}26`,
                }}
              >
                {item.tag}
              </span>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: `${item.color}20`,
                  border: `1px solid ${item.color}66`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 16px ${item.color}40`,
                }}
              >
                {item.icon}
              </div>
            </div>

            <h3
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: '16px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                marginBottom: '8px',
                color: '#FFFFFF',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              }}
            >
              {item.title}
            </h3>

            <p
              style={{
                fontSize: '13.5px',
                lineHeight: 1.55,
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: 500,
                margin: 0,
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
              }}
            >
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
