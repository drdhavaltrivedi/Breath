import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={24} color="#111827" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.updated}>Last updated: February 2026</Text>

        <Text style={styles.paragraph}>
          Welcome to Breath. By downloading, installing, or using the Breath app ("Service"), you agree to these Terms of Service ("Terms"). If you do not agree, do not use the app.
        </Text>

        <Text style={styles.h2}>Use of the Service</Text>
        <Text style={styles.paragraph}>
          Breath provides breathing exercises and meditation tools for wellness and stress relief. You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for keeping your account credentials secure.
        </Text>

        <Text style={styles.h2}>Not Medical Advice</Text>
        <Text style={styles.paragraph}>
          The app is for general wellness and relaxation only. It is not a substitute for professional medical advice, diagnosis, or treatment. Heart rate or other in-app measurements are estimates and may be inaccurate. If you have a medical condition or concerns, consult a healthcare provider before relying on the app.
        </Text>

        <Text style={styles.h2}>Account and Data</Text>
        <Text style={styles.paragraph}>
          You may need to create an account to use certain features. You must provide accurate information. Your use of the Service is also governed by our Privacy Policy, which describes how we collect and use your data.
        </Text>

        <Text style={styles.h2}>Intellectual Property</Text>
        <Text style={styles.paragraph}>
          The app, including its design, content, and software, is owned by us or our licensors. You may not copy, modify, distribute, or reverse-engineer the app without permission.
        </Text>

        <Text style={styles.h2}>Disclaimer of Warranties</Text>
        <Text style={styles.paragraph}>
          The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or free of harmful components.
        </Text>

        <Text style={styles.h2}>Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data or profits, arising from your use of the Service.
        </Text>

        <Text style={styles.h2}>Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We may update these Terms from time to time. We will indicate changes by updating the "Last updated" date. Continued use of the Service after changes constitutes acceptance of the new Terms.
        </Text>

        <Text style={styles.h2}>Contact</Text>
        <Text style={styles.paragraph}>
          For questions about these Terms or the Service, contact us through the app or the Play Store listing.
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
