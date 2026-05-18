import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';

import useUser from '../hook/useUser';
import showToast from '../utils/ShowToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../context/LoginProvider';
import ProfileImage from '../common/ProfileImage';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import EditProfileModel from '../utils/EditProfileModel';
import TimeFormate from '../utils/TimeFormate';
import { useNavigation } from '@react-navigation/native';
import { NavigationString } from '../const/NavigationString';

const { width } = Dimensions.get('window');

const theme = {
  primary: '#0F172A',
  secondary: '#1E293B',
  accent: '#3B82F6',
  background: '#F8FAFC',
  white: '#FFFFFF',
  text: '#111827',
  subText: '#64748B',
  border: '#E2E8F0',
  danger: '#EF4444',
  card: '#FFFFFF',
  softBlue: '#EFF6FF',
};

const Profile = () => {
  const { setIsLoggedIn, setUser } = useLogin();

  const navigation = useNavigation<any>();

  const actionSheetRef = useRef<ActionSheetRef>(null);

  const { getUserProfile, profileImageUpdate } = useUser();

  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>();
  const [visible, setVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getUserDetails = async () => {
    try {
      const user = await getUserProfile();
      setUserDetails(user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [refresh]);

  const logout = async () => {
    try {
      setLogoutLoading(true);

      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('studentId');
      await AsyncStorage.removeItem('centerId');
      await AsyncStorage.removeItem('role');

      setUser('');
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const showActionSheet = () => {
    actionSheetRef.current?.show();
  };

  const hideActionSheet = () => {
    actionSheetRef.current?.hide();
  };

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.7,
        width: 1000,
        height: 1000,
      });

      setImgLoading(true);

      await profileImageUpdate(image);

      showToast('Profile updated successfully');

      setRefresh(!refresh);
    } catch (error: any) {
      showToast(error?.message || 'Something went wrong');
    } finally {
      setImgLoading(false);
      hideActionSheet();
    }
  };

  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.7,
        width: 1000,
        height: 1000,
      });

      setImgLoading(true);

      await profileImageUpdate(image);

      showToast('Profile updated successfully');

      setRefresh(!refresh);
    } catch (error: any) {
      showToast(error?.message || 'Something went wrong');
    } finally {
      setImgLoading(false);
      hideActionSheet();
    }
  };

  const navigateToTimingSlotUpdate = () => {
    navigation.navigate(NavigationString.TimingSlot, {
      doctorId: userDetails?.doctorId?._id,
      currentTiming: {
        startTime: userDetails?.doctorId?.startTime,
        endTime: userDetails?.doctorId?.endTime,
        bookingBeforeTime:
          userDetails?.doctorId?.bookingBeforeTime,
      },
    });
  };

  const SectionTitle = ({ title, onPress }: any) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {onPress && (
        <TouchableOpacity
          style={styles.editSectionBtn}
          onPress={onPress}>
          <Feather
            name="edit-2"
            size={15}
            color={theme.accent}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  const InfoCard = ({ icon, label, value }: any) => (
    <View style={styles.infoCard}>
      <View style={styles.iconContainer}>
        <FontAwesome5
          name={icon}
          size={16}
          color={theme.accent}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue}>
          {value || 'Not Available'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color={theme.accent}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.primary}
        barStyle="light-content"
      />

      <EditProfileModel
        visible={visible}
        setVisible={setVisible}
        title="Update Profile"
        setLoading={setRefresh}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              alignItems: 'center',
            }}>

            <View style={styles.profileWrapper}>
              <ProfileImage
                url={userDetails?.image}
                onPress={showActionSheet}
                isLoading={imgLoading}
              />

              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={showActionSheet}>
                <Feather
                  name="camera"
                  size={15}
                  color={theme.white}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.name}>
              {userDetails?.name || 'Doctor'}
            </Text>

            <Text style={styles.speciality}>
              {userDetails?.doctorId?.specialization?.name ||
                'Specialization'}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>120+</Text>
                <Text style={styles.statLabel}>
                  Patients
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statBox}>
                <Text style={styles.statNumber}>5★</Text>
                <Text style={styles.statLabel}>
                  Rating
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {userDetails?.doctorId?.experience || 0}+
                </Text>

                <Text style={styles.statLabel}>
                  Experience
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => setVisible(true)}>
              <Feather
                name="edit"
                size={15}
                color={theme.primary}
              />

              <Text style={styles.editProfileText}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* BODY */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            paddingHorizontal: 16,
          }}>

          {/* PERSONAL */}
          <SectionTitle
            title="Personal Information"
            onPress={() =>
              navigation.navigate(
                NavigationString.ProfileUpdate,
              )
            }
          />

          <InfoCard
            icon="user"
            label="Full Name"
            value={userDetails?.name}
          />

          <InfoCard
            icon="phone"
            label="Mobile"
            value={userDetails?.mobile}
          />

          <InfoCard
            icon="envelope"
            label="Email"
            value={userDetails?.email}
          />

          <InfoCard
            icon="map-marker-alt"
            label="Address"
            value={userDetails?.address}
          />

          {/* PROFESSIONAL */}
          <SectionTitle title="Professional Details" />

          <InfoCard
            icon="stethoscope"
            label="Department"
            value={userDetails?.doctorId?.department?.name}
          />

          <InfoCard
            icon="user-md"
            label="Specialization"
            value={
              userDetails?.doctorId?.specialization?.name
            }
          />

          <InfoCard
            icon="briefcase"
            label="Experience"
            value={`${userDetails?.doctorId?.experience || 0} Years`}
          />

          {/* TIMING */}
          <SectionTitle
            title="Timing & Availability"
            onPress={navigateToTimingSlotUpdate}
          />

          <InfoCard
            icon="clock"
            label="Start Time"
            value={TimeFormate(
              userDetails?.doctorId?.startTime,
            )}
          />

          <InfoCard
            icon="clock"
            label="End Time"
            value={TimeFormate(
              userDetails?.doctorId?.endTime,
            )}
          />

          <InfoCard
            icon="bell"
            label="Booking Before"
            value={`${userDetails?.doctorId?.bookingBeforeTime || 0} Hour`}
          />

          {/* FEES */}
          <SectionTitle title="Fees & Charges" />

          <InfoCard
            icon="rupee-sign"
            label="Consultation Fee"
            value={`₹ ${userDetails?.doctorId?.fee || 0}`}
          />

          <InfoCard
            icon="users"
            label="Old Patient Fee"
            value={`₹ ${userDetails?.doctorId?.oldFee || 0}`}
          />

          {/* LOGOUT */}
          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.8}
            onPress={logout}>

            {logoutLoading ? (
              <ActivityIndicator
                color={theme.white}
                size="small"
              />
            ) : (
              <>
                <Feather
                  name="log-out"
                  size={18}
                  color={theme.white}
                />

                <Text style={styles.logoutText}>
                  Logout
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.version}>
            MediCare App Version 1.0.0
          </Text>
        </Animated.View>
      </ScrollView>

      {/* ACTION SHEET */}
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.sheetContainer}>

        <Text style={styles.sheetTitle}>
          Update Profile Picture
        </Text>

        <View style={styles.sheetRow}>
          <TouchableOpacity
            style={styles.sheetOption}
            onPress={openCamera}>
            <View style={styles.sheetIcon}>
              <Feather
                name="camera"
                size={24}
                color={theme.accent}
              />
            </View>

            <Text style={styles.sheetText}>
              Camera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sheetOption}
            onPress={openGallery}>
            <View style={styles.sheetIcon}>
              <Feather
                name="image"
                size={24}
                color={theme.accent}
              />
            </View>

            <Text style={styles.sheetText}>
              Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },

  header: {
    backgroundColor: theme.primary,
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingBottom: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginBottom: 18,
  },

  profileWrapper: {
    position: 'relative',
    marginBottom: 16,
  },

  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: theme.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.white,
  },

  name: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.white,
  },

  speciality: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    marginBottom: 18,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: width * 0.88,
    marginBottom: 18,
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    color: theme.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },

  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },

  statDivider: {
    width: 1,
    height: 35,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  editProfileBtn: {
    backgroundColor: theme.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 30,
  },

  editProfileText: {
    color: theme.primary,
    fontWeight: '600',
    fontSize: 14,
  },

  sectionHeader: {
    marginTop: 22,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
  },

  editSectionBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: theme.softBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoCard: {
    backgroundColor: theme.card,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    elevation: 2,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: theme.softBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  infoLabel: {
    fontSize: 12,
    color: theme.subText,
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.text,
  },

  logoutBtn: {
    backgroundColor: theme.danger,
    height: 58,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 34,
  },

  logoutText: {
    color: theme.white,
    fontWeight: '700',
    fontSize: 15,
  },

  version: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: theme.subText,
  },

  sheetContainer: {
    padding: 22,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: theme.white,
  },

  sheetTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 25,
  },

  sheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  sheetOption: {
    alignItems: 'center',
  },

  sheetIcon: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: theme.softBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
});