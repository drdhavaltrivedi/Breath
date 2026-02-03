import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Sparkles, Lock, Inbox, CheckCircle } from 'lucide-react-native';
import SpaceBackground from './SpaceBackground';
import { signIn, signUp, resetPasswordForEmail, validateEmail } from '@/utils/auth';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
}

const GMAIL_URL = 'https://mail.google.com/mail/u/0/#inbox';
const APPLE_MAIL_URL = 'message://';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!forgotPassword) {
      if (!password.trim()) {
        Alert.alert('Error', 'Please enter your password');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (forgotPassword) {
        const { error } = await resetPasswordForEmail(email.trim());
        if (error) {
          Alert.alert('Reset failed', error.message);
          setIsLoading(false);
          return;
        }
        setResetEmail(email.trim());
        setResetEmailSent(true);
        setForgotPassword(false);
        setIsLoading(false);
        return;
      }
      if (isSignUp) {
        const { error } = await signUp(email.trim(), password);
        if (error) {
          Alert.alert('Sign up failed', error.message);
          setIsLoading(false);
          return;
        }
        setVerificationEmail(email.trim());
        setVerificationSent(true);
        setIsSignUp(false);
      } else {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          Alert.alert('Sign in failed', error.message);
          setIsLoading(false);
          return;
        }
        onLoginSuccess(email);
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openGmail = () => {
    Linking.openURL(GMAIL_URL).catch(() =>
      Alert.alert('Cannot open app', 'Install Gmail or open your email app manually.')
    );
  };

  const openMail = () => {
    Linking.openURL(Platform.OS === 'ios' ? APPLE_MAIL_URL : GMAIL_URL).catch(() =>
      Alert.alert('Cannot open app', 'Open your email app manually.')
    );
  };

  const backToSignIn = () => {
    setVerificationSent(false);
    setVerificationEmail('');
  };

  const backFromForgot = () => {
    setForgotPassword(false);
  };

  const backFromResetSent = () => {
    setResetEmailSent(false);
    setResetEmail('');
  };

  // Password reset email sent
  if (resetEmailSent) {
    return (
      <View style={styles.container}>
        <SpaceBackground />
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.verifyIconContainer}>
            <LinearGradient
              colors={['#8b5cf6', '#6366f1', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Mail size={48} color="#ffffff" />
            </LinearGradient>
          </View>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a password reset link to{'\n'}
            <Text style={styles.verifyEmail}>{resetEmail}</Text>
          </Text>
          <Text style={styles.verifyHint}>
            Open the email and tap the link to set a new password. Then come back and sign in.
          </Text>
          <View style={styles.openEmailBox}>
            <View style={styles.openEmailRow}>
              <TouchableOpacity style={styles.openEmailButton} onPress={openGmail} activeOpacity={0.8}>
                <Mail size={20} color="#fff" />
                <Text style={styles.openEmailButtonText}>Gmail</Text>
              </TouchableOpacity>
              {Platform.OS === 'ios' && (
                <TouchableOpacity style={styles.openEmailButton} onPress={openMail} activeOpacity={0.8}>
                  <Inbox size={20} color="#fff" />
                  <Text style={styles.openEmailButtonText}>Mail</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.verifiedButton} onPress={backFromResetSent} activeOpacity={0.8}>
            <Text style={styles.verifiedButtonText}>Back to sign in</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // Verification sent: show "check your email" + Open Gmail / Open Mail / I've verified
  if (verificationSent) {
    return (
      <View style={styles.container}>
        <SpaceBackground />
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.verifyIconContainer}>
            <LinearGradient
              colors={['#8b5cf6', '#6366f1', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Inbox size={48} color="#ffffff" />
            </LinearGradient>
          </View>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a verification link to{'\n'}
            <Text style={styles.verifyEmail}>{verificationEmail}</Text>
          </Text>
          <Text style={styles.verifyHint}>
            Open the email and tap the link to verify your account. Then come back and sign in.
          </Text>

          <View style={styles.openEmailBox}>
            <Text style={styles.openEmailLabel}>Open email app</Text>
            <View style={styles.openEmailRow}>
              <TouchableOpacity style={styles.openEmailButton} onPress={openGmail} activeOpacity={0.8}>
                <Mail size={20} color="#fff" />
                <Text style={styles.openEmailButtonText}>Gmail</Text>
              </TouchableOpacity>
              {Platform.OS === 'ios' && (
                <TouchableOpacity style={styles.openEmailButton} onPress={openMail} activeOpacity={0.8}>
                  <Inbox size={20} color="#fff" />
                  <Text style={styles.openEmailButtonText}>Mail</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.verifiedButton} onPress={backToSignIn} activeOpacity={0.8}>
            <CheckCircle size={20} color="#8b5cf6" />
            <Text style={styles.verifiedButtonText}>I've verified – take me to sign in</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SpaceBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#8b5cf6', '#6366f1', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Sparkles size={48} color="#ffffff" />
            </LinearGradient>
          </View>

          <Text style={styles.title}>
            {forgotPassword ? 'Reset password' : 'Welcome to Breath'}
          </Text>
          <Text style={styles.subtitle}>
            {forgotPassword
              ? 'Enter your email and we’ll send you a link to set a new password.'
              : 'Master your breathing, master your mind'}
          </Text>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#6b7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                accessibilityLabel="Email address"
              />
            </View>

            {!forgotPassword && (
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password (min 6 characters)"
                  placeholderTextColor="#6b7280"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!isLoading}
                  accessibilityLabel="Password"
                />
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
              accessibilityLabel={forgotPassword ? 'Send reset link' : isSignUp ? 'Create account' : 'Sign in'}
              accessibilityRole="button"
            >
              <LinearGradient
                colors={isLoading ? ['#6b7280', '#4b5563'] : ['#8b5cf6', '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {isLoading
                    ? 'Please wait...'
                    : forgotPassword
                      ? 'Send reset link'
                      : isSignUp
                        ? 'Create account'
                        : 'Sign in'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {forgotPassword ? (
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={backFromForgot}
                disabled={isLoading}
              >
                <Text style={styles.toggleText}>Back to sign in</Text>
              </TouchableOpacity>
            ) : (
              <>
                {!isSignUp && (
                  <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setForgotPassword(true)}
                    disabled={isLoading}
                  >
                    <Text style={styles.toggleText}>Forgot password?</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.toggleButton, !isSignUp && styles.toggleButtonExtra]}
                  onPress={() => setIsSignUp(!isSignUp)}
                  disabled={isLoading}
                >
                  <Text style={styles.toggleText}>
                    {isSignUp
                      ? 'Already have an account? Sign in'
                      : "Don't have an account? Create one"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <Text style={styles.footer}>
            Your data is synced securely with your account
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  toggleButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  toggleButtonExtra: {
    marginTop: 8,
  },
  toggleText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    marginTop: 24,
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  verifyIconContainer: {
    marginBottom: 24,
  },
  verifyEmail: {
    color: '#a5b4fc',
    fontWeight: '700',
  },
  verifyHint: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  openEmailBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    padding: 20,
    marginBottom: 20,
  },
  openEmailLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  openEmailRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  openEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  openEmailButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  verifiedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  verifiedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a5b4fc',
  },
});

export default LoginScreen;
