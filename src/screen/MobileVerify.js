import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';

import OtpInput from '../components/otpInput/OtpInput';
import { apiCall } from '../const/api';
import showToast from '../utils/ShowToast';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../context/LoginProvider';
import { getFcmToken } from '../utils/FcmTokenUtils';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#0F172A',
  card: '#111827',
  card2: '#1E293B',
  white: '#FFFFFF',
  text: '#F8FAFC',
  subText: '#94A3B8',
  primary: '#7C3AED',
  secondary: '#A855F7',
  cyan: '#06B6D4',
  green: '#10B981',
  orange: '#F59E0B',
  pink: '#EC4899',
  red: '#EF4444',
  border: 'rgba(255,255,255,0.08)',
};

export default function MobileVerify({ route, navigation }) {
  const mobile = route?.params?.mobile || '';
  const details = route?.params?.details || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { setIsLoggedIn } = useLogin();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.spring(translateAnim, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  

  const handleResendOTP = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendCountdown(30);

    const timer = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    try {
      const requestBody = {
        mobile: mobile,
      };
      
      console.log('Resend OTP Request Body:', requestBody);
      
      const response = await axios.post(
        `${apiCall.mainUrl}/users/request/otp`,
        requestBody,
      );

      console.log('Resend OTP Response:', response.data);

      if (response.data && response.data.success) {
        showToast('OTP resent successfully!');
      } else {
        showToast('Failed to resend OTP. Please try again.');

        setCanResend(true);
        setResendCountdown(0);
      }
    } catch (error) {
      console.log('Resend OTP Error:', error.response?.data || error.message);
      showToast('Failed to resend OTP. Please try again.');

      setCanResend(true);
      setResendCountdown(0);
    }
  };
const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    console.log('OTP String:', otpString);
    console.log('Mobile:', mobile);
    console.log('Session ID:', details);

    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const fcmToken = await getFcmToken();
      
      const requestBody = {
        sessionId: details,
        otp: otpString,
        mobile: mobile,
        fcmToken: fcmToken,
        role:"doctor",
      };
      
      console.log('Request Body:', requestBody);

      const response = await axios.post(
        `${apiCall.mainUrl}/users/verify/otp`,
        requestBody,
      );

      console.log('Response:', response.data);

      setLoading(false);

      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);

        setIsLoggedIn(true);

        showToast('OTP Verified!');
      } else {
        setError(
          response.data.msg || 'Failed to verify OTP. Please try again.',
        );
      }
    } catch (err) {
      setLoading(false);
      console.log('Error:', err.response?.data || err.message);
      setError('Failed to verify OTP. Please try again.');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.background}
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        
        {/* HEADER */}
        <LinearGradient
          colors={['#111827', '#0F172A', '#1E1B4B']}
          style={styles.header}>
          
          <View style={styles.glow1} />
          <View style={styles.glow2} />

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: translateAnim },
                { scale: scaleAnim },
              ],
            }}>
            
            <View style={styles.logoWrapper}>
              <View style={styles.logoCircle}>
                <Feather name="shield" size={42} color="#fff" />
              </View>
            </View>

            <Text style={styles.title}>OTP Verification</Text>

            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to your mobile number
            </Text>

            <View style={styles.mobileBox}>
              <Feather
                name="smartphone"
                size={16}
                color={COLORS.cyan}
              />

              <Text style={styles.mobileText}>
                +91 {mobile}
              </Text>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* CONTENT */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateAnim }],
            },
          ]}>
          
          <View style={styles.card}>
            
            {/* OTP Header */}
            <View style={styles.sectionHeader}>
              <View style={styles.iconBox}>
                <Feather
                  name="lock"
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <Text style={styles.sectionTitle}>
                Verification Code
              </Text>
            </View>

            {/* OTP INPUT */}
            <View style={styles.otpWrapper}>
              <OtpInput otp={otp} setOtp={setOtp} />
            </View>

            {/* ERROR */}
            {error ? (
              <View style={styles.errorContainer}>
                <Feather
                  name="alert-circle"
                  size={15}
                  color={COLORS.red}
                />

                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* VERIFY BUTTON */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.verifyBtn}
              onPress={handleVerifyOTP}
              disabled={loading}>
              
              <LinearGradient
                colors={['#7C3AED', '#A855F7']}
                style={styles.verifyGradient}>
                
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.verifyText}>
                      Verify OTP
                    </Text>

                    <Feather
                      name="arrow-right"
                      size={18}
                      color="#fff"
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* RESEND */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendLabel}>
                Didn’t receive the code?
              </Text>

              <TouchableOpacity
                disabled={!canResend}
                onPress={handleResendOTP}>
                
                <Text
                  style={[
                    styles.resendText,
                    {
                      opacity: canResend ? 1 : 0.5,
                    },
                  ]}>
                  {canResend
                    ? 'Resend OTP'
                    : `Resend in ${resendCountdown}s`}
                </Text>
              </TouchableOpacity>
            </View>

            {/* BACK */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}>
              
              <Feather
                name="chevron-left"
                size={18}
                color={COLORS.subText}
              />

              <Text style={styles.backText}>
                Back to Login
              </Text>
            </TouchableOpacity>

            {/* SECURITY */}
            <View style={styles.securityBox}>
              <Feather
                name="shield"
                size={14}
                color={COLORS.green}
              />

              <Text style={styles.securityText}>
                Secure & Encrypted Verification
              </Text>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 50,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'hidden',
  },

  glow1: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 220,
    height: 220,
    borderRadius: 120,
    backgroundColor: 'rgba(124,58,237,0.25)',
  },

  glow2: {
    position: 'absolute',
    bottom: -60,
    left: -30,
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: 'rgba(6,182,212,0.15)',
  },

  logoWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },

  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  title: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  subtitle: {
    color: '#B6C2D1',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  mobileBox: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  mobileText: {
    color: COLORS.white,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
  },

  content: {
    flex: 1,
    marginTop: -28,
    paddingHorizontal: 18,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: 'rgba(124,58,237,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },

  otpWrapper: {
    marginBottom: 16,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  errorText: {
    color: COLORS.red,
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
  },

  verifyBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 10,
  },

  verifyGradient: {
    height: 58,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  verifyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },

  resendContainer: {
    marginTop: 24,
    alignItems: 'center',
  },

  resendLabel: {
    color: COLORS.subText,
    fontSize: 13,
    marginBottom: 8,
  },

  resendText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '700',
  },

  backBtn: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    color: COLORS.subText,
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },

  securityBox: {
    marginTop: 30,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  securityText: {
    color: COLORS.green,
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600',
  },
});