import { useEffect, useRef } from 'react';
import { isOnline, subscribeToNetwork } from '@/lib/offline';
import { flushPendingSessions } from '@/lib/sessions';
import { flushPendingProfileSettings } from '@/utils/auth';

async function syncPending(): Promise<void> {
  await flushPendingSessions();
  await flushPendingProfileSettings();
}

/**
 * When the app comes back online (or is already online on mount), flush pending sessions
 * and profile settings to Supabase. Use inside the logged-in area (e.g. tabs layout).
 */
export function useSyncWhenOnline(): void {
  const wasOfflineRef = useRef<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    isOnline().then((online) => {
      if (cancelled) return;
      if (online) {
        wasOfflineRef.current = false;
        syncPending();
      } else {
        wasOfflineRef.current = true;
      }
    });

    const unsubscribe = subscribeToNetwork((connected) => {
      if (!connected) {
        wasOfflineRef.current = true;
        return;
      }
      if (wasOfflineRef.current === true) {
        syncPending();
      }
      wasOfflineRef.current = false;
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);
}
