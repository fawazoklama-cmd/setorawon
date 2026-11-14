import { FileCategory } from '../types/app';

const SAFE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomChars(length: number): string {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    const idx = Math.floor(Math.random() * SAFE_ALPHABET.length);
    result += SAFE_ALPHABET[idx];
  }
  return result;
}

export function generateUserId(): string {
  return `STW-${randomChars(6)}`;
}

export function generateRoomCode(): string {
  return `ROOM-${randomChars(4)}`;
}

export function sanitizeRoomCode(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, 24);
}

export function isValidRoomCode(roomCode: string): boolean {
  const cleaned = sanitizeRoomCode(roomCode);
  return cleaned.length >= 4;
}

export function getRoomHostPeerId(roomCode: string): string {
  const cleaned = sanitizeRoomCode(roomCode).toLowerCase();
  return `setorawon-room-${cleaned}`;
}

export function getGuestPeerId(userId: string): string {
  const cleanUser = userId.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user';
  return `setorawon-peer-${cleanUser}-${randomChars(4).toLowerCase()}`;
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const formatted = unitIndex === 0 ? value.toString() : value.toFixed(value >= 10 ? 1 : 2);
  return `${formatted} ${units[unitIndex]}`;
}

export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function formatClockTime(timestamp: number): string {
  const d = new Date(timestamp);
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

const BLOCKED_EXECUTABLE_EXTENSIONS = new Set([
  'exe',
  'bat',
  'cmd',
  'com',
  'msi',
  'scr',
  'vbs',
  'vbe',
  'ps1',
  'sh',
  'app',
  'dmg',
  'apk',
  'jar',
  'hta',
  'reg',
]);

export type FileValidationResult =
  | { valid: true }
  | { valid: false; reason: 'empty' | 'too_large' | 'unsafe_type' };

export function validateFileForTransfer(
  file: { name: string; size: number; type?: string },
  maxSizeMb: number
): FileValidationResult {
  if (!Number.isFinite(file.size) || file.size <= 0) {
    return { valid: false, reason: 'empty' };
  }
  const maxBytes = Math.max(1, maxSizeMb) * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, reason: 'too_large' };
  }
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (BLOCKED_EXECUTABLE_EXTENSIONS.has(ext)) {
    return { valid: false, reason: 'unsafe_type' };
  }
  return { valid: true };
}

export function categorizeFile(mimeType: string, fileName: string): FileCategory {
  const lowerMime = (mimeType || '').toLowerCase();
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';

  if (lowerMime.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
    return 'image';
  }
  if (lowerMime.startsWith('video/') || ['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext)) {
    return 'video';
  }
  if (lowerMime.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext)) {
    return 'audio';
  }
  if (
    ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext) ||
    lowerMime.includes('zip') ||
    lowerMime.includes('compressed')
  ) {
    return 'archive';
  }
  if (
    ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'md', 'json', 'rtf'].includes(ext) ||
    lowerMime.includes('pdf') ||
    lowerMime.includes('document') ||
    lowerMime.includes('spreadsheet') ||
    lowerMime.includes('presentation') ||
    lowerMime.startsWith('text/')
  ) {
    return 'document';
  }
  return 'other';
}
