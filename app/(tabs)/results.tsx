import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Clock, Zap, Target, Inbox, WifiOff } from 'lucide-react-native';
import { fetchSessions, type SessionData } from '@/lib/sessions';
import { useIsOnline } from '@/hooks/useIsOnline';

export default function ResultsScreen() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isOnline = useIsOnline();

  const loadSessions = useCallback(async () => {
    const data = await fetchSessions();
    setSessions(data);
  }, []);

  useEffect(() => {
    loadSessions().finally(() => setLoading(false));
  }, [loadSessions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  };

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.completed).length;
  const totalTimeSpent = sessions.reduce((acc, s) => acc + s.duration, 0);
  const avgHRReduction =
    totalSessions > 0
      ? sessions.reduce((acc, s) => acc + s.estimatedHRReduction, 0) / totalSessions
      : 0;
  const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading your results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Results</Text>
          <Text style={styles.subtitle}>Measurable physiological control</Text>
        </View>

        {!isOnline && (
          <View style={styles.offlineBanner}>
            <WifiOff size={18} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.offlineText}>You're offline. Data will sync when you're back online.</Text>
          </View>
        )}

        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Inbox size={48} color="#9CA3AF" strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptyText}>
              Complete a breathing exercise from the Control tab to see your results here.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Target size={20} color="#2563EB" strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{completedSessions}</Text>
                <Text style={styles.statLabel}>Sessions Complete</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Clock size={20} color="#16A34A" strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{Math.round(totalTimeSpent / 60)}m</Text>
                <Text style={styles.statLabel}>Total Time</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <TrendingUp size={20} color="#DC2626" strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>-{Math.round(avgHRReduction)}</Text>
                <Text style={styles.statLabel}>Avg HR Drop</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Zap size={20} color="#D97706" strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{Math.round(completionRate)}%</Text>
                <Text style={styles.statLabel}>Completion</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Sessions</Text>
              <View style={styles.sessionsList}>
                {sessions.map((session) => (
                  <View key={session.id} style={styles.sessionCard}>
                    <View style={styles.sessionHeader}>
                      <Text style={styles.sessionProblem}>{session.problem}</Text>
                      <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
                    </View>

                    <View style={styles.sessionMetrics}>
                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>Duration</Text>
                        <Text style={styles.metricValue}>{formatDuration(session.duration)}</Text>
                      </View>

                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>HR Reduction</Text>
                        <Text style={[styles.metricValue, styles.hrReduction]}>
                          -{session.estimatedHRReduction} bpm
                        </Text>
                      </View>

                      <View style={styles.statusIndicator}>
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: session.completed ? '#16A34A' : '#EF4444' },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance Summary</Text>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryText}>
                  You've completed {completedSessions} breathing sessions, spending{' '}
                  {Math.round(totalTimeSpent / 60)} minutes in active physiological control. Your
                  average heart rate reduction of {Math.round(avgHRReduction)} bpm demonstrates
                  measurable stress regulation.
                </Text>

                <View style={styles.insight}>
                  <Text style={styles.insightTitle}>Key Insight</Text>
                  <Text style={styles.insightText}>
                    {avgHRReduction > 10
                      ? "Strong parasympathetic activation - you're effectively regulating stress responses."
                      : 'Good progress - consistent practice will improve your physiological control.'}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  offlineText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
    flex: 1,
  },
  emptyState: {
    paddingHorizontal: 32,
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  sessionsList: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionProblem: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  sessionDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  sessionMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  hrReduction: {
    color: '#16A34A',
  },
  statusIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  insight: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
