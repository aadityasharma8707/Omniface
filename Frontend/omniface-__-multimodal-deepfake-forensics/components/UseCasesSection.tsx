'use client';

import { Newspaper, Building2, Scale, Globe } from 'lucide-react';

export default function UseCasesSection() {
  const useCases = [
    {
      id: 'usecase-journalism',
      icon: <Newspaper size={20} />,
      tag: 'FACT-CHECKING & MEDIA',
      title: 'Digital Journalism & Breaking Newsrooms',
      description: 'Rapid verification of viral citizen videos, leaked audio recordings, and political press footage before public dissemination under tight news deadlines.',
      outcome: 'Mitigates defamation lawsuits and safeguards editorial credibility.',
    },
    {
      id: 'usecase-fintech',
      icon: <Building2 size={20} />,
      tag: 'KYC & IDENTITY SECURITY',
      title: 'FinTech Onboarding & Voice Authorization',
      description: 'Defends bank customer onboarding against virtual webcam video injection, synthetic ID documents, and voice-cloned wire transfer authorizations.',
      outcome: 'Reduces account takeover and synthetic identity fraud by 99.4%.',
    },
    {
      id: 'usecase-legal',
      icon: <Scale size={20} />,
      tag: 'COURTROOM & FORENSICS',
      title: 'Judicial Evidence & Forensic Investigation',
      description: 'Produces court-admissible audit dossiers containing frame-by-frame anomaly timelines, pixel heatmaps, and SHA-256 cryptographic chain-of-custody hashes.',
      outcome: 'Provides rigorous evidentiary proof against deepfake allegations.',
    },
    {
      id: 'usecase-social',
      icon: <Globe size={20} />,
      tag: 'PLATFORM MODERATION',
      title: 'Content Networks & Broadcast Moderation',
      description: 'Automated batch ingestion and real-time live-stream inspection running sub-120ms inferences across high-volume video and audio submission queues.',
      outcome: 'Prevents non-consensual imagery and synthetic disinformation at scale.',
    },
  ];

  return (
    <section className="page-section" id="use-cases-section" style={{ position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'clamp(20px, 3vh, 32px)' }}>
        <h2 className="section-title" id="use-cases-title">
          DEPLOYED WHERE MEDIA INTEGRITY IS MISSION-CRITICAL
        </h2>
        <p className="section-subtitle" id="use-cases-subtitle">
          Tailored forensic workflows designed for investigative reporters, financial fraud analysts, forensic examiners, and trust & safety teams.
        </p>
      </div>

      {/* 4 Use Case Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: 'clamp(14px, 2vh, 20px)',
        }}
        id="use-cases-grid"
      >
        {useCases.map((uc) => (
          <article className="forensic-card" key={uc.id} id={uc.id}>
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
                {uc.tag}
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
                {uc.icon}
              </div>
            </div>

            <h3
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: '16px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                marginBottom: '8px',
                color: '#FFFFFF',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              }}
            >
              {uc.title}
            </h3>
            <p
              style={{
                fontSize: '13px',
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: 500,
                marginBottom: '16px',
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
              }}
            >
              {uc.description}
            </p>

            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '12px',
                fontSize: '12px',
                color: '#00F5A0',
                fontWeight: 600,
              }}
            >
              Impact: <span style={{ fontWeight: 400, color: 'rgba(255, 255, 255, 0.8)' }}>{uc.outcome}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
