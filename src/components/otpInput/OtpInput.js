import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, Animated } from 'react-native';
import { colors } from '../../const/Colors';

const OtpInput = ({ otp, setOtp }) => {
  const otpArray = Array.isArray(otp) ? otp : Array(6).fill(''); 
  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow single digit
    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otpArray.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => (inputRefs.current[index] = ref)}
          style={[
            styles.otpInput,
            focusedIndex === index && styles.otpInputFocused,
            digit ? styles.otpInputFilled : null,
          ]}
          value={digit}
          onChangeText={value => handleOtpChange(value, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(-1)}
          returnKeyType="next"
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
    gap: 10,
  },
  otpInput: {
    width: 52,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.lightGrey,
    fontSize: 22,
    color: colors.greenCustom,
    marginHorizontal: 0,
    backgroundColor: '#f8fff6',
    textAlign: 'center',
    elevation: 3,
    shadowColor: '#11998e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    transition: 'border-color 0.2s',
    
  },
  otpInputFocused: {
    borderColor: colors.greenCustom,
    backgroundColor: '#eafff2',
    elevation: 6,
    shadowOpacity: 0.18,
  },
  otpInputFilled: {
    borderColor: colors.greenCustom,
    backgroundColor: '#eafff2',
  },
});

export default OtpInput;
