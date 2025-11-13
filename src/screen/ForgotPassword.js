import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { colors } from '../const/Colors';
import {Fonts} from '../../../Constants/Fonts';
import OtpInput from '../components/otpInput/OtpInput';
import { apiCall } from '../const/api';
import showToast from '../utils/ShowToast';

export default function ForgotPassword({navigation}) {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const requestOTP = async () => {
    try {
      const requestData = {
        mobile: mobile,
      };
      
      console.log('Request OTP Data:', requestData);
      
      const response = await axios.post(`${apiCall.mainUrl}/users/request/otp`, requestData);

      const data = response.data;
      console.log('Request OTP Response:', data);
      
      if (data.success) {
        setSessionId(data.result.Details);
        console.log('Session ID stored:', data.result.Details);
        setStep(2);
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 500) {
        Alert.alert('Server Error', 'There was a server error. Please try again later or contact support.');
      } else if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Network error. Please check your connection.');
      }
    }
  };

  const resetPassword = async () => {
    try {
      const otpString = Array.isArray(otp) ? otp.join('') : otp;
      
      const requestData = {
        sessionId: sessionId,
        otp: otpString,
        mobile: mobile,
        fcmToken: "",
        password: newPassword,
      };
      
      console.log('Reset Password Request Data:', requestData);
      
      const response = await axios.post(`${apiCall.mainUrl}/users/forgot/password`, requestData);

      const data = response.data;
      console.log('Reset Password Response:', data);
      
      if (data.success) {
        showToast('Password updated successfully!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message || 'Failed to update password. Please check your OTP and try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 500) {
        Alert.alert('Server Error', 'There was a server error. Please try again later or contact support.');
      } else if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Network error. Please check your connection.');
      }
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (mobile && mobile.length >= 10) {
        setLoading(true);
        await requestOTP();
        setLoading(false);
      } else {
        Alert.alert('Error', 'Please enter a valid mobile number.');
      }
    } else if (step === 2) {
      if (otp && otp.length === 6) {
        setLoading(true);
        setStep(3);
        setLoading(false);
      } else {
        Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      }
    } else if (step === 3) {
      if (newPassword && newPassword.length >= 6) {
        setLoading(true);
        await resetPassword();
        setLoading(false);
      } else {
        Alert.alert('Error', 'Password must be at least 6 characters long.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://static.vecteezy.com/system/resources/previews/004/112/232/non_2x/forgot-password-and-account-login-for-web-page-protection-security-key-access-system-in-smartphone-or-computer-flat-illustration-vector.jpg',
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>
          {step === 1
            ? 'Forgot Password'
            : step === 2
            ? 'Enter OTP'
            : 'Update Password'}
        </Text>
      </View>

      {step === 1 && (
        <>
          <Text style={styles.infoText}>
            Please enter your mobile number. We'll send you an OTP to verify.
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile No</Text>
            <TextInput
              placeholder="Enter your mobile no"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="number-pad"
              style={styles.textInput}
            />
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.infoText}>
            Enter the OTP sent to your mobile number. Please check your Whatsapp
          </Text>
          <View style={{marginTop: 15, marginBottom: 35}}>
            <OtpInput otp={otp} setOtp={setOtp} />
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.infoText}>Please enter your new password.</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
              style={styles.textInput}
            />
          </View>
        </>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>
            {step === 1 ? 'Next' : step === 2 ? 'Submit' : 'Update Password'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 30,
    backgroundColor: colors.drawerLineColor,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  logo: {
    width: 135,
    height: 135,
    marginBottom: 15,
    marginTop: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    color: colors.black,
  },
  inputContainer: {
    flexDirection: 'column',
    marginBottom: 15,
    marginHorizontal: 15,
    marginTop: 10,
  },
  textInput: {
    height: 50,
    borderColor: colors.greenCustom,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    paddingLeft: 15,
  },
  button: {
    backgroundColor: colors.greenCustom,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    marginHorizontal: 15,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
  },
  infoText: {
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
  },
});

