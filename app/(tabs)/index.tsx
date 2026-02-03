import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Zap, Moon, Target, Flame, Clock } from 'lucide-react-native';

const problems = [
  {
    id: 'anxiety',
    title: 'Reduce Anxiety',
    subtitle: 'Before meetings, calls, presentations',
    duration: '2-3 min',
    protocol: '4-6-breathing',
    icon: Zap,
    color: '#DC2626',
  },
  {
    id: 'sleep',
    title: 'Fall Asleep Fast',
    subtitle: 'Racing mind, can\'t shut down',
    duration: '3-4 min',
    protocol: 'extended-exhale',
    icon: Moon,
    color: '#7C3AED',
  },
  {
    id: 'focus',
    title: 'Regain Focus',
    subtitle: 'Overwhelmed, scattered thinking',
    duration: '2 min',
    protocol: 'box-breathing',
    icon: Target,
    color: '#2563EB',
  },
  {
    id: 'anger',
    title: 'Calm Anger',
    subtitle: 'Frustrated, need to reset',
    duration: '2-3 min',
    protocol: 'triangle-breathing',
    icon: Flame,
    color: '#D97706',
  },
  {
    id: 'performance',
    title: 'Pre-Meeting Control',
    subtitle: 'Peak state activation',
    duration: '90 sec',
    protocol: 'power-breathing',
    icon: Clock,
    color: '#16A34A',
  },
];

export default function ControlScreen() {
  const router = useRouter();

  const handleProblemSelect = (problem: typeof problems[0]) => {
    router.push({
      pathname: '/(tabs)/breathe',
      params: {
        problemId: problem.id,
        title: problem.title,
        protocol: problem.protocol,
        duration: problem.duration,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Take Control</Text>
          <Text style={styles.subtitle}>Select your current state challenge</Text>
        </View>

        <View style={styles.problemsList}>
          {problems.map((problem) => {
            const IconComponent = problem.icon;
            return (
              <TouchableOpacity
                key={problem.id}
                style={styles.problemCard}
                onPress={() => handleProblemSelect(problem)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: problem.color }]}>
                  <IconComponent size={24} color="#FFFFFF" strokeWidth={2} />
                </View>
                
                <View style={styles.problemContent}>
                  <View style={styles.problemHeader}>
                    <Text style={styles.problemTitle}>{problem.title}</Text>
                    <Text style={styles.duration}>{problem.duration}</Text>
                  </View>
                  <Text style={styles.problemSubtitle}>{problem.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Each protocol delivers measurable results in under 3 minutes
          </Text>
        </View>
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
  problemsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  problemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  problemContent: {
    flex: 1,
  },
  problemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  problemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  duration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  problemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '500',
  },
});