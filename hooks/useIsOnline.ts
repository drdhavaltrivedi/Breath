import { useState, useEffect } from 'react';
import { isOnline, subscribeToNetwork } from '@/lib/offline';

/**
 * Returns current network status. Updates when connectivity changes.
 */
export function useIsOnline(): boolean {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    isOnline().then((value) => {
      if (!cancelled) setOnline(value);
    });

    const unsubscribe = subscribeToNetwork((value) => {
      if (!cancelled) setOnline(value);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return online === null ? true : online;
}
