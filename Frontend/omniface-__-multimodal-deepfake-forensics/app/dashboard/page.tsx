'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  UploadCloud, 
  Video, 
  Image as ImageIcon, 
  Music, 
  Trash2, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Cpu, 
  Layers, 
  FileText, 
  Clock, 
  ArrowRight, 
  Download, 
  RefreshCw,
  Info,
  ShieldCheck,
  Zap,
  Activity,
  Maximize2
} from 'lucide-react';
import { analysisService, AnalysisResult } from '@/lib/api/analysis';
import { historyService } from '@/lib/api/history';
import { reportService } from '@/lib/api/reports';
import Link from 'next/link';

type MediaType = 'video' | 'image' | 'audio';

const MEDIA_CONFIGS = {
  video: {
    label: 'VIDEO',
    icon: Video,
    accept: 'video/mp4,video/quicktime,video/webm,video/x-matroska',
    extensions: 'MP4, MOV, WEBM, MKV',
    maxSizeMB: 150,
    hint: 'Face-swaps, lip-sync, expression reenactment, GAN artefacts',
  },
  image: {
    label: 'IMAGE',
    icon: ImageIcon,
    accept: 'image/jpeg,image/png,image/webp,image/tiff',
    extensions: 'JPG, PNG, WEBP, TIFF',
    maxSizeMB: 50,
    hint: 'Diffusion synthesis, Midjourney/DALL-E artifacts, face edits',
  },
  audio: {
    label: 'AUDIO',
    icon: Music,
    accept: 'audio/mpeg,audio/wav,audio/ogg,audio/flac,audio/mp4,audio/x-m4a',
    extensions: 'WAV, MP3, AAC, FLAC, M4A',
    maxSizeMB: 50,
    hint: 'Voice cloning, neural speech synthesis, spliced phonemes',
  },
};

const ANALYSIS_STAGES = [
  { step: 1, label: 'ANALYSIS INITIALIZED', desc: 'Secure payload ingestion and SHA-256 integrity hashing' },
  { step: 2, label: 'MEDIA PROCESSING', desc: 'Frame decomposition, bio-rPPG temporal alignment & spectrograms' },
  { step: 3, label: 'FEATURE EXTRACTION', desc: 'Biological pulse extraction and spatial frequency gradient mapping' },
  { step: 4, label: 'AI ANALYSIS', desc: 'Multi-backbone transformer & cross-attention neural inference' },
  { step: 5, label: 'CROSS-MODEL VERIFICATION', desc: 'Adversarial calibration & anomaly threshold validation' },
  { step: 6, label: 'GENERATING RESULT', desc: 'Synthesizing forensic certificate and frame-level telemetry' },
];

