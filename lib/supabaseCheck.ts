import { supabase, getSupabaseConfig } from '@/lib/supabase';

export type ConnectionStatus = {
  configured: boolean;
  auth: boolean;
  db: boolean;
  error?: string;
};

/**
 * Verify Supabase is configured and reachable (auth + database).
 * Call this on app load to ensure connection before showing login.
 */
export async function checkSupabaseConnection(): Promise<ConnectionStatus> {
  const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseConfig();
  if (!supabaseUrl?.trim() || !supabaseAnonKey?.trim()) {
    return {
      configured: false,
      auth: false,
      db: false,
      error: 'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env and set your Supabase credentials.',
    };
  }

  try {
    // Auth: verify we can reach Supabase Auth (getSession doesn't require a logged-in user)
    const { error: authError } = await supabase.auth.getSession();
    // Session can be null when not logged in; we only care that the request didn't fail
    if (authError) {
      return {
        configured: true,
        auth: false,
        db: false,
        error: `Auth unreachable: ${authError.message}`,
      };
    }

    // DB: verify we can reach PostgREST (RLS may return empty array for anonymous; that's OK)
    const { error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (dbError) {
      return {
        configured: true,
        auth: true,
        db: false,
        error: `Database unreachable: ${dbError.message}. Ensure you ran the migration in Supabase SQL Editor (supabase/migrations/001_initial.sql).`,
      };
    }

    return {
      configured: true,
      auth: true,
      db: true,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return {
      configured: true,
      auth: false,
      db: false,
      error: `Connection failed: ${message}`,
    };
  }
}
