import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { colors } from '../const/Colors';
import useUser from '../hook/useUser';
import showToast from '../utils/ShowToast';
import Loader from '../common/Loader';
import CustomButton from '../utils/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../context/LoginProvider';
import ProfileImage from '../common/ProfileImage';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import Feather from 'react-native-vector-icons/Feather';
import EditProfileModel from '../utils/EditProfileModel';
import TimeFormate from '../utils/TimeFormate';
import { useNavigation } from '@react-navigation/native';
import { NavigationString } from '../const/NavigationString';

const Profile = () => {
  const { setIsLoggedIn, setUser, user, role } = useLogin();
  const navigation = useNavigation<any>();
  const actionSheetRef: any = useRef<ActionSheetRef>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const { getUserProfile, profileImageUpdate } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [logOutLoading, setLogOutLoading] = useState<boolean>(false);
  const [imgLoading, setImgLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>();
  const [visible, setVisible] = useState<boolean>(false);

  const getUserDetails = async () => {
    const user = await getUserProfile();
    setUserDetails(user);
  };

  const logOut = async () => {
    setLogOutLoading(true);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('studentId');
    await AsyncStorage.removeItem('centerId');
    await AsyncStorage.removeItem('role');
    setUser('');
    setLogOutLoading(false);
    setIsLoggedIn(false);
  };

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.5,
        width: 1000,
        height: 1000,
      });

      setImgLoading(true);
      await profileImageUpdate(image);
      setImgLoading(false);
      hideActionSheet();
      setRefresh(!refresh);
    } catch (error: any) {
      showToast(`Error on image picking: ${error.message}`);
      hideActionSheet();
      setImgLoading(false);
    }
  };

  const openGallory = async () => {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.5,
        width: 1000,
        height: 1000,
      });

      setImgLoading(true);
      await profileImageUpdate(image);
      setImgLoading(false);
      hideActionSheet();
      setRefresh(!refresh);
    } catch (error: any) {
      showToast(`Error on image picking: ${error.message}`);
      hideActionSheet();
      setImgLoading(false);
    }
  };

  const showActionSheet = () => {
    actionSheetRef.current?.show();
  };

  const hideActionSheet = () => {
    actionSheetRef.current?.hide();
  };

  // Navigate to timing slot update screen
  const navigateToTimingSlotUpdate = () => {
    navigation.navigate(NavigationString.TimingSlot, {
      doctorId: userDetails?.doctorId?._id,
      currentTiming: {
        startTime: userDetails?.doctorId?.startTime,
        endTime: userDetails?.doctorId?.endTime,
        bookingBeforeTime: userDetails?.doctorId?.bookingBeforeTime
      }
    });
  };

  useEffect(() => {
    getUserDetails();
  }, [loading, imgLoading]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />
      <EditProfileModel visible={visible} setVisible={setVisible} title="Update Profile" setLoading={setLoading} />
      <View style={styles.profileView}>
        <View style={styles.topView}>
          <View style={styles.imgView}>
            <ProfileImage url={userDetails?.image} onPress={showActionSheet} isLoading={imgLoading} />
          </View>
          <View style={styles.contentView}>
            <TouchableOpacity onPress={() => setVisible(true)} style={styles.editIcon}>
              <Feather name="edit" size={25} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.textView}>
              <Text style={styles.title}>Name</Text>
              <Text style={styles.contentHeader}>{userDetails?.name}</Text>
            </View>
            <View style={styles.textView}>
              <Text style={styles.title}>Email</Text>
              <Text style={styles.contentHeader}>{userDetails?.email}</Text>
            </View>
            <View style={styles.textView}>
              <Text style={styles.title}></Text>
              <Text style={styles.contentHeader}></Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomView}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.detailsHeaderView}>
              <Text style={styles.detailsHeader}>Details</Text>
              <TouchableOpacity onPress={() => navigation.navigate(NavigationString.ProfileUpdate)} style={styles.editIcon}>
                <Feather name="edit" size={25} color={colors.greenCustom} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>Phone</Text>
                <Text style={styles.detailsValue}>{userDetails?.mobile}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>Address</Text>
                <Text style={styles.detailsValue}>{userDetails?.address}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>Clinic Phone Number</Text>
                <Text style={styles.detailsValue}>{userDetails?.doctorId?.clinicContactNumber}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>DOB</Text>
                <Text style={styles.detailsValue}>{userDetails?.doctorId?.dob}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>Gender</Text>
                <Text style={styles.detailsValue}>{userDetails?.doctorId?.gender}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>Clinic Address</Text>
                <Text style={styles.detailsValue}>{userDetails?.doctorId?.clinicAddress}</Text>
              </View>
              
              {/* Timing Section with Update Button */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Timing & Availability</Text>
                <TouchableOpacity onPress={navigateToTimingSlotUpdate} style={styles.updateButton}>
                  <Feather name="edit-2" size={18} color={colors.white} />
                  <Text style={styles.updateButtonText}>Update Timing</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>Sitting Time</Text>
                <Text style={styles.detailsValue}>{TimeFormate(userDetails?.doctorId?.startTime)}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>Leaving Time</Text>
                <Text style={styles.detailsValue}>{TimeFormate(userDetails?.doctorId?.endTime)}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>Take Appointment Before</Text>
                <Text style={styles.detailsValue}>{userDetails?.doctorId?.bookingBeforeTime || 0} Hour</Text>
              </View>

              {/* Fees Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Fees & Experience</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>Patient Fee</Text>
                <Text style={styles.detailsValue}>₹ {userDetails?.doctorId?.fee}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>Regular Patient Fee</Text>
                <Text style={styles.detailsValue}>₹ {userDetails?.doctorId?.oldFee || 0}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>Experience</Text>
                <Text style={styles.detailsValue}>{userDetails?.doctorId?.experience || 0} Years</Text>
              </View>

              {/* Professional Details */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Professional Details</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>Department</Text>
                <Text style={styles.detailsValue}>{userDetails?.doctorId?.department?.name}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>Specialization</Text>
                <Text style={styles.detailsValue}>{userDetails?.doctorId?.specialization?.name}</Text>
              </View>
            </View>

            <View style={{marginTop: 50}}>             
              <CustomButton 
                title="Log Out" 
                onPress={logOut} 
                isLoading={logOutLoading} 
                backgroundColor={colors.greenCustom} 
                textColor={colors.white} 
              />
            </View>
          </ScrollView>
        </View>
      </View>

      <ActionSheet ref={actionSheetRef} gestureEnabled={true} containerStyle={styles.actionSheetContainer}>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity onPress={hideActionSheet}>
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.cameratOptions}>
          <TouchableOpacity style={styles.optionButton} onPress={openCamera}>
            <Feather name="camera" size={40} color={colors.black} />
            <Text style={styles.optionText}>Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={openGallory}>
            <Feather name="image" size={40} color={colors.black} />
            <Text style={styles.optionText}>Open Gallery</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileView: {
    flex: 1,
    backgroundColor: colors.greenCustom,
  },
  topView: {
    flexDirection: 'row',
    padding: 10,
  },
  imgView: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentView: {
    flex: 1,
    paddingLeft: 15,
    top: 25
  },
  textView: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: colors.lightGreen1,
    fontWeight: "500"
  },
  contentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    right: 10,
    zIndex: 5,
    bottom: 0,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomView: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  detailsHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.greenCustom,
    textDecorationLine: 'underline',
  },
  detailsContainer: {
    marginVertical: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    flex: 1,
  },
  detailsValue: {
    fontSize: 16,
    color: colors.black,
    flex: 1,
    textAlign: 'right',
  },
  actionSheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
  },
  cameratOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  optionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    color: 'grey',
    marginVertical: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.greenCustom,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.greenCustom,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  updateButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});