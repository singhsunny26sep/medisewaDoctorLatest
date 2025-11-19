import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../const/Colors';
import OtpInput from '../components/otpInput/OtpInput';
import {apiCall} from '../const/api';
import showToast from '../utils/ShowToast';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLogin} from '../context/LoginProvider';
import {getFcmToken} from '../utils/FcmTokenUtils';

export default function MobileVerify({route, navigation}) {
  const mobile = route?.params?.mobile || '';
  const details = route?.params?.details || '';
  console.log('MobileVerify params:', {mobile, details});
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {setIsLoggedIn} = useLogin();

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const fcmToken = await getFcmToken();
      console.log('📱 FCM Token for MobileVerify:', fcmToken);
      
      const response = await axios.post(`${apiCall.mainUrl}/users/verify/otp`, {
        sessionId: details,
        otp: otpString,
        mobile: mobile,
        fcmToken: fcmToken,
      });
      setLoading(false);

      if (response.data.success && response.data.token) {
        console.log('✅ Received token:', response.data.token);
        console.log('📱 FCM Token sent in verify OTP request:', fcmToken);
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
      console.log('❌ Error verifying OTP:', err);
      setError('Failed to verify OTP. Please try again.');
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={colors.greenCustom}
        barStyle="light-content"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <LinearGradient
          colors={['#55FF25', '#27D80C', '#22C645']}
          start={{x: 0.1, y: 0.2}}
          end={{x: 1, y: 1}}
          style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>🔒</Text>
            </View>
            <Text style={styles.welcomeText}>OTP Verification</Text>
            <Text style={styles.subtitleText}>
              Enter the 6-digit code sent to
            </Text>
            <Text style={styles.mobileText}>{mobile}</Text>
          </View>
        </LinearGradient>
        <View style={styles.formContainer}>
          <OtpInput otp={otp} setOtp={setOtp} />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              loading && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerifyOTP}
            disabled={loading}>
            <LinearGradient
              colors={loading ? ['#55FF25', '#27D80C'] : ['#22C645', '#43e97b']}
              style={styles.buttonGradient}>
              {loading ? (
                <ActivityIndicator color={'#fff'} size={'small'} />
              ) : (
                <Text style={styles.verifyButtonText}>Verify OTP</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => {
              showToast('OTP resent! (Demo)');
            }}
            disabled={loading}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
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
    height: 220,
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
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  logoContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    elevation: 6,
    shadowColor: '#11998e',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  logoText: {
    fontSize: 36,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  subtitleText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.93)',
    textAlign: 'center',
  },
  mobileText: {
    fontSize: 16,
    color: colors.yellow,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 8,
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: 'center',
  },
  errorText: {
    color: '#e53935',
    fontSize: 13,
    marginTop: -18,
    marginBottom: 10,
    textAlign: 'center',
  },
  verifyButton: {
    marginBottom: 18,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#11998e',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    width: '100%',
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 2,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.greenCustom,
    textDecorationLine: 'underline',
  },
});