export default function DashboardAnalyzePage() {
  const [activeType, setActiveType] = useState<MediaType>('video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle Tab Switch
  const handleTabChange = (type: MediaType) => {
    if (isAnalyzing) return;
    setActiveType(type);
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  // Validate and assign file
  const handleFileSelection = (file: File) => {
    setErrorMessage(null);
    setAnalysisResult(null);

    const config = MEDIA_CONFIGS[activeType];
    const maxSizeBytes = config.maxSizeMB * 1024 * 1024;

    // Type validation check
    const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|mkv|avi)$/i.test(file.name);
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|tiff|bmp)$/i.test(file.name);
    const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|ogg|flac|m4a|aac)$/i.test(file.name);

    if (activeType === 'video' && !isVideo) {
      setErrorMessage(`Invalid file format. Please upload a valid Video file (${config.extensions}).`);
      return;
    }
    if (activeType === 'image' && !isImage) {
      setErrorMessage(`Invalid file format. Please upload a valid Image file (${config.extensions}).`);
      return;
    }
    if (activeType === 'audio' && !isAudio) {
      setErrorMessage(`Invalid file format. Please upload a valid Audio file (${config.extensions}).`);
      return;
    }

    if (file.size > maxSizeBytes) {
      setErrorMessage(`File exceeds maximum size of ${config.maxSizeMB}MB.`);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // File Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  // Trigger media analysis
  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisResult(null);
    setCurrentStageIndex(0);
    setProgressPercent(10);

    // Multi-stage animation progress ticker
    const stageInterval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < ANALYSIS_STAGES.length - 1) {
          const next = prev + 1;
          setProgressPercent(Math.round(((next + 1) / ANALYSIS_STAGES.length) * 92));
          return next;
        }
        return prev;
      });
    }, 700);

    try {
      const result = await analysisService.analyzeMedia(selectedFile, activeType);
      
      clearInterval(stageInterval);
      setCurrentStageIndex(ANALYSIS_STAGES.length - 1);
      setProgressPercent(100);

      // Save to historical audit records
      historyService.addRecord(result);

      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisResult(result);
      }, 500);
    } catch (err: any) {
      clearInterval(stageInterval);
      setIsAnalyzing(false);
      setErrorMessage(err.message || 'Analysis pipeline encountered an unexpected network error.');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    setIsAnalyzing(false);
  };

  const handleExportReport = () => {
    if (analysisResult) {
      reportService.exportReport(analysisResult, 'certificate');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 
        =============================================================================
        SECTION HEADER
        =============================================================================
      */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(0, 229, 255, 0.12)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '100px',
            padding: '3px 10px',
            fontFamily: 'var(--f-mono)',
            fontSize: '10.5px',
            letterSpacing: '0.08em',
            color: '#00E5FF',
            textTransform: 'uppercase',
          }}>
            <Zap size={11} />
            <span>AI Forensics Workspace</span>
          </div>
        </div>
        <h1 style={{
          fontFamily: 'var(--f-display)',
          fontSize: 'clamp(26px, 3.5vw, 36px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          marginBottom: '8px',
        }}>
          Analyze Media
        </h1>
        <p style={{
          fontFamily: 'var(--f-sans)',
          fontSize: '14.5px',
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '650px',
          lineHeight: 1.5,
        }}>
          Upload a video, image, or audio file to detect potential manipulation using multi-modal deepfake detection models, rPPG biological pulse extraction, and spectral frequency analysis.
        </p>
      </div>

      {/* 
        =============================================================================
        MEDIA TYPE SELECTION TABS
        =============================================================================
      */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '14px',
      }}>
        {(['video', 'image', 'audio'] as MediaType[]).map((type) => {
          const config = MEDIA_CONFIGS[type];
          const Icon = config.icon;
          const isActive = activeType === type;

          return (
            <button
              key={type}
              type="button"
              id={`tab-btn-${type}`}
              onClick={() => handleTabChange(type)}
              disabled={isAnalyzing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                fontFamily: 'var(--f-display)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: isActive ? 'rgba(0, 229, 255, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                border: isActive ? '1px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.08)',
                color: isActive ? '#00E5FF' : 'rgba(255, 255, 255, 0.65)',
                boxShadow: isActive ? '0 0 16px rgba(0, 229, 255, 0.2)' : 'none',
              }}
            >
              <Icon size={16} />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#F87171',
          fontFamily: 'var(--f-sans)',
          fontSize: '13.5px',
        }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 
        =============================================================================
        MAIN WORKSPACE AREA: (UPLOAD / PREVIEW / ANALYSIS / RESULTS)
        =============================================================================
      */}
      {!analysisResult ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* UPLOAD & PREVIEW PANEL */}
          {!selectedFile ? (
            /* Large Drag & Drop Upload Zone */
            <div
              id="media-dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? '#00E5FF' : 'rgba(255, 255, 255, 0.16)'}`,
                borderRadius: '16px',
                backgroundColor: isDragging ? 'rgba(0, 229, 255, 0.06)' : 'rgba(13, 17, 26, 0.65)',
                backdropFilter: 'blur(16px)',
                padding: 'clamp(40px, 8vw, 70px) 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isDragging ? '0 0 30px rgba(0, 229, 255, 0.25)' : '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={MEDIA_CONFIGS[activeType].accept}
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileSelection(e.target.files[0]);
                  }
                }}
              />

              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00E5FF',
                marginBottom: '20px',
              }}>
                <UploadCloud size={30} />
              </div>

              <h3 style={{
                fontFamily: 'var(--f-display)',
                fontSize: '18px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                marginBottom: '8px',
              }}>
                DROP YOUR {MEDIA_CONFIGS[activeType].label} HERE
              </h3>

              <p style={{
                fontFamily: 'var(--f-sans)',
                fontSize: '13.5px',
                color: 'rgba(255, 255, 255, 0.55)',
                marginBottom: '20px',
              }}>
                Drag & drop files here or click to browse
              </p>

              <button
                type="button"
                id="browse-files-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#00E5FF',
                  color: '#06080D',
                  fontFamily: 'var(--f-display)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '10px 24px',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(0, 229, 255, 0.35)',
                }}
              >
                <span>BROWSE FILES</span>
              </button>

              <div style={{
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                fontFamily: 'var(--f-mono)',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.45)',
              }}>
                <span>Supported: <strong style={{ color: '#FFFFFF' }}>{MEDIA_CONFIGS[activeType].extensions}</strong></span>
                <span>•</span>
                <span>Max Size: <strong style={{ color: '#00E5FF' }}>{MEDIA_CONFIGS[activeType].maxSizeMB} MB</strong></span>
              </div>
            </div>
          ) : (
            /* File Preview & Actions Container */
            <div style={{
              backgroundColor: 'rgba(13, 17, 26, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 229, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00E5FF',
                  }}>
                    {activeType === 'video' && <Video size={18} />}
                    {activeType === 'image' && <ImageIcon size={18} />}
                    {activeType === 'audio' && <Music size={18} />}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--f-display)', fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
                      {selectedFile.name}
                    </h4>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)' }}>
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || activeType.toUpperCase()}
                    </span>
                  </div>
                </div>

                {!isAnalyzing && (
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Remove file"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      color: '#EF4444',
                      fontFamily: 'var(--f-display)',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Trash2 size={13} />
                    <span>REMOVE</span>
                  </button>
                )}
              </div>

              {/* Media Preview Box */}
              <div style={{
                backgroundColor: '#04060A',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                overflow: 'hidden',
                minHeight: '260px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                {activeType === 'video' && previewUrl && (
                  <video
                    src={previewUrl}
                    controls
                    style={{
                      maxHeight: '440px',
                      width: '100%',
                      objectFit: 'contain',
                      backgroundColor: '#000000',
                    }}
                  />
                )}

                {activeType === 'image' && previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Target preview"
                    style={{
                      maxHeight: '440px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                  />
                )}

                {activeType === 'audio' && previewUrl && (
                  <div style={{
                    width: '100%',
                    padding: '40px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                  }}>
                    {/* Simulated Waveform Preview Bars */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      width: '100%',
                      height: '64px',
                    }}>
                      {Array.from({ length: 48 }).map((_, i) => {
                        const h = 20 + Math.sin(i * 0.4) * 16 + Math.cos(i * 0.8) * 12;
                        return (
                          <div
                            key={i}
                            style={{
                              width: '4px',
                              height: `${Math.max(6, Math.min(60, h))}px`,
                              borderRadius: '2px',
                              backgroundColor: isAnalyzing ? '#00E5FF' : 'rgba(0, 229, 255, 0.45)',
                              animation: isAnalyzing ? `pulse ${0.4 + (i % 5) * 0.15}s ease infinite alternate` : 'none',
                            }}
                          />
                        );
                      })}
                    </div>

                    <audio
                      src={previewUrl}
                      controls
                      style={{
                        width: '100%',
                        maxWidth: '520px',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Multi-Stage Analysis Progress Display */}
              {isAnalyzing && (
                <div style={{
                  backgroundColor: 'rgba(0, 229, 255, 0.04)',
                  border: '1px solid rgba(0, 229, 255, 0.25)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RefreshCw size={16} color="#00E5FF" style={{ animation: 'spin 1.2s linear infinite' }} />
                      <span style={{ fontFamily: 'var(--f-display)', fontSize: '13px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                        {ANALYSIS_STAGES[currentStageIndex].label}
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: '13px', fontWeight: 700, color: '#00E5FF' }}>
                      {progressPercent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '100px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${progressPercent}%`,
                      height: '100%',
                      backgroundColor: '#00E5FF',
                      boxShadow: '0 0 12px #00E5FF',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>

                  {/* Subtitle Description */}
                  <p style={{ fontFamily: 'var(--f-mono)', fontSize: '11px', color: 'rgba(255, 255, 255, 0.55)', margin: 0 }}>
                    {ANALYSIS_STAGES[currentStageIndex].desc}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {!isAnalyzing && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontFamily: 'var(--f-display)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    id="start-analyze-btn"
                    onClick={handleStartAnalysis}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 32px',
                      borderRadius: '8px',
                      backgroundColor: '#00E5FF',
                      border: 'none',
                      fontFamily: 'var(--f-display)',
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#06080D',
                      cursor: 'pointer',
                      boxShadow: '0 0 24px rgba(0, 229, 255, 0.4)',
                    }}
                  >
                    <Cpu size={16} />
                    <span>START AI ANALYSIS</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* 
          =============================================================================
          ANALYSIS RESULTS VIEW
          =============================================================================
        */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Top Result Card Banner */}
          <div style={{
            backgroundColor: 'rgba(13, 17, 26, 0.9)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${
              analysisResult.classification === 'LIKELY DEEPFAKE' 
                ? 'rgba(239, 68, 68, 0.4)' 
                : analysisResult.classification === 'AUTHENTIC'
                ? 'rgba(16, 185, 129, 0.4)'
                : 'rgba(245, 158, 11, 0.4)'
            }`,
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <span style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  FORENSIC VERDICT // ID: {analysisResult.id.slice(0, 8)}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                  <h2 style={{
                    fontFamily: 'var(--f-display)',
                    fontSize: 'clamp(24px, 3vw, 32px)',
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    color: analysisResult.classification === 'LIKELY DEEPFAKE' 
                      ? '#EF4444' 
                      : analysisResult.classification === 'AUTHENTIC' 
                      ? '#10B981' 
                      : '#F59E0B',
                  }}>
                    {analysisResult.classification}
                  </h2>
                </div>
              </div>

              {/* Confidence Meter Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '12px 20px',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase' }}>
                    Model Confidence
                  </div>
                  <div style={{
                    fontFamily: 'var(--f-display)',
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1.1,
                  }}>
                    {analysisResult.confidence.toFixed(1)}%
                  </div>
                </div>

                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: analysisResult.classification === 'LIKELY DEEPFAKE' 
                    ? 'rgba(239, 68, 68, 0.15)' 
                    : analysisResult.classification === 'AUTHENTIC' 
                    ? 'rgba(16, 185, 129, 0.15)' 
                    : 'rgba(245, 158, 11, 0.15)',
                  color: analysisResult.classification === 'LIKELY DEEPFAKE' 
                    ? '#EF4444' 
                    : analysisResult.classification === 'AUTHENTIC' 
                    ? '#10B981' 
                    : '#F59E0B',
                }}>
                  {analysisResult.classification === 'LIKELY DEEPFAKE' && <AlertTriangle size={24} />}
                  {analysisResult.classification === 'AUTHENTIC' && <ShieldCheck size={24} />}
                  {analysisResult.classification === 'SUSPICIOUS' && <Info size={24} />}
                </div>
              </div>
            </div>

            {/* Quick Meta Breakdown Table */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '16px',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)' }}>FILE NAME</div>
                <div style={{ fontFamily: 'var(--f-sans)', fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginTop: '2px', wordBreak: 'break-all' }}>
                  {analysisResult.filename}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)' }}>MEDIA TYPE</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', fontWeight: 600, color: '#00E5FF', marginTop: '2px', textTransform: 'uppercase' }}>
                  {analysisResult.mediaType}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)' }}>TIMESTAMP</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', color: '#FFFFFF', marginTop: '2px' }}>
                  {new Date(analysisResult.timestamp).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)' }}>SHA-256 HASH</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '11px', color: 'rgba(255, 255, 255, 0.65)', marginTop: '2px' }}>
                  {analysisResult.sha256 ? `${analysisResult.sha256.slice(0, 12)}...` : 'Not available'}
                </div>
              </div>
            </div>
          </div>

          {/* 
            =============================================================================
            FORENSIC TELEMETRY & VISUALIZATION BREAKDOWN
            =============================================================================
          */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}>
            {/* Left: Frame / Spectral Indicators */}
            <div style={{
              backgroundColor: 'rgba(13, 17, 26, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="#00E5FF" />
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                  Detected Forensic Indicators
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {analysisResult.indicators && analysisResult.indicators.length > 0 ? (
                  analysisResult.indicators.map((ind, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--f-sans)', fontSize: '13px', color: '#FFFFFF' }}>
                        {ind.label}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '11px', color: '#00E5FF' }}>
                          {ind.value}
                        </span>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: ind.status === 'danger' ? '#EF4444' : ind.status === 'warning' ? '#F59E0B' : '#10B981',
                        }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>
                    Not available
                  </div>
                )}
              </div>
            </div>

            {/* Right: Modality Specific Visualizer (Video frames / Image bbox / Audio spectral) */}
            <div style={{
              backgroundColor: 'rgba(13, 17, 26, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} color="#00E5FF" />
                  <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                    {analysisResult.mediaType === 'video' && 'Suspicious Frame Timeline'}
                    {analysisResult.mediaType === 'image' && 'Spatial Artifact Heatmap'}
                    {analysisResult.mediaType === 'audio' && 'Vocal Harmonizer Spectrogram'}
                  </h3>
                </div>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: '#00E5FF' }}>
                  AI INTERPOLATION
                </span>
              </div>

              {/* Visual rendering according to modality */}
              {analysisResult.mediaType === 'video' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px',
                  }}>
                    {[
                      { f: 'F042', s: '94%', alert: true },
                      { f: 'F088', s: '89%', alert: true },
                      { f: 'F134', s: '22%', alert: false },
                      { f: 'F180', s: '96%', alert: true },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#04060A',
                          border: `1px solid ${item.alert ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.3)'}`,
                          borderRadius: '6px',
                          padding: '8px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)' }}>
                          {item.f}
                        </div>
                        <div style={{
                          fontFamily: 'var(--f-display)',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: item.alert ? '#EF4444' : '#10B981',
                          marginTop: '2px',
                        }}>
                          {item.s}
                        </div>
                      </div>
                    ))}
                  </div>
                  <span style={{ fontFamily: 'var(--f-sans)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    Temporal inconsistencies identified in frames 42-88 and 180 (boundary blending anomalies).
                  </span>
                </div>
              )}

              {analysisResult.mediaType === 'image' && (
                <div style={{
                  backgroundColor: '#04060A',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: '11px', color: '#00E5FF' }}>
                      Spatial Frequency Gradient:
                    </span>
                    <span style={{ fontFamily: 'var(--f-sans)', fontSize: '13px', color: '#FFFFFF' }}>
                      High-frequency Fourier grid distortion in ocular and jawline perimeter.
                    </span>
                  </div>
                </div>
              )}

              {analysisResult.mediaType === 'audio' && (
                <div style={{
                  backgroundColor: '#04060A',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '11px', color: '#00E5FF' }}>
                    Spectral Phase Inversion:
                  </span>
                  <span style={{ fontFamily: 'var(--f-sans)', fontSize: '13px', color: '#FFFFFF' }}>
                    Phase discontinuities and unnatural robotic formant distribution detected between 0.8s - 2.4s.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
          }}>
            <button
              type="button"
              onClick={handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontFamily: 'var(--f-display)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} />
              <span>Analyze Another File</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                href="/dashboard/history"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  color: '#00E5FF',
                  fontFamily: 'var(--f-display)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>View in History</span>
                <ArrowRight size={14} />
              </Link>

              <button
                type="button"
                id="export-dossier-btn"
                onClick={handleExportReport}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  backgroundColor: '#00E5FF',
                  border: 'none',
                  color: '#06080D',
                  fontFamily: 'var(--f-display)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(0, 229, 255, 0.3)',
                }}
              >
                <Download size={14} />
                <span>Export Report Certificate</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
