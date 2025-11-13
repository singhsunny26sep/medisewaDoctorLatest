import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../const/Colors';
import axios from 'axios';
import { apiCall } from '../const/api';

const { width, height } = Dimensions.get('window');

export default function MobileLogin({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async () => {
    if (!mobile) {
      setMobileError('Mobile number is required');
      return;
    } else if (!/^\d{10}$/.test(mobile)) {
      setMobileError('Enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiCall.mainUrl}/users/request/otp`,
        { mobile }
      );
      setLoading(false);
      if (
        response.data &&
        response.data.success &&
        response.data.result &&
        response.data.result.Details
      ) {
        const details = response.data.result.Details;
        navigation.navigate('MobileVerify', { mobile, details });
      } else {
        setMobileError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      setMobileError('Failed to send OTP. Please try again.');
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#22C645" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <LinearGradient
          colors={["#55FF25", "#27D80C", "#22C645"]}
          start={{ x: 0.1, y: 0.2 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://img.icons8.com/color/96/000000/medical-doctor.png' }}
                style={styles.logo}
              />
            </View>
            <Text style={styles.welcomeText}>Welcome Doctor!</Text>
            <Text style={styles.subtitleText}>
              Sign in to access your doctor services
            </Text>
          </View>
        </LinearGradient>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <TextInput
                style={[styles.input, mobileError ? styles.inputError : null]}
                placeholder="Enter your 10-digit mobile number"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={text => {
                  setMobile(text);
                  if (text) setMobileError('');
                }}
              />
              {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}
            </View>
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleRequestOTP}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ['#55FF25', '#27D80C'] : ['#22C645', '#43e97b']}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color={'#fff'} size={'small'} />
                ) : (
                  <Text style={styles.loginButtonText}>Continue with OTP</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => navigation && navigation.navigate ? navigation.navigate('ForgotPassword') : null}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => navigation && navigation.navigate ? navigation.navigate('Register') : null}
            >
              <Text style={styles.signupButtonText}>
                Don't have an account?{' '}
                <Text style={styles.signupLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6fff9',
  },
  headerGradient: {
    height: height * 0.32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    elevation: 10,
    shadowColor: '#11998e',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.06,
    paddingTop: 30,
  },
  logoContainer: {
    width: 84,
    height: 84,
    backgroundColor: '#fff',
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#11998e',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  logo: {
    width: 54,
    height: 54,
  },
  welcomeText: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.93)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingTop: 40,
  },
  inputWrapper: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 15,
    color: '#11998e',
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1.5,
    borderColor: '#b2f7ef',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#11998e',
    shadowColor: '#38ef7d',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  inputError: {
    borderColor: '#e53935',
  },
  errorText: {
    color: '#e53935',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
  loginButton: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#11998e',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 10,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginBottom: 15,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#11998e',
    textDecorationLine: 'underline',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  divider: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#b2f7ef',
    borderRadius: 1,
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    fontWeight: '500',
    color: '#11998e',
  },
  signupButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    fontSize: 15,
    color: '#11998e',
  },
  signupLink: {
    color: '#38ef7d',
    fontWeight: 'bold',
  },
  termsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#11998e',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#43e97b',
    fontWeight: '500',
  },
});