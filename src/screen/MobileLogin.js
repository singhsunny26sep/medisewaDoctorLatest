import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StatusBar,
  SafeAreaView,
  Animated,
  Easing,
  RefreshControl,
} from 'react-native';

import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { apiCall } from '../const/api';

const { width, height } = Dimensions.get('window');

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

export default function MobileLogin({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.spring(slideAnim, {
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

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 22000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleRequestOTP = async () => {
    if (!mobile) {
      setMobileError('Mobile number is required');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setMobileError('Enter valid 10 digit mobile number');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${apiCall.mainUrl}/users/request/otp`,
        {
          mobile,
        },
      );

      setLoading(false);

      if (
        response.data &&
        response.data.success &&
        response.data.result &&
        response.data.result.Details
      ) {
        const details = response.data.result.Details;

        navigation.navigate('MobileVerify', {
          mobile,
          details,
        });
      } else {
        setMobileError('Failed to send OTP');
      }
    } catch (error) {
      setLoading(false);
      setMobileError('Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={COLORS.background}
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }>
          
          {/* HEADER */}
          <LinearGradient
            colors={['#111827', '#0F172A', '#1E1B4B']}
            style={styles.header}>
            
            {/* GLOW EFFECTS */}
            <Animated.View
              style={[
                styles.glow1,
                {
                  transform: [{ rotate: rotateInterpolate }],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.glow2,
                {
                  transform: [{ rotate: rotateInterpolate }],
                },
              ]}
            />

            <View style={styles.headerTop}>
              <TouchableOpacity style={styles.backBtn}>
                <Feather
                  name="arrow-left"
                  size={22}
                  color={COLORS.white}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.helpBtn}>
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>

            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: pulseAnim }],
              }}>
              
              <View style={styles.logoWrapper}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  style={styles.logoCircle}>
                  
                  <AntDesign
                    name="heart"
                    size={55}
                    color={COLORS.white}
                  />
                </LinearGradient>
              </View>
            </Animated.View>

            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}>
              
              <Text style={styles.welcomeTitle}>
                MediCare+
              </Text>

              <Text style={styles.welcomeSubtitle}>
                Secure healthcare access anytime
              </Text>

              <View style={styles.headerBadge}>
                <Feather
                  name="shield"
                  size={15}
                  color={COLORS.white}
                />

                <Text style={styles.badgeText}>
                  Trusted by 25K+ Patients
                </Text>
              </View>
            </Animated.View>
          </LinearGradient>

          {/* MAIN CARD */}
          <Animated.View
            style={[
              styles.mainCard,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}>
            
            <View style={styles.cardGlow} />

            <Text style={styles.loginTitle}>
              Login Account
            </Text>

            <Text style={styles.loginSubTitle}>
              Enter your registered mobile number
            </Text>

            {/* INPUT */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>
                Mobile Number
              </Text>

              <View
                style={[
                  styles.inputContainer,
                  isFocused && styles.inputFocused,
                  mobileError && styles.inputError,
                ]}>
                
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>
                    +91
                  </Text>
                </View>

                <TextInput
                  value={mobile}
                  maxLength={10}
                  keyboardType="number-pad"
                  placeholder="9876543210"
                  placeholderTextColor="#64748B"
                  style={styles.input}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChangeText={text => {
                    setMobile(text);
                    setMobileError('');
                  }}
                />

                {mobile.length === 10 && (
                  <Feather
                    name="check-circle"
                    size={20}
                    color={COLORS.green}
                    style={{ marginRight: 14 }}
                  />
                )}
              </View>

              {mobileError ? (
                <View style={styles.errorRow}>
                  <Feather
                    name="alert-circle"
                    size={15}
                    color={COLORS.red}
                  />

                  <Text style={styles.errorText}>
                    {mobileError}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={loading}
              onPress={handleRequestOTP}
              style={styles.buttonShadow}>
              
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.loginButton}>
                
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>
                      Continue with OTP
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

            {/* FEATURES */}
            <View style={styles.featureContainer}>
              <View style={styles.featureCard}>
                <View
                  style={[
                    styles.featureIcon,
                    {
                      backgroundColor: 'rgba(124,58,237,0.15)',
                    },
                  ]}>
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={22}
                    color={COLORS.primary}
                  />
                </View>

                <Text style={styles.featureText}>
                  Secure Login
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View
                  style={[
                    styles.featureIcon,
                    {
                      backgroundColor: 'rgba(6,182,212,0.15)',
                    },
                  ]}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={22}
                    color={COLORS.cyan}
                  />
                </View>

                <Text style={styles.featureText}>
                  24/7 Support
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View
                  style={[
                    styles.featureIcon,
                    {
                      backgroundColor: 'rgba(16,185,129,0.15)',
                    },
                  ]}>
                  <MaterialCommunityIcons
                    name="hospital-building"
                    size={22}
                    color={COLORS.green}
                  />
                </View>

                <Text style={styles.featureText}>
                  Trusted Care
                </Text>
              </View>
            </View>

            {/* REGISTER */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>
                New here?
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}>
                
                <Text style={styles.signupBtn}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* HELP */}
            <TouchableOpacity
              style={styles.helpContainer}
              onPress={() =>
                navigation?.navigate?.('ForgotPassword')
              }>
              
              <Feather
                name="help-circle"
                size={16}
                color={COLORS.secondary}
              />

              <Text style={styles.helpText}>
                Need Help?
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2026 MediCare+ Healthcare
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  /* HEADER */

  header: {
    paddingTop: Platform.OS === 'ios' ? 55 : 28,
    paddingHorizontal: 22,
    paddingBottom: 55,
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    overflow: 'hidden',
  },

  glow1: {
    position: 'absolute',
    top: -60,
    right: -30,
    width: 220,
    height: 220,
    borderRadius: 120,
    backgroundColor: 'rgba(124,58,237,0.25)',
  },

  glow2: {
    position: 'absolute',
    bottom: -80,
    left: -30,
    width: 220,
    height: 220,
    borderRadius: 120,
    backgroundColor: 'rgba(6,182,212,0.14)',
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 35,
  },

  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  helpBtn: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },

  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcomeTitle: {
    fontSize: 34,
    color: COLORS.white,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  welcomeSubtitle: {
    color: '#CBD5E1',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
    lineHeight: 22,
  },

  headerBadge: {
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  badgeText: {
    color: COLORS.white,
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 13,
  },

  /* MAIN CARD */

  mainCard: {
    marginHorizontal: 18,
    marginTop: -35,
    backgroundColor: COLORS.card,
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },

  cardGlow: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(124,58,237,0.10)',
  },

  loginTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },

  loginSubTitle: {
    color: COLORS.subText,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
    fontSize: 14,
    lineHeight: 20,
  },

  /* INPUT */

  inputWrapper: {
    marginBottom: 24,
  },

  label: {
    color: COLORS.white,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '700',
  },

  inputContainer: {
    height: 62,
    backgroundColor: COLORS.card2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputFocused: {
    borderColor: COLORS.primary,
  },

  inputError: {
    borderColor: COLORS.red,
  },

  countryCode: {
    height: '100%',
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },

  countryCodeText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },

  input: {
    flex: 1,
    paddingHorizontal: 16,
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  errorText: {
    color: COLORS.red,
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
  },

  /* BUTTON */

  buttonShadow: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 28,
  },

  loginButton: {
    height: 60,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
  },

  /* FEATURES */

  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  featureCard: {
    width: (width - 90) / 3,
    backgroundColor: COLORS.card2,
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  featureIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  featureText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 15,
    paddingHorizontal: 6,
  },

  /* SIGNUP */

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  signupText: {
    color: COLORS.subText,
    fontSize: 14,
  },

  signupBtn: {
    color: COLORS.secondary,
    fontWeight: '800',
    marginLeft: 6,
    fontSize: 14,
  },

  /* HELP */

  helpContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124,58,237,0.10)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
  },

  helpText: {
    color: COLORS.secondary,
    marginLeft: 8,
    fontWeight: '700',
    fontSize: 13,
  },

  /* FOOTER */

  footer: {
    alignItems: 'center',
    marginTop: 28,
  },

  footerText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
});