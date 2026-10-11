/**
 * lib/validations/media.ts
 * Client-side file pre-validation for multimodal forensic ingestion.
 * Validates MIME types, extensions, and maximum file size (100MB limit).
 */

export type Modality = 'video' | 'image' | 'audio';

export interface MediaValidationResult {
  isValid: boolean;
  error?: string;
  formattedSize: string;
  sizeBytes: number;
  fileName: string;
  fileType: string;
}

// Configured max upload size in MB (defaults to 100MB per specification)
export const MAX_UPLOAD_MB = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB) || 100;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

export const MODALITY_CONFIGS: Record<
  Modality,
  {
    label: string;
    allowedMimeTypes: string[];
    allowedExtensions: string[];
    extensionsDisplay: string;
    maxSizeMB: number;
  }
> = {
  video: {
    label: 'Video',
    allowedMimeTypes: [
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/x-matroska',
      'video/avi',
      'video/x-msvideo',
      'video/mpeg',
    ],
    allowedExtensions: ['.mp4', '.mov', '.webm', '.mkv', '.avi'],
    extensionsDisplay: 'MP4, MOV, WEBM, MKV, AVI',
    maxSizeMB: MAX_UPLOAD_MB,
  },
  image: {
    label: 'Image',
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/tiff',
      'image/bmp',
      'image/avif',
    ],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif', '.bmp', '.avif'],
    extensionsDisplay: 'JPG, PNG, WEBP, TIFF, BMP',
    maxSizeMB: Math.min(MAX_UPLOAD_MB, 50),
  },
  audio: {
    label: 'Audio',
    allowedMimeTypes: [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/wave',
      'audio/x-wav',
      'audio/ogg',
      'audio/flac',
      'audio/x-m4a',
      'audio/m4a',
      'audio/aac',
      'audio/opus',
      'audio/webm',
    ],
    allowedExtensions: ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac', '.opus', '.weba'],
    extensionsDisplay: 'MP3, WAV, AAC, FLAC, M4A, OGG',
    maxSizeMB: Math.min(MAX_UPLOAD_MB, 50),
  },
};

/**
 * Format raw byte count into human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Pre-validates a media file prior to uploading or processing.
 */
export function validateMediaFile(file: File, modality: Modality): MediaValidationResult {
  const formattedSize = formatFileSize(file.size);
  const resultBase = {
    sizeBytes: file.size,
    formattedSize,
    fileName: file.name,
    fileType: file.type,
  };

  if (!file) {
    return {
      isValid: false,
      error: 'No file selected. Please choose a media file for forensic inspection.',
      ...resultBase,
    };
  }

  // 1. Zero-byte check
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'Selected file is empty (0 bytes). Please upload a valid media file.',
      ...resultBase,
    };
  }

  const config = MODALITY_CONFIGS[modality];
  const maxBytes = config.maxSizeMB * 1024 * 1024;

  // 2. Strict file size validation
  if (file.size > maxBytes) {
    return {
      isValid: false,
      error: `File size (${formattedSize}) exceeds the maximum allowable limit of ${config.maxSizeMB}MB for ${config.label} uploads.`,
      ...resultBase,
    };
  }

  // 3. MIME type & File extension validation
  const lowerName = file.name.toLowerCase();
  const fileExt = '.' + lowerName.split('.').pop();
  const hasValidExt = config.allowedExtensions.includes(fileExt);
  const hasValidMime = config.allowedMimeTypes.includes(file.type.toLowerCase()) ||
    (modality === 'audio' && file.type.startsWith('audio/')) ||
    (modality === 'video' && file.type.startsWith('video/')) ||
    (modality === 'image' && file.type.startsWith('image/'));

  if (!hasValidExt && !hasValidMime) {
    return {
      isValid: false,
      error: `Unsupported file format "${file.name}". For ${config.label} analysis, please upload: ${config.extensionsDisplay}.`,
      ...resultBase,
    };
  }

  return {
    isValid: true,
    ...resultBase,
  };
}
