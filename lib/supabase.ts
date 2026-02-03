import 'react-native-url-polyfill/auto';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Get Supabase URL and key from all possible sources (works on web, mobile, EAS, dev) */
function resolveConfig(): { url: string; anonKey: string } {
  // 1. app.config.js extra (reliable on mobile / Expo Go / dev builds)
  try {
    const extra = (Constants?.expoConfig as { extra?: { supabaseUrl?: string; supabaseAnonKey?: string } })?.extra;
    if (extra?.supabaseUrl && extra?.supabaseAnonKey) {
      return { url: String(extra.supabaseUrl).trim(), anonKey: String(extra.supabaseAnonKey).trim() };
    }
  } catch {
    // Constants or expoConfig may be undefined in some environments
  }

  // 2. process.env (web Metro, EAS Build injects these)
  const envUrl = typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_URL;
  const envKey = typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    return { url: String(envUrl).trim(), anonKey: String(envKey).trim() };
  }

  return { url: '', anonKey: '' };
}

const resolved = resolveConfig();

export function getSupabaseConfig(): { url: string; anonKey: string } {
  return { url: resolved.url, anonKey: resolved.anonKey };
}

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  if (!resolved.url || !resolved.anonKey) {
    throw new Error(
      'Supabase not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env and restart (npx expo start --clear).'
    );
  }
  const isWeb = Platform.OS === 'web';
  _client = createClient(resolved.url, resolved.anonKey, {
    auth: {
      storage: isWeb ? undefined : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: isWeb,
    },
  });
  if (!isWeb && typeof AppState?.addEventListener === 'function') {
    try {
      AppState.addEventListener('change', (state: string) => {
        if (state === 'active') _client?.auth.startAutoRefresh();
        else _client?.auth.stopAutoRefresh();
      });
    } catch {
      // AppState may not exist in some test environments
    }
  }
  return _client;
}

/** Supabase client – use this everywhere. Throws only when used without config. */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return getClient()[prop as keyof SupabaseClient];
  },
});
