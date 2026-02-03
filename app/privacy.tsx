import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={24} color="#111827" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.updated}>Last updated: February 2026</Text>

        <Text style={styles.paragraph}>
          Breath ("we," "our," or "the app") is a meditation and breathing exercise app. This Privacy Policy explains how we collect, use, and protect your information when you use our app.
        </Text>

        <Text style={styles.h2}>Information We Collect</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Account information:</Text> When you create an account, we collect your email address and a secure password (handled by our authentication provider). We do not sell or share this with third parties for marketing.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Usage data:</Text> We store your breathing session history (e.g., protocol used, duration, completion status) and app preferences (e.g., notifications, heart rate feature toggle) to provide sync across devices and to show your progress.
        </Text>

        <Text style={styles.h2}>How We Use Your Data</Text>
        <Text style={styles.paragraph}>
          We use your data only to provide and improve the app: to sync your progress across devices, to personalize settings, and to display your statistics. We do not use your data for advertising or tracking.
        </Text>

        <Text style={styles.h2}>Data Storage & Security</Text>
        <Text style={styles.paragraph}>
          Your account and session data are stored securely using Supabase (our backend provider). Data is transmitted over HTTPS. You can delete your account and associated data by contacting us or through in-app account deletion when available.
        </Text>

        <Text style={styles.h2}>No Ads or Third-Party Tracking</Text>
        <Text style={styles.paragraph}>
          We do not show ads and do not use third-party analytics or advertising SDKs that track you across apps or websites.
        </Text>

        <Text style={styles.h2}>Your Rights</Text>
        <Text style={styles.paragraph}>
          You may request access to, correction of, or deletion of your personal data. For account deletion or data requests, contact us using the support option in the app or the contact details in the Play Store listing.
        </Text>

        <Text style={styles.h2}>Changes</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you of material changes by updating the "Last updated" date and, where appropriate, through the app or email.
        </Text>

        <Text style={styles.paragraph}>
          By using Breath, you agree to this Privacy Policy. If you have questions, please contact us through the app or the Play Store listing.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: { marginRight: 8, padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  updated: { fontSize: 13, color: '#6B7280', marginBottom: 16 },
  h2: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 20, marginBottom: 8 },
  paragraph: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 12 },
  bold: { fontWeight: '600', color: '#111827' },
});
