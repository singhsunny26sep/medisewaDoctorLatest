import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ImageBackground,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import CustomInput from '../utils/CustomInput';
import CustomButton from '../utils/CustomButton';
import showToast from '../utils/ShowToast';
import axios from 'axios';
import {apiCall} from '../const/api';
import {NavigationString} from '../const/NavigationString';
import {getFcmToken} from '../utils/FcmTokenUtils';
import useSpecialization from '../hook/useSpecialization';
import useDepartment from '../hook/useDepartment';
import CustomSelection from '../common/CustomSelection';

const {width, height} = Dimensions.get('window');

const THEME = {
  background: '#0F172A',
  surface: '#111827',
  card: '#1E293B',
  primary: '#7C3AED',
  primaryLight: '#A855F7',
  cyan: '#06B6D4',
  white: '#FFFFFF',
  text: '#F8FAFC',
  textLight: '#94A3B8',
  border: 'rgba(255,255,255,0.08)',
  green: '#10B981',
  red: '#EF4444',
  yellow: '#F59E0B',
};

// ── dark-theme style overrides passed into shared components ──────────────
const INPUT = {
  container: {marginTop: 0, marginBottom: 4},
  label: {
    color: THEME.white,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {color: THEME.white, fontSize: 15, paddingHorizontal: 12},
  inputWrapper: {
    borderColor: THEME.border,
    backgroundColor: THEME.surface,
    borderRadius: 8,
  },
  error: {color: THEME.red, fontSize: 12, fontWeight: '500'},
  toggleIcon: {color: THEME.white},
  placeholderTextColor: THEME.textLight,
};

const DROPDOWN = {
  labelStyle: {
    color: THEME.white,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dropdownStyle: {
    borderColor: THEME.border,
    backgroundColor: THEME.surface,
    borderRadius: 8,
    height: 48,
  },
  dropDownContainerStyle: {
    borderColor: THEME.border,
    backgroundColor: THEME.surface,
    borderRadius: 8,
  },
};

let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const Register = ({navigation, route}: any): React.JSX.Element => {
  const {getAllSpecialization} = useSpecialization();
  const {getAllDepartments} = useDepartment();

  const [name, setName] = useState<string>();
  const [mobile, setMobile] = useState<number | any>();
  const [email, setEmail] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [password, setPassword] = useState<string | any>();
  const [conPass, setConPass] = useState<string>();
  const [experience, setExperience] = useState<string>();
  const [fee, setFee] = useState<string>();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);

  const [valName, setValName] = useState<string>();
  const [valMobile, setValMobile] = useState<string>();
  const [valEmail, setValEmail] = useState<string>();
  const [valAddress, setValAddress] = useState<string>();
  const [valConPass, setValConPass] = useState<string>();
  const [valSpecialization, setValSpecialization] = useState<string>();
  const [valDepartment, setValDepartment] = useState<string>();
  const [valExperience, setValExperience] = useState<string>();
  const [valFee, setValFee] = useState<string>();
  const [passwordVal, setPasswordVal] = useState<string | any>();
  const [valPassword, setValPassword] = useState<string | any>();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [specs, depts] = await Promise.all([
        getAllSpecialization(),
        getAllDepartments(),
      ]);
      setSpecializations(Array.isArray(specs) ? specs : []);
      setDepartments(Array.isArray(depts) ? depts : []);
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!name) {
      setValName('Name is required');
      return;
    }
    if (!mobile) {
      setValMobile('Mobile number is required');
      return;
    }
    if (mobile.toString().length < 10) {
      setValMobile('Enter a valid 10-digit mobile');
      return;
    }
    if (!email) {
      setValEmail('Email is required');
      return;
    }
    if (!email.match(regex)) {
      setValEmail('Enter a valid email address');
      return;
    }
    if (!address) {
      setValAddress('Address is required');
      return;
    }
    if (!selectedSpecialization) {
      setValSpecialization('Specialization is required');
      return;
    }
    if (!selectedDepartment) {
      setValDepartment('Department is required');
      return;
    }
    if (!experience) {
      setValExperience('Experience is required');
      return;
    }
    if (!fee) {
      setValFee('Fee is required');
      return;
    }
    if (!password) {
      setValPassword('Password is required');
      return;
    }
    if (!conPass) {
      setValConPass('Confirm Password is required');
      return;
    }
    if (password !== conPass) {
      setValConPass('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const fcmToken = await getFcmToken();
    try {
       const requestBody = {
         name,
         email,
         password,
         mobile,
         address,
         role: 'doctor',
         experience: parseInt(experience),
         fee: parseInt(fee),
         specialization: selectedSpecialization?._id,
         department: selectedDepartment?._id,
         symptom: symptoms,
         fcmToken,
       };
       console.log('Registration request body:', requestBody);
       await axios.post(`${apiCall.mainUrl}/users/register`, requestBody);
      showToast('Registration successful!');
      navigation.navigate("MobileLogin");
    } catch (error: any) {
      showToast(
        error?.response?.data?.msg || 'Registration failed. Try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: THEME.background}}>
      <StatusBar backgroundColor={THEME.primary} barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* ─── Hero ─────────────────────────────────────────── */}
        <ImageBackground
          source={require('../assets/img/login.png')}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}>
          <View
            style={[
              styles.overlay,
              {backgroundColor: 'rgba(124,58,237,0.85)'},
            ]}>
            <View style={styles.titleRow}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backBtn}>
                <Feather name="arrow-left" size={22} color={THEME.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Doctor Registration</Text>
              <View style={{width: styles.backBtn.width}} />
            </View>
            <Text style={styles.heroTagline}>Join Medisewa</Text>
            <Text style={styles.heroSub}>
              Create your profile to start receiving appointments
            </Text>
          </View>
        </ImageBackground>

        {/* ─── Form ─────────────────────────────────────────── */}
        <View style={styles.formSection}>
          <View style={styles.formContainer}>
            {/* ── Personal Details ── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Feather name="user" size={16} color={THEME.primaryLight} />
                <Text style={styles.sectionTitle}>Personal Details</Text>
              </View>

              <CustomInput
                label="Full Name"
                value={name}
                placeholder="Enter your full name"
                onChangeText={(e: string) => {
                  setName(e);
                  setValName('');
                }}
                error={!!valName}
                errorMessage={valName}
                autoCapitalize="words"
                customStyles={INPUT}
              />

              <CustomInput
                label="Mobile Number"
                value={mobile}
                placeholder="10-digit mobile number"
                onChangeText={(e: string) => {
                  setMobile(e);
                  setValMobile('');
                }}
                error={!!valMobile}
                errorMessage={valMobile}
                maxLength={10}
                keyboardType="phone-pad"
                customStyles={INPUT}
              />

              <CustomInput
                label="Email Address"
                value={email}
                placeholder="you@example.com"
                onChangeText={(e: string) => {
                  setEmail(e);
                  setValEmail('');
                }}
                error={!!valEmail}
                errorMessage={valEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                customStyles={INPUT}
              />

              <CustomInput
                label="Clinic / Home Address"
                value={address}
                placeholder="City, Area, Landmark"
                onChangeText={(e: string) => {
                  setAddress(e);
                  setValAddress('');
                }}
                error={!!valAddress}
                errorMessage={valAddress}
                autoCapitalize="words"
                customStyles={INPUT}
              />
            </View>

            {/* ── Professional Details ── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Feather
                  name="briefcase"
                  size={16}
                  color={THEME.primaryLight}
                />
                <Text style={styles.sectionTitle}>Professional Details</Text>
              </View>

              <CustomSelection
                title="Choose a specialization"
                data={specializations}
                defaultValue={
                  selectedSpecialization
                    ? {
                        _id: selectedSpecialization._id,
                        name: selectedSpecialization.name,
                      }
                    : undefined
                }
                setDataValue={setSelectedSpecialization}
                label="Specialization"
                labelStyle={DROPDOWN.labelStyle}
                dropdownStyle={DROPDOWN.dropdownStyle}
                dropDownContainerStyle={DROPDOWN.dropDownContainerStyle}
                searchAble={true}
                error={!!valSpecialization}
                errorMessage={valSpecialization}
                setErrorMsg={setValSpecialization}
              />

              <CustomSelection
                title="Choose a department"
                data={departments}
                defaultValue={
                  selectedDepartment
                    ? {
                        _id: selectedDepartment._id,
                        name: selectedDepartment.name,
                      }
                    : undefined
                }
                setDataValue={setSelectedDepartment}
                label="Department"
                labelStyle={DROPDOWN.labelStyle}
                dropdownStyle={DROPDOWN.dropdownStyle}
                dropDownContainerStyle={DROPDOWN.dropDownContainerStyle}
                searchAble={true}
                error={!!valDepartment}
                errorMessage={valDepartment}
                setErrorMsg={setValDepartment}
              />

              <CustomInput
                label="Years of Experience"
                value={experience}
                placeholder="e.g. 5"
                onChangeText={(e: string) => {
                  setExperience(e);
                  setValExperience('');
                }}
                error={!!valExperience}
                errorMessage={valExperience}
                keyboardType="number-pad"
                customStyles={INPUT}
              />

              <CustomInput
                label="Consultation Fee (₹)"
                value={fee}
                placeholder="e.g. 500"
                onChangeText={(e: string) => {
                  setFee(e);
                  setValFee('');
                }}
                error={!!valFee}
                errorMessage={valFee}
                keyboardType="number-pad"
                customStyles={INPUT}
              />

              <CustomInput
                label="Common Symptoms Treated"
                value={symptoms.join(', ')}
                placeholder="e.g. fever, joint pain, cough"
                onChangeText={(e: string) => {
                  const arr = e
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
                  setSymptoms(arr);
                }}
                autoCapitalize="words"
                customStyles={{
                  ...INPUT,
                  container: {...INPUT.container, marginBottom: 0},
                }}
              />
              <Text style={styles.hintText}>
                Comma-separated · helps patients find you
              </Text>
            </View>

            {/* ── Account Security ── */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Feather name="lock" size={16} color={THEME.primaryLight} />
                <Text style={styles.sectionTitle}>Account Security</Text>
              </View>

              <CustomInput
                label="Password"
                value={password}
                placeholder="Min. 6 characters"
                onChangeText={(e: string) => {
                  setPassword(e);
                  setPasswordVal('');
                }}
                isPassword={true}
                error={!!passwordVal}
                errorMessage={passwordVal}
                customStyles={INPUT}
              />

              <CustomInput
                label="Confirm Password"
                value={conPass}
                placeholder="Re-enter password"
                onChangeText={(e: string) => {
                  setConPass(e);
                  setValConPass('');
                }}
                isPassword={true}
                error={!!valConPass}
                errorMessage={valConPass}
                customStyles={INPUT}
              />
            </View>
          </View>
        </View>

        {/* ─── Submit ───────────────────────────────────────── */}
        <View style={styles.buttonSection}>
          <CustomButton
            icon={null}
            title="Register"
            onPress={handleSubmit}
            isLoading={isLoading}
            backgroundColor={THEME.primary}
            textColor={THEME.white}
            style={styles.registerBtn}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate(NavigationString.Login)}>
            <Text style={styles.loginLink}>
              Already have an account?{' '}
              <Text style={styles.loginLinkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  /* ── Hero ─── */
  heroImage: {
    width: '100%',
    height: height * 0.38,
  },
  heroImageStyle: {
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    paddingHorizontal: 28,
  },
  titleRow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 36,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: THEME.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  heroTagline: {
    color: THEME.white,
    fontSize: 32,
    fontWeight: '800',
    marginTop: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  /* ── Form ─── */
  formSection: {
    flex: 1,
    marginTop: -28,
    backgroundColor: THEME.background,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 8,
    gap: 14,
  },
  sectionCard: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  hintText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 4,
    marginLeft: 4,
  },
  /* ── Buttons ─── */
  buttonSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 12,
    marginTop: 4,
  },
  registerBtn: {
    width: '100%',
  },
  loginLink: {
    color: THEME.white,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  loginLinkBold: {
    color: THEME.primaryLight,
    fontWeight: '700',
  },
});
