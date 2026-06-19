import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import {colors, WIDTH} from '../const/Colors';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Divider from '../common/Divider';
import CustomButton from '../utils/CustomButton';
import moment from 'moment';
import TimeFormate from '../utils/TimeFormate';
import useBooking from '../hook/useBooking';
import validateAppointmentDate from '../utils/validateAppointmentDate';
import CancelConfirmModal from '../popup/CancelConfirmModal';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import useCall from '../hook/useCall';

const AppointmentView = ({item, refresh, setRefresh, type}: any): React.JSX.Element => {
  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No appointment found</Text>
      </View>
    );
  }

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {cancleBooking, getLabTestsByAppointmentId} = useBooking();
  const {initiateCall} = useCall();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [callSheetVisible, setCallSheetVisible] = useState<boolean>(false);
  const [isInitiatingCall, setIsInitiatingCall] = useState<boolean>(false);
  const [labTests, setLabTests] = useState<any[]>([]);
  const [labTestsLoading, setLabTestsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchLabTests = async () => {
      if (item?._id) {
        setLabTestsLoading(true);
        try {
          const response = await getLabTestsByAppointmentId(item._id);
          if (isMounted) {
            if (response && response.result) {
              setLabTests(response.result);
            } else {
              setLabTests([]);
            }
          }
        } catch (error) {
          if (isMounted) {
            setLabTests([]);
          }
        } finally {
          if (isMounted) {
            setLabTestsLoading(false);
          }
        }
      }
    };

    fetchLabTests();
    return () => {
      isMounted = false;
    };
  }, [item?._id]);

  const handleCancelBooking = async () => {
    setIsLoading(true);
    try {
      await cancleBooking(item?._id);
      if (setRefresh && refresh !== undefined) {
        setRefresh(!refresh);
      }
      setModalVisible(false);
    } catch (error) {
      console.log('Error cancelling booking', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    const s = status || item?.bookingStatus;
    if (s === 'confirmed') return colors.greenCustom;
    if (s === 'cancelled') return colors.red;
    return colors.yellow;
  };

  const getStatusBgColor = (status?: string) => {
    const s = status || item?.bookingStatus;
    if (s === 'confirmed') return colors.greenCustom + '15';
    if (s === 'cancelled') return colors.red + '15';
    return colors.yellow + '15';
  };

  return (
    <TouchableOpacity
      style={styles.mainView}
      activeOpacity={0.8}
      onPress={() => {
        const patientId = item?.patientId?._id || item?.userId?._id;
        const doctorId = item?.doctorId?._id || item?.doctorId;
        const appointmentId = item?._id;
        navigation.navigate('UploadPrecription', {
          patientId,
          doctorId,
          appointmentId,
        });
      }}>

      {/* Status Badge - hidden for mydoctors type */}
      {type !== 'mydoctors' && (
        <View style={styles.statusBadgeWrapper}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: getStatusBgColor(),
                borderColor: getStatusColor(),
              },
            ]}>
            <View style={[styles.statusDot, {backgroundColor: getStatusColor()}]} />
            <Text
              style={[
                styles.statusText,
                {color: getStatusColor()},
              ]}>
              {(item?.bookingStatus || 'pending').charAt(0).toUpperCase() + (item?.bookingStatus || 'pending').slice(1)}
            </Text>
          </View>
          {type !== 'history' && (
            <TouchableOpacity style={styles.editBtn} activeOpacity={0.7} hitSlop={{top: 4, bottom: 4, left: 4, right: 4}}>
              <Feather name="edit-3" size={18} color={getStatusColor()} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <Divider />

      {/* Lab Tests Section */}
      {labTests.length > 0 ? (
        <View style={styles.labTestsSection}>
          <View style={styles.labTestsHeaderRow}>
            <Ionicons name="flask" size={16} color={colors.cyan} />
            <Text style={styles.labTestsTitle}>Lab Tests</Text>
            <Text style={styles.labTestCount}>{labTests.length}</Text>
          </View>
          <FlatList
            data={labTests}
            keyExtractor={(item) => item?._id || Math.random().toString()}
            scrollEnabled={false}
            renderItem={({item}) => {
              const hasResult = !!(item?.result || item?.value || item?.status === 'completed');
              return (
                <View style={styles.labTestItem}>
                  <View style={styles.labTestIconWrap}>
                    <Ionicons name="cube" size={14} color={colors.cyan} />
                  </View>
                  <Text style={styles.labTestName} numberOfLines={1}>
                    {item?.testName || item?.description || 'Lab Test'}
                  </Text>
                  <View
                    style={[
                      styles.labTestResultBadge,
                      {backgroundColor: hasResult ? colors.greenCustom + '15' : colors.yellow + '15'},
                    ]}>
                    <Text
                      style={[
                        styles.labTestValueText,
                        {color: hasResult ? colors.greenCustom : colors.orange},
                      ]}>
                      {item?.result || item?.value || 'Pending'}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </View>
      ) : labTestsLoading ? (
        <View style={styles.labTestsSection}>
          <View style={styles.labTestsHeaderRow}>
            <Ionicons name="flask" size={16} color={colors.cyan} />
            <Text style={styles.labTestsTitle}>Lab Tests</Text>
          </View>
          <View style={styles.labTestLoadingWrap}>
            <ActivityIndicator size="small" color={colors.cyan} />
            <Text style={styles.labTestLoadingText}>Loading lab tests...</Text>
          </View>
        </View>
      ) : null}

      {labTests.length > 0 && <Divider />}

      {/* Appointment Details */}
      <View style={styles.detailsMainView}>
        <View style={styles.contentView}>
          {[
            {label: 'Patient', value: item?.patientId ? item?.patientId?.name : item?.userId?.name, icon: 'person'},
            {label: 'Contact', value: item?.patientId ? item?.patientId?.contactNumber : item?.userId?.mobile, icon: 'call'},
            {label: 'Address', value: item?.patientId ? item?.patientId?.address : item?.userId?.address, icon: 'location'},
            {label: 'Date', value: moment(item?.appointmentDate).format('DD/MM/YYYY'), icon: 'calendar'},
            {label: 'Time', value: TimeFormate(item?.appointmentTime), icon: 'time'},
            {label: 'Amount', value: '₹ ' + item?.totalAmount, icon: 'cash', highlight: true},
            {label: 'Booked For', value: item?.patientId ? item?.patientId?.name : item?.userId?.name, icon: 'people'},
          ].map((row, idx) => (
            <View key={idx} style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name={row.icon as any} size={15} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text
                  style={[
                    styles.infoValue,
                    row.highlight && {color: colors.greenCustom, fontWeight: '700'},
                  ]}
                  numberOfLines={1}>
                  {row.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.avatarView}>
          <View style={styles.avatar}>
            <Image
              source={{
                uri: item?.patientId
                  ? item?.patientId?.image
                  : item?.userId?.image,
              }}
              style={{width: '100%', height: '100%', resizeMode: 'cover'}}
            />
          </View>
        </View>
      </View>

      <Divider />

      {/* Reject button - only for upcoming/confirmed */}
      {type === 'mydoctors' ? (
        <View style={styles.btnView}>
          <CustomButton
            icon={<Ionicons name="call" size={18} color={colors.white} />}
            onPress={() => setCallSheetVisible(true)}
            title="Call"
            backgroundColor={colors.greenCustom}
            textColor={colors.white}
            isLoading={isInitiatingCall}
          />
        </View>
      ) : type === 'history' ? null : (
        <View style={styles.btnView}>
          {item?.bookingStatus !== 'cancelled' && validateAppointmentDate(item?.appointmentDate) ? (
            <CustomButton
              icon={<Feather name="x-circle" size={18} color={colors.white} />}
              onPress={() => setModalVisible(true)}
              title="Reject Appointment"
              backgroundColor={colors.red}
              textColor={colors.white}
              isLoading={isLoading}
            />
          ) : (
            <View style={[styles.disabledBtn, {backgroundColor: colors.gray}]}>
              <Feather name="x-circle" size={18} color={colors.white} />
              <Text style={styles.disabledBtnText}>Reject</Text>
            </View>
          )}

          {item?.bookingStatus !== 'cancelled' && item?.bookingStatus !== 'confirmed' && (
            <CustomButton
              icon={<Feather name="check-circle" size={18} color={colors.white} />}
              onPress={() => {}}
              title="Confirm"
              backgroundColor={colors.greenCustom}
              textColor={colors.white}
              isLoading={false}
            />
          )}
        </View>
      )}

      {/* Cancel Confirm Modal */}
      <CancelConfirmModal
        title={'Cancel Booking?'}
        msg={`Are you sure you want to cancel this booking of ${item?.patientId ? item?.patientId?.name : item?.userId?.name}?`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleCancelBooking}
        isLoading={isLoading}
      />

      {/* Call Sheet Modal */}
      <Modal
        visible={callSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCallSheetVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.sheetBackdrop}
          onPress={() => setCallSheetVisible(false)}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Choose call type</Text>

            <View style={styles.sheetButtonsRow}>
              <CustomButton
                icon={<Ionicons name="call" size={18} color={colors.white} />}
                onPress={async () => {
                  try {
                    setIsInitiatingCall(true);
                    setCallSheetVisible(false);
                    const receiverId = item?.patientId?._id || item?.userId?._id;
                    if (!receiverId) {
                      setIsInitiatingCall(false);
                      return;
                    }
                    const res = await initiateCall(receiverId, 'audio');
                    const callData = res?.data || res;
                    if (callData?.callId) {
                      const doctor = item?.patientId || item?.userId;
                      navigation.navigate('VideoCallScreen', {
                        doctor,
                        callData,
                        callType: 'audio',
                      });
                    }
                  } catch (err: any) {
                    console.log('Audio call initiation failed:', err);
                  } finally {
                    setIsInitiatingCall(false);
                  }
                }}
                title="Audio Call"
                backgroundColor={colors.greenCustom}
                textColor={colors.white}
                isLoading={isInitiatingCall}
              />
              <CustomButton
                icon={<Ionicons name="videocam" size={18} color={colors.white} />}
                onPress={async () => {
                  try {
                    setCallSheetVisible(false);
                    const receiverId = item?.patientId?._id || item?.userId?._id;
                    const res = await initiateCall(receiverId, 'video');
                    const callData = res?.data || res;
                    const doctor = item?.patientId || item?.userId;
                    navigation.navigate('VideoCallScreen', {
                      doctor,
                      callData,
                    });
                  } catch (err) {
                    console.log('Video call initiation failed:', err);
                  }
                }}
                title="Video Call"
                backgroundColor={colors.cyan}
                textColor={colors.white}
                isLoading={false}
              />
            </View>

            <CustomButton
              icon={null}
              onPress={() => setCallSheetVisible(false)}
              title="Cancel"
              backgroundColor={colors.gray}
              textColor={colors.white}
              isLoading={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

export default AppointmentView;

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 3,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.subText,
    textAlign: 'center',
  },
  statusBadgeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editBtn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: colors.lightGrey + '40',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.subText,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '500',
  },
  detailsMainView: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  contentView: {
    flex: 1,
    paddingRight: 8,
  },
  avatarView: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: WIDTH / 2,
    borderWidth: 1.5,
    borderColor: colors.primary + '30',
    backgroundColor: colors.white,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
    gap: 10,
  },
  disabledBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 1,
  },
  disabledBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 6,
  },
  // Lab Tests
  labTestsSection: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  labTestsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labTestsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
    marginLeft: 6,
    flex: 1,
  },
  labTestCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.cyan,
    backgroundColor: colors.cyan + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  labTestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 8,
    marginVertical: 3,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  labTestIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.cyan + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  labTestName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.black,
  },
  labTestResultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  labTestResultText: {
    fontSize: 11,
    fontWeight: '700',
  },
  labTestLoadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  labTestLoadingText: {
    marginLeft: 8,
    fontSize: 13,
    color: colors.subText,
  },
  // Call Sheet
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.white,
    padding: 16,
    paddingBottom: 28,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.lightGrey,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 14,
    fontWeight: '600',
  },
  sheetButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
});
