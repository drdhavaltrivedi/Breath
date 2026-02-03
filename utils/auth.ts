import { supabase } from '@/lib/supabase';
import {
  isOnline,
  getCachedProfileSettings,
  setCachedProfileSettings,
  getPendingSettingsUpdates,
  setPendingSettingsUpdates,
  clearPendingSettingsUpdates,
} from '@/lib/offline';

export interface User {
  id: string;
  email: string;
  loginDate?: string;
}

/** Supabase Auth error – has .message for display */
export type AuthError = { message: string };

/**
 * Sign up with email and password (Supabase Auth)
 */
export const signUp = async (
  email: string,
  password: string
): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signUp({ email, password });
  return { error: error ? { message: error.message } : null };
};

/**
 * Sign in with email and password (Supabase Auth)
 */
export const signIn = async (
  email: string,
  password: string
): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error ? { message: error.message } : null };
};

/**
 * Send password reset email (Supabase Auth).
 * User receives a link to set a new password (configure redirect URL in Supabase Dashboard > Auth > URL Configuration).
 */
export const resetPasswordForEmail = async (
  email: string
): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: undefined, // Use Supabase project default redirect URL
  });
  return { error: error ? { message: error.message } : null };
};

/**
 * Get current user from Supabase session
 */
export const getUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user?.email) return null;
  return {
    id: user.id,
    email: user.email,
    loginDate: user.created_at,
  };
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = async (): Promise<boolean> => {
  const user = await getUser();
  return user !== null;
};

/**
 * Logout (Supabase signOut)
 */
export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
};

/**
 * Mark onboarding as complete (update profile in Supabase)
 */
export const setOnboardingComplete = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', user.id);
};

/**
 * Check if onboarding is complete (from Supabase profile)
 */
export const isOnboardingComplete = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from('profiles')
    .select('onboarding_complete')
    .eq('id', user.id)
    .single();
  return data?.onboarding_complete ?? false;
};

const defaultProfileSettings = {
  notifications_enabled: true,
  heart_rate_enabled: false,
};

/**
 * Get profile settings (notifications, heart rate).
 * When online: fetches from Supabase and caches. When offline: returns cache (merged with any pending updates).
 */
export const getProfileSettings = async (): Promise<{
  notifications_enabled: boolean;
  heart_rate_enabled: boolean;
} | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const online = await isOnline();
  if (online) {
    const { data } = await supabase
      .from('profiles')
      .select('notifications_enabled, heart_rate_enabled')
      .eq('id', user.id)
      .single();
    const settings = data
      ? {
          notifications_enabled: data.notifications_enabled ?? true,
          heart_rate_enabled: data.heart_rate_enabled ?? false,
        }
      : defaultProfileSettings;
    await setCachedProfileSettings(user.id, settings);
    const pending = await getPendingSettingsUpdates(user.id);
    if (pending && Object.keys(pending).length > 0) {
      const merged = { ...settings, ...pending };
      await setCachedProfileSettings(user.id, merged);
      return merged;
    }
    return settings;
  }

  const cached = await getCachedProfileSettings(user.id);
  const pending = await getPendingSettingsUpdates(user.id);
  const base = cached ?? defaultProfileSettings;
  if (pending && Object.keys(pending).length > 0) {
    return { ...base, ...pending };
  }
  return base;
};

/**
 * Update profile settings.
 * When online: updates Supabase and cache. When offline: updates cache and queues for sync.
 */
export const updateProfileSettings = async (updates: {
  notifications_enabled?: boolean;
  heart_rate_enabled?: boolean;
}): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const online = await isOnline();
  const cached = (await getCachedProfileSettings(user.id)) ?? defaultProfileSettings;
  const merged = { ...cached, ...updates };
  await setCachedProfileSettings(user.id, merged);

  if (online) {
    await supabase.from('profiles').update(updates).eq('id', user.id);
    await clearPendingSettingsUpdates(user.id);
  } else {
    const pending = await getPendingSettingsUpdates(user.id);
    await setPendingSettingsUpdates(user.id, { ...pending, ...updates });
  }
};

/**
 * Flush pending profile settings to Supabase (call when coming back online).
 */
export const flushPendingProfileSettings = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const pending = await getPendingSettingsUpdates(user.id);
  if (!pending || Object.keys(pending).length === 0) return false;
  const { error } = await supabase.from('profiles').update(pending).eq('id', user.id);
  if (error) return false;
  await clearPendingSettingsUpdates(user.id);
  const cached = (await getCachedProfileSettings(user.id)) ?? defaultProfileSettings;
  await setCachedProfileSettings(user.id, { ...cached, ...pending });
  return true;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
