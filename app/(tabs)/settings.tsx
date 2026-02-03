import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Camera, Heart, Info, Circle as HelpCircle, LogOut, User, WifiOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { logout, getUser, getProfileSettings, updateProfileSettings } from '@/utils/auth';
import { useIsOnline } from '@/hooks/useIsOnline';

export default function SettingsScreen() {
  const router = useRouter();
  const isOnline = useIsOnline();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [heartRateEnabled, setHeartRateEnabled] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  const [loadingSettings, setLoadingSettings] = React.useState(true);

  React.useEffect(() => {
    loadUserAndSettings();
  }, []);

  const loadUserAndSettings = async () => {
    const [user, settings] = await Promise.all([getUser(), getProfileSettings()]);
    if (user) setUserEmail(user.email);
    if (settings) {
      setNotificationsEnabled(settings.notifications_enabled);
      setHeartRateEnabled(settings.heart_rate_enabled);
    }
    setLoadingSettings(false);
  };

  const handleNotificationsToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await updateProfileSettings({ notifications_enabled: value });
  };

  const handleHeartRateToggle = async (value: boolean) => {
    setHeartRateEnabled(value);
    await updateProfileSettings({ heart_rate_enabled: value });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? You can sign in again to access your data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  const settingsItems = [
    {
      section: 'Features',
      items: [
        {
          id: 'notifications',
          title: 'Smart Reminders',
          subtitle: 'Get notified when stress patterns are detected',
          icon: Bell,
          type: 'toggle' as const,
          value: notificationsEnabled,
          onToggle: handleNotificationsToggle,
        },
        {
          id: 'heartrate',
          title: 'Heart Rate Monitoring',
          subtitle: 'Use camera for PPG-based measurements',
          icon: Heart,
          type: 'toggle' as const,
          value: heartRateEnabled,
          onToggle: handleHeartRateToggle,
        },
      ],
    },
    {
      section: 'Support',
      items: [
        {
          id: 'how-it-works',
          title: 'How It Works',
          subtitle: 'Science behind breathing protocols',
          icon: Info,
          type: 'action' as const,
        },
        {
          id: 'help',
          title: 'Help & FAQ',
          subtitle: 'Common questions and troubleshooting',
          icon: HelpCircle,
          type: 'action' as const,
        },
      ],
    },
  ];

  const handleActionPress = (id: string) => {
    // Handle navigation to info screens
    console.log('Action pressed:', id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your control experience</Text>
        </View>

        {!isOnline && (
          <View style={styles.offlineBanner}>
            <WifiOff size={18} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.offlineText}>Offline. Changes will sync when you're back online.</Text>
          </View>
        )}

        {settingsItems.map((section) => (
          <View key={section.section} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            
            <View style={styles.sectionContent}>
              {section.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.settingItem}
                    onPress={() => item.type === 'action' && handleActionPress(item.id)}
                    disabled={item.type === 'toggle'}
                    activeOpacity={item.type === 'action' ? 0.7 : 1}
                  >
                    <View style={styles.settingLeft}>
                      <View style={styles.settingIconContainer}>
                        <IconComponent size={20} color="#6B7280" strokeWidth={2} />
                      </View>
                      
                      <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>{item.title}</Text>
                        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                      </View>
                    </View>

                    {item.type === 'toggle' && (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                        thumbColor={item.value ? '#2563EB' : '#FFFFFF'}
                        ios_backgroundColor="#E5E7EB"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            {/* User Info */}
            <View style={styles.accountCard}>
              <View style={styles.accountHeader}>
                <View style={styles.userIconContainer}>
                  <User size={24} color="#6366f1" strokeWidth={2} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userLabel}>Logged in as</Text>
                  <Text style={styles.userEmail}>{userEmail || 'Loading...'}</Text>
                </View>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <LogOut size={20} color="#dc2626" strokeWidth={2} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>Breathing Control v1.0</Text>
            <Text style={styles.aboutText}>
              Performance-focused breathing tool designed for immediate physiological control. 
              Based on proven respiratory protocols for stress regulation and nervous system optimization.
            </Text>
            
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
              <Text style={styles.disclaimerText}>
                This app provides breathing exercises for wellness purposes only. 
                Heart rate measurements are estimates. Consult healthcare professionals for medical advice.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built for professionals who need immediate control
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionContent: {
    paddingHorizontal: 20,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  disclaimer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
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
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
  },
});