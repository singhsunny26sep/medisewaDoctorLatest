import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import React, { useState } from 'react'
import { colors, WIDTH } from '../const/Colors'
import Feather from 'react-native-vector-icons/Feather';
import Divider from '../common/Divider';
import CustomButton from '../utils/CustomButton';
import { Image } from 'react-native';
import moment from 'moment';
import TimeFormate from '../utils/TimeFormate';
import useBooking from '../hook/useBooking';
import validateAppointmentDate from '../utils/validateAppointmentDate';
import CancelConfirmModal from '../popup/CancelConfirmModal';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { NavigationString } from '../const/NavigationString';
import useCall from '../hook/useCall';

const AppointmentView = ({ item, refresh, setRefresh, type }: any): React.JSX.Element => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const { cancleBooking } = useBooking()
    const { initiateCall } = useCall()
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [callSheetVisible, setCallSheetVisible] = useState<boolean>(false);
    const [isInitiatingCall, setIsInitiatingCall] = useState<boolean>(false);

    const handleCancelBooking = async () => {
        setIsLoading(true)
        cancleBooking(item?._id).then((response) => {
            setRefresh(!refresh)
            setModalVisible(false)
            setIsLoading(false)
        }).catch((error) => {
            console.log('Error cancelling booking', error)
            setIsLoading(false)
        })
    }

    return (
        <TouchableOpacity style={styles.mainView} onPress={() => {
            const patientId = item?.patientId?._id || item?.userId?._id;
            const doctorId = item?.doctorId?._id || item?.doctorId;
            const appointmentId = item?._id;
            console.log('Navigating to UploadPrecription with:', { patientId, doctorId, appointmentId });
            navigation.navigate('UploadPrecription', {
                patientId,
                doctorId,
                appointmentId
            });
        }}>
            {/* booking status - hide for mydoctors */}
            {type === 'mydoctors' ? <View /> : (
                <View style={[styles.bookingStatus, { borderColor: item?.bookingStatus == 'confirmed' ? colors.greenCustom : item?.bookingStatus == 'cancelled' ? colors.red : colors.yellow }]}>
                    <Text style={[styles.bookingText, { color: item?.bookingStatus == 'confirmed' ? colors.greenCustom : item?.bookingStatus == 'cancelled' ? colors.red : colors.yellow }]}>{item?.bookingStatus}</Text>
                    {type == "history" ? <View /> : <TouchableOpacity style={styles.btnTouch} >
                        <Feather name='edit' size={20} color={item?.bookingStatus == 'confirmed' ? colors.greenCustom : item?.bookingStatus == 'cancelled' ? colors.red : colors.yellow} />
                    </TouchableOpacity>
                    }
                </View>
            )}
            <Divider />
            <View style={styles.detailsMainView}>
                <View style={styles.contentView}>
                    <Text style={styles.title}>{item?.patientId ? item?.patientId?.name : item?.userId?.name}</Text>
                    <Text style={styles.title}>{item?.patientId ? item?.patientId?.contactNumber : item?.userId?.mobile}</Text>
                    <Text style={styles.title}>{item?.patientId ? item?.patientId?.address : item?.userId?.address}</Text>
                    <Text style={styles.title}>{moment(item?.appointmentDate).format("DD/MM/YYYY")}</Text>
                    <Text style={styles.title}>{TimeFormate(item?.appointmentTime)}</Text>
                    <Text style={styles.title}>₹ {item?.totalAmount}</Text>
                    <Text style={styles.title}>Book For: {item?.patientId ? item?.patientId?.name : item?.userId?.name}</Text>
                </View>
                <View style={styles.avatarView}>
                    <View style={styles.avatar} >
                        {/* Avatar */}
                        <Image source={{ uri: item?.patientId ? item?.patientId?.image : item?.userId?.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                    </View>
                </View>
            </View>
            <Divider />

            {type === 'mydoctors' ? (
                <View style={styles.btnView}>
                    <CustomButton
                        icon={null}
                        onPress={() => setCallSheetVisible(true)}
                        title='Call'
                        backgroundColor={colors.greenCustom}
                        textColor={colors.white}
                        isLoading={false}
                    />
                </View>
            ) : (
                type == "history" ? <View /> : <View style={styles.btnView}>
                    {item?.bookingStatus != 'cancelled' && validateAppointmentDate(item?.appointmentDate) ? <CustomButton icon={null} onPress={() => setModalVisible(true)} title='Reject' backgroundColor={colors.red} textColor={colors.white} isLoading={false} /> : <CustomButton onPress={() => console.log("clicked")} title='Reject' backgroundColor={colors.gray} textColor={colors.white} icon={null} isLoading={false} />}
                </View>
            )}


            <CancelConfirmModal title={"Cancel Booking?"} msg={`Are you sure you want to cancel this booking of ${item?.patientId ? item?.patientId?.name : item?.userId?.name}? This action cannot be undone.`} visible={modalVisible} onCancel={() => setModalVisible(false)} onConfirm={handleCancelBooking} isLoading={isLoading} />

            <Modal
                visible={callSheetVisible}
                transparent
                animationType='slide'
                onRequestClose={() => setCallSheetVisible(false)}
            >
                <TouchableOpacity activeOpacity={1} style={styles.sheetBackdrop} onPress={() => setCallSheetVisible(false)}>
                    <View style={styles.sheetContainer}>
                        <View style={styles.sheetHandle} />
                        <Text style={styles.sheetTitle}>Choose call type</Text>
                        <View style={styles.sheetButtonsRow}>
                            <CustomButton
                                icon={null}
                                onPress={async () => {
                                    try {
                                        setIsInitiatingCall(true)
                                        setCallSheetVisible(false)

                                        const receiverId = item?.patientId?._id || item?.userId?._id
                                        if (!receiverId) {
                                            console.log('❌ No receiverId found on appointment item')
                                            setIsInitiatingCall(false)
                                            return
                                        }

                                        console.log('📞 Starting audio call to:', receiverId)
                                        console.log('👤 Patient/Doctor name:', item?.patientId?.name || item?.userId?.name)

                                        // Initiate the call
                                        const res = await initiateCall(receiverId, 'audio')
                                        console.log('✅ Audio call API response:', res)

                                        const callData = res?.data || res
                                        console.log('📦 Call data received:', JSON.stringify(callData, null, 2))

                                        if (callData?.callId) {
                                            console.log('🚀 Audio call initiated with callId:', callData.callId)
                                            console.log('📱 Navigating to audio call interface...')

                                            const doctor = item?.patientId || item?.userId
                                            navigation.navigate(NavigationString.VideoCallScreen, {
                                                doctor,
                                                callData,
                                                callType: 'audio'
                                            })
                                        } else {
                                            console.log('⚠️ No callId received from API')
                                            console.log('🔍 API Response structure:', Object.keys(res || {}))
                                        }
                                    } catch (err: any) {
                                        console.log('❌ Audio call initiation failed:', err)
                                        console.log('🔍 Error details:', err?.response?.data || err?.message)
                                    } finally {
                                        setIsInitiatingCall(false)
                                    }
                                }}
                                title={isInitiatingCall ? 'Connecting...' : 'Audio Call'}
                                backgroundColor={colors.greenCustom}
                                textColor={colors.white}
                                isLoading={isInitiatingCall}
                            />
                            <CustomButton
                                icon={null}
                                onPress={async () => {
                                    try {
                                        setCallSheetVisible(false)
                                        const receiverId = item?.patientId?._id || item?.userId?._id
                                        if (!receiverId) {
                                            console.log('No receiverId found on appointment item')
                                            return
                                        }
                                        const res = await initiateCall(receiverId, 'video')
                                        console.log('Initiate video call API success →', res)
                                        const callData = res?.data || res
                                        const doctor = item?.patientId || item?.userId
                                        navigation.navigate(NavigationString.VideoCallScreen, { doctor, callData })
                                    } catch (err) {
                                        console.log('Failed to initiate video call')
                                    }
                                }}
                                title='Video Call'
                                backgroundColor={colors.greenCustom}
                                textColor={colors.white}
                                isLoading={false}
                            />
                        </View>
                        <CustomButton
                            icon={null}
                            onPress={() => setCallSheetVisible(false)}
                            title='Cancel'
                            backgroundColor={colors.gray}
                            textColor={colors.white}
                            isLoading={false}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </TouchableOpacity>
    )
}

export default AppointmentView

const styles = StyleSheet.create({
    mainView: {
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: 8,
        elevation: 3,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        marginVertical: 3
    },
    bookingStatus: {
        width: '100%',
        borderRadius: 5,
        marginBottom: 10,
        padding: 5,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bookingText: {
        color: colors.greenCustom,
        fontSize: 15,
        textTransform: 'capitalize'
    },
    title: {
        fontSize: 16,
        color: colors.black,
    },
    detailsMainView: {
        width: '100%',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
    },
    contentView: {
        width: '70%',
        padding: 10,
        borderRadius: 5,
    },
    avatarView: {
        width: '30%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: WIDTH / 2,
        borderWidth: 1,
        borderColor: colors.greenCustom,
        backgroundColor: colors.white,
        overflow: 'hidden',
        marginBottom: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnView: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    btnTouch: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sheetBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end'
    },
    sheetContainer: {
        backgroundColor: colors.white,
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 10
    },
    sheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.lightGrey,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 12
    },
    sheetTitle: {
        fontSize: 16,
        color: colors.black,
        textAlign: 'center',
        marginBottom: 12
    },
    sheetButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    }
})