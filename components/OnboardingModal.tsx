import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, Clock, Brain } from 'lucide-react-native';

interface OnboardingModalProps {
  visible: boolean;
  onComplete: (responses: OnboardingResponse) => void;
}

interface OnboardingResponse {
  primaryGoal: string;
  experienceLevel: string;
  notificationsWanted: boolean;
}

const goals = [
  { id: 'stress', label: 'Manage Stress & Anxiety', icon: Target },
  { id: 'sleep', label: 'Improve Sleep Quality', icon: Clock },
  { id: 'focus', label: 'Enhance Focus & Performance', icon: Brain },
];

const experienceLevels = [
  { id: 'new', label: 'New to breathing techniques' },
  { id: 'familiar', label: 'Some experience with breathing exercises' },
  { id: 'advanced', label: 'Regular practitioner' },
];

export default function OnboardingModal({ visible, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [wantsNotifications, setWantsNotifications] = useState(false);

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      onComplete({
        primaryGoal: selectedGoal,
        experienceLevel: selectedExperience,
        notificationsWanted: wantsNotifications,
      });
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 0: return selectedGoal !== '';
      case 1: return selectedExperience !== '';
      case 2: return true; // Notifications step is always valid
      default: return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your main goal?</Text>
            <Text style={styles.stepSubtitle}>Select your primary challenge</Text>
            
            <View style={styles.optionsList}>
              {goals.map((goal) => {
                const IconComponent = goal.icon;
                return (
                  <TouchableOpacity
                    key={goal.id}
                    style={[
                      styles.optionCard,
                      selectedGoal === goal.id && styles.optionCardSelected
                    ]}
                    onPress={() => setSelectedGoal(goal.id)}
                    activeOpacity={0.7}
                  >
                    <IconComponent 
                      size={24} 
                      color={selectedGoal === goal.id ? '#2563EB' : '#6B7280'} 
                      strokeWidth={2} 
                    />
                    <Text style={[
                      styles.optionText,
                      selectedGoal === goal.id && styles.optionTextSelected
                    ]}>
                      {goal.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Experience level?</Text>
            <Text style={styles.stepSubtitle}>This helps us customize your protocols</Text>
            
            <View style={styles.optionsList}>
              {experienceLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.optionCard,
                    selectedExperience === level.id && styles.optionCardSelected
                  ]}
                  onPress={() => setSelectedExperience(level.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionText,
                    selectedExperience === level.id && styles.optionTextSelected
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Smart reminders?</Text>
            <Text style={styles.stepSubtitle}>Get notified when it's time to regulate</Text>
            
            <View style={styles.optionsList}>
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  wantsNotifications && styles.optionCardSelected
                ]}
                onPress={() => setWantsNotifications(true)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.optionText,
                  wantsNotifications && styles.optionTextSelected
                ]}>
                  Yes, send helpful reminders
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  !wantsNotifications && styles.optionCardSelected
                ]}
                onPress={() => setWantsNotifications(false)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.optionText,
                  !wantsNotifications && styles.optionTextSelected
                ]}>
                  No thanks, I'll use it as needed
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((step + 1) / 3) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {step + 1} of 3
          </Text>
        </View>

        <View style={styles.content}>
          {renderStep()}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !isStepValid() && styles.nextButtonDisabled
            ]}
            onPress={handleNext}
            disabled={!isStepValid()}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {step === 2 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 32,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 16,
  },
  optionCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  optionTextSelected: {
    color: '#2563EB',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  nextButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});