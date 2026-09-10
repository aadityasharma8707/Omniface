'use client';

import { useState } from 'react';
import { ShieldCheck, Copy, Check, ArrowUp, Terminal } from 'lucide-react';

interface CtaFooterProps {
  onScrollTo: (id: string) => void;
}

export default function CtaFooterSection({ onScrollTo }: CtaFooterProps) {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const pythonSnippet = `from omniface import ForensicEngine, Modality

# Initialize multimodal SigLIP2 + rPPG + Wav2Vec2 forensic pipeline
engine = ForensicEngine(model="omniface-multimodal-v2", device="cuda:0")

# Analyze multi-signal media: Image, Video or Audio
report = await engine.analyze(
    media="suspect_evidence.mp4",
    modalities=[Modality.VIDEO, Modality.AUDIO],
    extract_rppg=True,
    generate_gradcam=True
)

print(f"Verdict: {report.verdict}")             # e.g. SYNTHETIC_DEEPFAKE
print(f"Confidence: {report.confidence:.1%}")       # e.g. 96.4%
print(f"Heartbeat: {report.rppg_pulse_bpm} BPM")    # e.g. 0.0 BPM (Flatline)
print(f"Audit Hash: {report.sha256}")`;

  const copyCode = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <footer className="page-section" id="cta-footer-section" style={{ position: 'relative', zIndex: 10, paddingBottom: '48px' }}>
      {/* Primary CTA Block */}
      <div
        className="forensic-card"
        id="cta-main-card"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.05) 0%, rgba(10, 16, 26, 0.45) 45%, rgba(6, 10, 16, 0.60) 100%)',
          border: 'none',
          padding: 'clamp(32px, 6vh, 56px)',
          marginBottom: '64px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '720px', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: '11px', color: '#00E5FF', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
            READY TO FIND OUT WHAT&apos;S REAL?
          </div>
          <h2
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              lineHeight: 1.1,
              letterSpacing: '0.02em',
              marginBottom: '16px',
              color: '#FFFFFF',
              textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
            }}
            id="cta-title"
          >
            START DEEPFAKE ANALYSIS NOW
          </h2>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.78)',
              margin: '0 auto',
              maxWidth: '600px',
            }}
            id="cta-subtitle"
          >
            Deploy OmniFace multimodal deepfake forensics across your newsroom, KYC identity verification, or digital evidence pipeline using our lightweight Python SDK or interactive web suite.
          </p>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '36px',
          }}
        >
          <button
            type="button"
            id="cta-try-demo-btn"
            onClick={() => onScrollTo('live-demo-section')}
            style={{
              backgroundColor: '#00E5FF',
              color: '#000000',
              border: 'none',
              borderRadius: '100px',
              padding: '12px 28px',
              fontFamily: 'var(--f-display)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.backgroundColor = '#00E5FF';
            }}
          >
            <ShieldCheck size={16} />
            <span>START ANALYSIS</span>
          </button>

          <button
            type="button"
            id="cta-back-to-top-btn"
            onClick={() => onScrollTo('cyber-ronin-hero')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '100px',
              padding: '12px 24px',
              fontFamily: 'var(--f-display)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00E5FF';
              e.currentTarget.style.color = '#00E5FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            <ArrowUp size={14} />
            <span>Back to Top</span>
          </button>
        </div>

        {/* Python SDK Code Block */}
        <div
          style={{
            width: '100%',
            maxWidth: '700px',
            background: 'rgba(3, 4, 7, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={14} color="#00E5FF" />
              <span style={{ fontFamily: 'monospace', fontSize: '11.5px', color: '#00E5FF' }}>
                quickstart_forensics.py
              </span>
            </div>
            <button
              type="button"
              onClick={copyCode}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {copiedCode ? <Check size={13} color="#00F5A0" /> : <Copy size={13} />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              padding: '16px',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: 'rgba(255, 255, 255, 0.85)',
              overflowX: 'auto',
              lineHeight: 1.6,
            }}
          >
            <code>{pythonSnippet}</code>
          </pre>
        </div>
      </div>

      {/* Footer Bottom Meta */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        <div>
          © 2026 OmniFace Intelligence Systems. Research-Grade Multimodal Forensics.
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>SIGLIP2 // VIT</span>
          <span>•</span>
          <span>RPPG PULSE</span>
          <span>•</span>
          <span>WAV2VEC2</span>
        </div>
      </div>
    </footer>
  );
}
