import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Redirect } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import SplashScreen from '@/components/SplashScreen';
import LoginScreen from '@/components/LoginScreen';
import OnboardingModal from '@/components/OnboardingModal';
import { isLoggedIn, isOnboardingComplete, setOnboardingComplete } from '@/utils/auth';
import { checkSupabaseConnection, type ConnectionStatus } from '@/lib/supabaseCheck';

export default function IndexScreen() {
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [connection, setConnection] = useState<ConnectionStatus | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const status = await checkSupabaseConnection();
      if (cancelled) return;
      setConnection(status);
      if (!status.configured || !status.auth || !status.db) {
        setLoading(false);
        return;
      }
      try {
        const loggedIn = await isLoggedIn();
        if (cancelled) return;
        setIsAuthenticated(loggedIn);
        if (loggedIn) {
          const done = await isOnboardingComplete();
          if (!cancelled) setShowOnboarding(!done);
        }
      } catch (error) {
        if (__DEV__) console.error('Error checking auth status:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  // Re-check auth when screen is focused (e.g. after logout) so we show login instead of tabs
  useFocusEffect(
    React.useCallback(() => {
      if (!connection?.configured || !connection?.auth || !connection?.db) return;
      let cancelled = false;
      (async () => {
        const loggedIn = await isLoggedIn();
        if (cancelled) return;
        setIsAuthenticated(loggedIn);
        if (loggedIn) {
          const done = await isOnboardingComplete();
          if (!cancelled) setShowOnboarding(!done);
        } else {
          setShowOnboarding(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [connection])
  );

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = async () => {
    await setOnboardingComplete();
    setShowOnboarding(false);
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Supabase not configured or connection failed
  if (connection && (!connection.configured || !connection.auth || !connection.db)) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Supabase not connected</Text>
        <Text style={styles.errorText}>{connection?.error ?? 'Unknown error'}</Text>
        <Text style={styles.errorHint}>
          Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env, then run the SQL in
          supabase/migrations/001_initial.sql in your Supabase project.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setConnection(null);
            setLoading(true);
            setRetryKey((k) => k + 1);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show loading indicator while checking auth
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  // If authenticated and onboarding done (or skipped), redirect to tabs
  if (isAuthenticated && !showOnboarding) {
    return <Redirect href="/(tabs)" />;
  }

  // Onboarding: show once after login if not yet complete
  if (isAuthenticated && showOnboarding) {
    return (
      <View style={styles.loadingContainer}>
        <OnboardingModal visible onComplete={handleOnboardingComplete} />
      </View>
    );
  }

  // Show login screen if not authenticated
  return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f87171',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorHint: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});