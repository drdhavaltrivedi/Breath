import { supabase } from '@/lib/supabase';
import type { BreathingSessionInsert } from '@/lib/database.types';
import {
  isOnline,
  getPendingSessions,
  addPendingSession,
  setPendingSessions,
  getCachedSessions,
  setCachedSessions,
  type PendingSession,
  type CachedSession,
} from '@/lib/offline';

export interface SessionData {
  id: string;
  date: Date;
  problem: string;
  duration: number;
  completed: boolean;
  estimatedHRReduction: number;
}

function pendingToSessionData(p: PendingSession, index: number): SessionData {
  return {
    id: `local_${index}_${p.created_at}`,
    date: new Date(p.created_at),
    problem: p.problem_title,
    duration: p.duration_seconds,
    completed: p.completed,
    estimatedHRReduction: p.estimated_hr_reduction ?? 0,
  };
}

function rowToCached(row: {
  id: string;
  created_at: string;
  problem_title: string;
  duration_seconds: number;
  completed: boolean;
  estimated_hr_reduction?: number;
}): CachedSession {
  return {
    id: row.id,
    date: row.created_at,
    problem: row.problem_title,
    duration: row.duration_seconds,
    completed: row.completed,
    estimatedHRReduction: row.estimated_hr_reduction ?? 0,
  };
}

/**
 * Insert a breathing session for the current user.
 * When online: saves to Supabase. When offline: queues locally and syncs when back online.
 */
export const insertSession = async (session: {
  problem_title: string;
  protocol: string;
  duration_seconds: number;
  completed?: boolean;
  estimated_hr_reduction?: number;
}): Promise<{ error: Error | null }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };

  const payload: PendingSession = {
    user_id: user.id,
    problem_title: session.problem_title,
    protocol: session.protocol,
    duration_seconds: session.duration_seconds,
    completed: session.completed ?? true,
    estimated_hr_reduction: session.estimated_hr_reduction ?? 0,
    created_at: new Date().toISOString(),
  };

  const online = await isOnline();
  if (online) {
    const row: BreathingSessionInsert = {
      user_id: user.id,
      problem_title: session.problem_title,
      protocol: session.protocol,
      duration_seconds: session.duration_seconds,
      completed: session.completed ?? true,
      estimated_hr_reduction: session.estimated_hr_reduction ?? 0,
    };
    const { error } = await supabase.from('breathing_sessions').insert(row);
    if (!error) {
      // Refresh cache so next fetchSessions is up to date
      const pending = await getPendingSessions(user.id);
      const { data } = await supabase
        .from('breathing_sessions')
        .select('id, problem_title, duration_seconds, completed, estimated_hr_reduction, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      const cached = (data ?? []).map((r) => rowToCached(r));
      await setCachedSessions(user.id, cached);
    }
    return { error: error ?? null };
  }

  await addPendingSession(user.id, payload);
  return { error: null };
};

/**
 * Fetch breathing sessions for the current user (newest first).
 * When online: fetches from Supabase, merges pending, caches result. When offline: returns cache + pending.
 */
export const fetchSessions = async (limit = 50): Promise<SessionData[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const pending = await getPendingSessions(user.id);
  const pendingAsData = pending.map((p, i) => pendingToSessionData(p, i));

  const online = await isOnline();
  if (!online) {
    const cached = await getCachedSessions(user.id);
    const cachedAsData: SessionData[] = cached.map((c) => ({
      id: c.id,
      date: new Date(c.date),
      problem: c.problem,
      duration: c.duration,
      completed: c.completed,
      estimatedHRReduction: c.estimatedHRReduction,
    }));
    const combined = [...pendingAsData, ...cachedAsData];
    combined.sort((a, b) => b.date.getTime() - a.date.getTime());
    return combined.slice(0, limit);
  }

  const { data, error } = await supabase
    .from('breathing_sessions')
    .select('id, problem_title, duration_seconds, completed, estimated_hr_reduction, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    if (__DEV__) console.error('Error fetching sessions:', error);
    const cached = await getCachedSessions(user.id);
    const cachedAsData = cached.map((c) => ({
      id: c.id,
      date: new Date(c.date),
      problem: c.problem,
      duration: c.duration,
      completed: c.completed,
      estimatedHRReduction: c.estimatedHRReduction,
    }));
    const combined = [...pendingAsData, ...cachedAsData];
    combined.sort((a, b) => b.date.getTime() - a.date.getTime());
    return combined.slice(0, limit);
  }

  const fromDb = (data ?? []).map((row) => ({
    id: row.id,
    date: new Date(row.created_at),
    problem: row.problem_title,
    duration: row.duration_seconds,
    completed: row.completed,
    estimatedHRReduction: row.estimated_hr_reduction ?? 0,
  }));

  const combined = [...pendingAsData, ...fromDb];
  combined.sort((a, b) => b.date.getTime() - a.date.getTime());

  await setCachedSessions(
    user.id,
    (data ?? []).map((r) => rowToCached(r))
  );

  return combined.slice(0, limit);
};

/**
 * Flush pending sessions to Supabase (call when coming back online).
 * Returns number of successfully synced sessions.
 */
export const flushPendingSessions = async (): Promise<number> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const pending = await getPendingSessions(user.id);
  if (pending.length === 0) return 0;

  let synced = 0;
  const remaining: PendingSession[] = [];

  for (const p of pending) {
    const { error } = await supabase.from('breathing_sessions').insert({
      user_id: p.user_id,
      problem_title: p.problem_title,
      protocol: p.protocol,
      duration_seconds: p.duration_seconds,
      completed: p.completed,
      estimated_hr_reduction: p.estimated_hr_reduction,
    });
    if (error) {
      remaining.push(p);
      if (__DEV__) console.warn('Failed to sync session:', error);
    } else {
      synced++;
    }
  }

  await setPendingSessions(user.id, remaining);
  return synced;
}
