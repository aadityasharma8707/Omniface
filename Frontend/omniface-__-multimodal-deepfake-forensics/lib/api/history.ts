'use client';

import { AnalysisResult } from './analysis';

const HISTORY_KEY = 'omniface_analysis_history';

// Default initial forensic history records
const DEFAULT_HISTORY: AnalysisResult[] = [
  {
    id: 'ana_172561001',
    fileName: 'executive_press_conference.mp4',
    fileSize: '18.4 MB',
    mediaType: 'video',
    previewUrl: '/assets/sample-video-thumb.jpg',
    classification: 'DEEPFAKE DETECTED',
    isSynthetic: true,
    confidence: 96.4,
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    processingTimeMs: 142,
    indicators: [
      { name: 'Spatial Residuals', score: 94, status: 'anomalous', description: 'StyleGAN blending seams identified' },
      { name: 'Micro-vascular rPPG', score: 0, status: 'anomalous', description: '0.0 BPM cardiovascular flatline' },
    ],
    suspiciousFrames: [12, 34, 58, 89],
    summary: 'Facial reenactment with synthetic audio track and missing physiological cardiovascular pulse.',
  },
  {
    id: 'ana_172561002',
    fileName: 'broadcast_news_interview.mp4',
    fileSize: '32.1 MB',
    mediaType: 'video',
    previewUrl: '/assets/sample-video-thumb.jpg',
    classification: 'AUTHENTIC MEDIA',
    isSynthetic: false,
    confidence: 98.8,
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    processingTimeMs: 118,
    indicators: [
      { name: 'Sensor Noise', score: 3, status: 'normal', description: 'Natural Bayer CFA interpolation verified' },
      { name: 'Micro-vascular rPPG', score: 72, status: 'normal', description: '72 BPM regular human pulse rate' },
    ],
    summary: 'Verified authentic broadcast stream with organic biological rhythms and noise continuity.',
  },
  {
    id: 'ana_172561003',
    fileName: 'candidate_vocal_endorsement.wav',
    fileSize: '4.2 MB',
    mediaType: 'audio',
    previewUrl: '',
    classification: 'DEEPFAKE DETECTED',
    isSynthetic: true,
    confidence: 97.2,
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    processingTimeMs: 96,
    indicators: [
      { name: 'Neural Vocoder Harmonics', score: 95, status: 'anomalous', description: 'HiFi-GAN upsampling phase discontinuity' },
    ],
    summary: 'Zero-shot neural voice clone identified via vocoder spectral artifact signature.',
  },
  {
    id: 'ana_172561004',
    fileName: 'id_document_portrait.png',
    fileSize: '2.8 MB',
    mediaType: 'image',
    previewUrl: '/hero-reveal.png',
    classification: 'DEEPFAKE DETECTED',
    isSynthetic: true,
    confidence: 93.1,
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    processingTimeMs: 84,
    indicators: [
      { name: 'Corneal Reflections', score: 88, status: 'anomalous', description: 'Asymmetric specular corneal highlights' },
    ],
    summary: 'Generative diffusion portrait synthesis detected via facial symmetry and lighting divergence.',
  },
];

export const historyService = {
  // Get all history items
  getAll: (): AnalysisResult[] => {
    if (typeof window === 'undefined') return DEFAULT_HISTORY;
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (!stored) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(DEFAULT_HISTORY));
        return DEFAULT_HISTORY;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_HISTORY;
    }
  },

  // Alias for getAll
  getRecords: (): AnalysisResult[] => {
    return historyService.getAll();
  },

  // Save new analysis to history
  save: (result: AnalysisResult): void => {
    if (typeof window === 'undefined') return;
    try {
      const list = historyService.getAll();
      const updated = [result, ...list.filter((item) => item.id !== result.id)];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  // Delete single record
  deleteRecord: (id: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const list = historyService.getAll();
      const updated = list.filter((item) => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  // Get single analysis by id
  getById: (id: string): AnalysisResult | null => {
    const list = historyService.getAll();
    return list.find((item) => item.id === id) || null;
  },

  // Clear history
  clear: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(HISTORY_KEY);
    }
  },

  // Alias for clear
  clearHistory: (): void => {
    historyService.clear();
  },
};
