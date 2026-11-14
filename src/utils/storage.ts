import { AppSettings, RecentSession, UserProfile } from '../types/app';
import { generateUserId } from './identity';

const SETTINGS_KEY = 'setorawon_settings_v1';
const PROFILE_KEY = 'setorawon_profile_v1';
const SESSIONS_KEY = 'setorawon_recent_sessions_v1';
const ACTIVE_ROOM_SESSION_KEY = 'setorawon_active_room_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'id',
  theme: 'light',
  selectedMicId: '',
  selectedCamId: '',
  soundNotifications: true,
  browserNotifications: false,
  maxFileSizeMb: 50,
  autoAcceptFiles: true,
  hideTypingIndicator: false,
};

export function createDefaultProfile(): UserProfile {
  return {
    userId: generateUserId(),
    username: 'Teman Setorawon',
    avatarPreset: 'cloud',
    customAvatarDataUrl: null,
  };
}

function getSafeStorage(kind: 'local' | 'session'): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function loadSettings(): AppSettings {
  const storage = getSafeStorage('local');
  if (!storage) return { ...DEFAULT_SETTINGS };
  try {
    const raw = storage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      language: parsed.language === 'en' ? 'en' : 'id',
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      maxFileSizeMb:
        typeof parsed.maxFileSizeMb === 'number' && parsed.maxFileSizeMb >= 5 && parsed.maxFileSizeMb <= 100
          ? parsed.maxFileSizeMb
          : DEFAULT_SETTINGS.maxFileSizeMb,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  const storage = getSafeStorage('local');
  if (!storage) return;
  try {
    storage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore quota errors cleanly
  }
}

export function resetStoredSettings(): AppSettings {
  const storage = getSafeStorage('local');
  const fresh = { ...DEFAULT_SETTINGS };
  if (storage) {
    try {
      storage.setItem(SETTINGS_KEY, JSON.stringify(fresh));
    } catch {
      // Ignore
    }
  }
  return fresh;
}

export function loadProfile(): UserProfile {
  const storage = getSafeStorage('local');
  if (!storage) return createDefaultProfile();
  try {
    const raw = storage.getItem(PROFILE_KEY);
    if (!raw) {
      const created = createDefaultProfile();
      saveProfile(created);
      return created;
    }
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return {
      userId: parsed.userId || generateUserId(),
      username: parsed.username?.trim() || 'Teman Setorawon',
      avatarPreset: parsed.avatarPreset || 'cloud',
      customAvatarDataUrl: parsed.customAvatarDataUrl ?? null,
    };
  } catch {
    return createDefaultProfile();
  }
}

export function saveProfile(profile: UserProfile): void {
  const storage = getSafeStorage('local');
  if (!storage) return;
  try {
    storage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore quota errors cleanly
  }
}

export function loadRecentSessions(): RecentSession[] {
  const storage = getSafeStorage('local');
  if (!storage) return [];
  try {
    const raw = storage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecentSession[]).slice(0, 6) : [];
  } catch {
    return [];
  }
}

export function recordRecentSession(session: RecentSession): RecentSession[] {
  const existing = loadRecentSessions().filter((item) => item.roomId !== session.roomId);
  const updated = [session, ...existing].slice(0, 6);
  const storage = getSafeStorage('local');
  if (storage) {
    try {
      storage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }
  return updated;
}

export function clearRecentSessions(): RecentSession[] {
  const storage = getSafeStorage('local');
  if (storage) {
    try {
      storage.removeItem(SESSIONS_KEY);
    } catch {
      // Ignore
    }
  }
  return [];
}

export function saveActiveSessionMeta(meta: { roomId: string; role: 'host' | 'guest' } | null): void {
  const storage = getSafeStorage('session');
  if (!storage) return;
  try {
    if (!meta) {
      storage.removeItem(ACTIVE_ROOM_SESSION_KEY);
    } else {
      storage.setItem(ACTIVE_ROOM_SESSION_KEY, JSON.stringify(meta));
    }
  } catch {
    // Ignore
  }
}

export function loadActiveSessionMeta(): { roomId: string; role: 'host' | 'guest' } | null {
  const storage = getSafeStorage('session');
  if (!storage) return null;
  try {
    const raw = storage.getItem(ACTIVE_ROOM_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { roomId?: string; role?: 'host' | 'guest' };
    if (parsed.roomId && (parsed.role === 'host' || parsed.role === 'guest')) {
      return { roomId: parsed.roomId, role: parsed.role };
    }
    return null;
  } catch {
    return null;
  }
}
