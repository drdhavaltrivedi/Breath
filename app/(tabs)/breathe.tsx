import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react-native';
import { insertSession } from '@/lib/sessions';

interface BreathingProtocol {
  inhale: number;
  hold: number;
  exhale: number;
  holdEmpty?: number;
  cycles: number;
}

const protocols: Record<string, BreathingProtocol> = {
  '4-6-breathing': { inhale: 4, hold: 0, exhale: 6, cycles: 12 },
  'extended-exhale': { inhale: 4, hold: 2, exhale: 8, cycles: 10 },
  'box-breathing': { inhale: 4, hold: 4, exhale: 4, holdEmpty: 4, cycles: 8 },
  'triangle-breathing': { inhale: 4, hold: 4, exhale: 4, cycles: 10 },
  'power-breathing': { inhale: 2, hold: 0, exhale: 4, cycles: 15 },
};

const phaseNames = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
  holdEmpty: 'Hold Empty',
};

export default function BreatheScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { title, protocol, duration } = params;

  const [isActive, setIsActive] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<keyof typeof phaseNames>('inhale');
  const [timeInPhase, setTimeInPhase] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const sessionSavedRef = useRef(false);

  const breathingProtocol = protocols[protocol as string] || protocols['4-6-breathing'];
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  // Save completed session to Supabase once
  useEffect(() => {
    if (!isComplete || sessionSavedRef.current || typeof title !== 'string' || typeof protocol !== 'string') return;
    sessionSavedRef.current = true;
    const problemTitle = String(title);
    const protocolSlug = String(protocol);
    const estimatedHr = Math.min(15, Math.round(sessionTime / 20) + 5);
    insertSession({
      problem_title: problemTitle,
      protocol: protocolSlug,
      duration_seconds: sessionTime,
      completed: true,
      estimated_hr_reduction: estimatedHr,
    }).then(({ error }) => {
      if (error) console.error('Failed to save session:', error);
    });
  }, [isComplete, title, protocol, sessionTime]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    
    if (isActive && !isComplete) {
      interval = setInterval(() => {
        setTimeInPhase(prev => {
          const currentPhaseDuration = breathingProtocol[currentPhase] ?? 0;
          if (prev + 1 >= currentPhaseDuration) {
            // Move to next phase
            const phases = Object.keys(breathingProtocol).filter(key => 
              key !== 'cycles' && (breathingProtocol[key as keyof BreathingProtocol] ?? 0) > 0
            ) as Array<keyof typeof phaseNames>;
            
            const currentPhaseIndex = phases.indexOf(currentPhase);
            if (currentPhaseIndex < phases.length - 1) {
              setCurrentPhase(phases[currentPhaseIndex + 1]);
            } else {
              // Cycle complete
              setCurrentPhase(phases[0]);
              setCurrentCycle(prevCycle => {
                const nextCycle = prevCycle + 1;
                if (nextCycle >= breathingProtocol.cycles) {
                  setIsComplete(true);
                  setIsActive(false);
                }
                return nextCycle;
              });
            }
            return 0;
          }
          return prev + 1;
        });
        
        setSessionTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [isActive, currentPhase, breathingProtocol, isComplete]);

  useEffect(() => {
    // Animate breathing circle based on phase
    const isInhaling = currentPhase === 'inhale';
    const isExhaling = currentPhase === 'exhale';
    
    if (isActive) {
      if (isInhaling) {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: breathingProtocol.inhale * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: breathingProtocol.inhale * 1000,
            useNativeDriver: true,
          }),
        ]).start();
      } else if (isExhaling) {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.7,
            duration: breathingProtocol.exhale * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: breathingProtocol.exhale * 1000,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [currentPhase, isActive]);

  const toggleSession = () => {
    if (isComplete) {
      // Reset session
      setIsActive(false);
      setCurrentCycle(0);
      setCurrentPhase('inhale');
      setTimeInPhase(0);
      setSessionTime(0);
      setIsComplete(false);
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0.3);
    } else {
      setIsActive(!isActive);
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setTimeInPhase(0);
    setSessionTime(0);
    setIsComplete(false);
    scaleAnim.setValue(0.7);
    opacityAnim.setValue(0.3);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = currentCycle / breathingProtocol.cycles;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.duration}>{duration}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentCycle + 1} / {breathingProtocol.cycles}
          </Text>
        </View>

        <View style={styles.breathingContainer}>
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          />
          
          <View style={styles.phaseContainer}>
            <Text style={styles.phaseText}>{phaseNames[currentPhase]}</Text>
            <Text style={styles.phaseCounter}>
              {(breathingProtocol[currentPhase] ?? 0) - timeInPhase}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Session Time</Text>
            <Text style={styles.statValue}>{formatTime(sessionTime)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        {!isComplete ? (
          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton]}
            onPress={toggleSession}
            activeOpacity={0.8}
          >
            {isActive ? (
              <Pause size={24} color="#FFFFFF" strokeWidth={2} />
            ) : (
              <Play size={24} color="#FFFFFF" strokeWidth={2} />
            )}
            <Text style={styles.primaryButtonText}>
              {isActive ? 'Pause' : 'Start'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlButton, styles.successButton]}
            onPress={() => router.push('/(tabs)/results')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>View Results</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={resetSession}
          activeOpacity={0.8}
        >
          <RotateCcw size={20} color="#6B7280" strokeWidth={2} />
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  duration: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  breathingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#2563EB',
    position: 'absolute',
  },
  phaseContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  phaseText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  phaseCounter: {
    fontSize: 48,
    fontWeight: '800',
    color: '#2563EB',
  },
  statsContainer: {
    marginBottom: 40,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  successButton: {
    backgroundColor: '#16A34A',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});