import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const PREFIX = 'breath_offline';

export type PendingSession = {
  user_id: string;
  problem_title: string;
  protocol: string;
  duration_seconds: number;
  completed: boolean;
  estimated_hr_reduction: number;
  created_at: string;
};

export type CachedSession = {
  id: string;
  date: string;
  problem: string;
  duration: number;
  completed: boolean;
  estimatedHRReduction: number;
};

export type ProfileSettings = {
  notifications_enabled: boolean;
  heart_rate_enabled: boolean;
};

function key(userId: string, suffix: string): string {
  return `${PREFIX}_${userId}_${suffix}`;
}

/**
 * Check if the device has network connectivity (best effort).
 */
export async function isOnline(): Promise<boolean> {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected === true;
  } catch {
    return false;
  }
}

/**
 * Subscribe to network state changes (e.g. when coming back online).
 */
export function subscribeToNetwork(callback: (isConnected: boolean) => void): () => void {
  const unsubscribe = NetInfo.addEventListener((state) => {
    callback(state.isConnected === true);
  });
  return unsubscribe;
}

// ---- Pending sessions (to sync to Supabase when online) ----

const PENDING_SESSIONS = 'pending_sessions';

export async function getPendingSessions(userId: string): Promise<PendingSession[]> {
  try {
    const raw = await AsyncStorage.getItem(key(userId, PENDING_SESSIONS));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PendingSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addPendingSession(userId: string, session: PendingSession): Promise<void> {
  const list = await getPendingSessions(userId);
  list.push({ ...session, created_at: session.created_at || new Date().toISOString() });
  await AsyncStorage.setItem(key(userId, PENDING_SESSIONS), JSON.stringify(list));
}

export async function setPendingSessions(userId: string, sessions: PendingSession[]): Promise<void> {
  await AsyncStorage.setItem(key(userId, PENDING_SESSIONS), JSON.stringify(sessions));
}

// ---- Cached sessions (last successful fetch for offline display) ----

const CACHED_SESSIONS = 'cached_sessions';

export async function getCachedSessions(userId: string): Promise<CachedSession[]> {
  try {
    const raw = await AsyncStorage.getItem(key(userId, CACHED_SESSIONS));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CachedSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function setCachedSessions(userId: string, sessions: CachedSession[]): Promise<void> {
  await AsyncStorage.setItem(key(userId, CACHED_SESSIONS), JSON.stringify(sessions));
}

// ---- Cached profile settings ----

const CACHED_PROFILE = 'cached_profile';

export async function getCachedProfileSettings(userId: string): Promise<ProfileSettings | null> {
  try {
    const raw = await AsyncStorage.getItem(key(userId, CACHED_PROFILE));
    if (!raw) return null;
    return JSON.parse(raw) as ProfileSettings;
  } catch {
    return null;
  }
}

export async function setCachedProfileSettings(
  userId: string,
  settings: ProfileSettings
): Promise<void> {
  await AsyncStorage.setItem(key(userId, CACHED_PROFILE), JSON.stringify(settings));
}

// ---- Pending profile settings (to sync when online) ----

const PENDING_SETTINGS = 'pending_settings';

export async function getPendingSettingsUpdates(userId: string): Promise<Partial<ProfileSettings> | null> {
  try {
    const raw = await AsyncStorage.getItem(key(userId, PENDING_SETTINGS));
    if (!raw) return null;
    return JSON.parse(raw) as Partial<ProfileSettings>;
  } catch {
    return null;
  }
}

export async function setPendingSettingsUpdates(
  userId: string,
  updates: Partial<ProfileSettings>
): Promise<void> {
  await AsyncStorage.setItem(key(userId, PENDING_SETTINGS), JSON.stringify(updates));
}

export async function clearPendingSettingsUpdates(userId: string): Promise<void> {
  await AsyncStorage.removeItem(key(userId, PENDING_SETTINGS));
}
