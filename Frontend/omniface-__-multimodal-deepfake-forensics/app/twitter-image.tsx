import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'OmniFace // Multimodal Deepfake Forensics & AI Detection';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#06080D',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow Gradients */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 229, 255, 0.15)',
                border: '2px solid rgba(0, 229, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00E5FF',
                fontSize: '28px',
                fontWeight: 900,
              }}
            >
              ⬡
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '0.1em', color: '#FFFFFF' }}>
                OMNIFACE
              </span>
              <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#00E5FF', fontWeight: 700 }}>
                MULTIMODAL DEEPFAKE FORENSICS
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '100px',
              backgroundColor: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              color: '#00E5FF',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            ● LIVE FORENSIC NETWORK
          </div>
        </div>

        {/* Center: Biometric HUD and Headlines */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '680px' }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#00E5FF',
                letterSpacing: '0.2em',
                marginBottom: '12px',
              }}
            >
              NEXT-GEN AI MEDIA ATTESTATION
            </div>
            <div
              style={{
                fontSize: '52px',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
              }}
            >
              VERIFY WHAT&apos;S REAL.
            </div>
            <div
              style={{
                fontSize: '19px',
                color: 'rgba(255, 255, 255, 0.72)',
                marginTop: '16px',
                lineHeight: 1.4,
              }}
            >
              Real-time biological pulse extraction, spatial noise variance, and cross-modal neural forensics.
            </div>
          </div>

          {/* Biometric HUD card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '330px',
              padding: '24px',
              borderRadius: '16px',
              backgroundColor: 'rgba(13, 17, 26, 0.88)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', color: '#00E5FF', fontWeight: 800 }}>VERDICT ATTESTATION</span>
              <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)' }}>SHA-256</span>
            </div>
            <div style={{ fontSize: '30px', fontWeight: 900, color: '#10B981', marginBottom: '8px' }}>
              98.8% AUTHENTIC
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '16px' }}>
              rPPG Sinus Rhythm: 72 BPM | Normal Bayer CFA Profile
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ flex: 1, height: '4px', backgroundColor: '#10B981', borderRadius: '2px' }} />
              <div style={{ flex: 1, height: '4px', backgroundColor: '#10B981', borderRadius: '2px' }} />
              <div style={{ flex: 1, height: '4px', backgroundColor: '#10B981', borderRadius: '2px' }} />
              <div style={{ flex: 1, height: '4px', backgroundColor: '#00E5FF', borderRadius: '2px' }} />
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', gap: '36px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
              VIDEO <strong style={{ color: '#FFFFFF' }}>• MP4 / WEBM / MKV</strong>
            </span>
            <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
              AUDIO <strong style={{ color: '#FFFFFF' }}>• WAV / MP3 / FLAC</strong>
            </span>
            <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
              IMAGE <strong style={{ color: '#FFFFFF' }}>• JPG / PNG / WEBP</strong>
            </span>
          </div>
          <span style={{ fontSize: '13px', color: '#00E5FF', fontWeight: 700 }}>
            @OmniFaceAI
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
