import React, { useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { colors, WIDTH } from '../const/Colors'
import Divider from '../common/Divider'
import CustomButton from '../utils/CustomButton'
import moment from 'moment'
import TimeFormate from '../utils/TimeFormate'
import useCall from '../hook/useCall'
import { NavigationString } from '../const/NavigationString'

type PatientAppointmentViewProps = {
    item: any
}

const PatientAppointmentView = ({ item }: PatientAppointmentViewProps): React.JSX.Element => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const { initiateCall } = useCall()
    const [callSheetVisible, setCallSheetVisible] = useState<boolean>(false)

    const patientArray = Array.isArray(item?.patientId) ? item?.patientId : null
    const patient = patientArray?.[0] || item?.patientId || item?.userId || item

    return (
        <TouchableOpacity
            style={styles.mainView}
            activeOpacity={0.9}
        >
            <View style={styles.detailsMainView}>
                <View style={styles.contentView}>
                    <Text style={styles.title}>{patient?.name}</Text>
                    {!!(patient?.contactNumber || item?.mobile) && (
                        <View style={styles.contactRow}>
                            <Feather name='phone' size={14} color={colors.greenCustom} />
                            <Text style={styles.subTitle}>{patient?.contactNumber || item?.mobile}</Text>
                        </View>
                    )}
                    {!!(patient?.email || item?.email) && (
                        <View style={styles.contactRow}>
                            <Feather name='mail' size={14} color={colors.greenCustom} />
                            <Text style={styles.subTitle}>{patient?.email || item?.email}</Text>
                        </View>
                    )}
                    {!!patient?.address && (
                        <View style={styles.contactRow}>
                            <Feather name='map-pin' size={14} color={colors.greenCustom} />
                            <Text numberOfLines={1} style={styles.subTitle}>{patient?.address}</Text>
                        </View>
                    )}

                    <View style={styles.chipsRow}>
                        {!!item?.appointmentDate && (
                            <View style={styles.chip}>
                                <Feather name='calendar' size={14} color={colors.greenCustom} />
                                <Text style={styles.chipText}>{moment(item?.appointmentDate).format('DD/MM/YYYY')}</Text>
                            </View>
                        )}
                        {!!item?.appointmentTime && (
                            <View style={styles.chip}>
                                <Feather name='clock' size={14} color={colors.greenCustom} />
                                <Text style={styles.chipText}>{TimeFormate(item?.appointmentTime)}</Text>
                            </View>
                        )}
                        {!!item?.totalAmount && (
                            <View style={styles.chip}>
                                <Feather name='credit-card' size={14} color={colors.greenCustom} />
                                <Text style={styles.chipText}>₹ {item?.totalAmount}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.avatarView}>
                    <View style={styles.avatarOuter}>
                        <View style={styles.avatar}> 
                            <Image source={{ uri: patient?.image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                        </View>
                    </View>
                </View>
            </View>

            <Divider />

            <View style={styles.btnRow}>
                <CustomButton
                    icon={null}
                    onPress={() => setCallSheetVisible(true)}
                    title='Call'
                    backgroundColor={colors.greenCustom}
                    textColor={colors.white}
                    isLoading={false}
                />
                {/* <CustomButton
                    icon={null}
                    onPress={() => {
                        const patientId = item?.patientId?._id || item?.userId?._id
                        const doctorId = item?.doctorId?._id || item?.doctorId
                        const appointmentId = item?._id
                        navigation.navigate(NavigationString.UploadPrecription, { patientId, doctorId, appointmentId })
                    }}
                    title='Prescription'
                    backgroundColor={colors.lightGreen1}
                    textColor={colors.black}
                    isLoading={false}
                /> */}
            </View>

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
                                        setCallSheetVisible(false)

                                        // Enhanced logging for patient ID extraction
                                        console.log('🔍 AudioCall: Full appointment item structure:', JSON.stringify(item, null, 2))
                                        console.log('🔍 AudioCall: patientId field:', item?.patientId)
                                        console.log('🔍 AudioCall: userId field:', item?.userId)
                                        console.log('🔍 AudioCall: item._id:', item?._id)

                                        // Proper patient ID extraction with better logging
                                        let receiverId = null
                                        let patientData = null

                                        if (Array.isArray(item?.patientId)) {
                                            console.log('📋 AudioCall: patientId is array, length:', item?.patientId.length)
                                            if (item?.patientId.length > 0) {
                                                patientData = item?.patientId[0]
                                                console.log('👤 AudioCall: Using first patient from array:', patientData)
                                                console.log('🆔 AudioCall: Patient _id:', patientData?._id)
                                                console.log('👤 AudioCall: Patient userId:', patientData?.userId)
                                                receiverId = patientData?.userId || patientData?._id
                                                console.log('🎯 AudioCall: Selected userId as receiverId:', patientData?.userId)
                                                console.log('✅ AudioCall: Will send userId field in API request body')
                                            }
                                        } else if (item?.patientId && typeof item?.patientId === 'object') {
                                            console.log('👤 AudioCall: patientId is object:', item?.patientId)
                                            patientData = item?.patientId
                                            receiverId = item?.patientId?.userId || item?.patientId?._id
                                            console.log('🎯 AudioCall: Using userId from patient object:', item?.patientId?.userId)
                                        } else if (item?.userId) {
                                            console.log('👤 AudioCall: Using userId:', item?.userId)
                                            patientData = item?.userId
                                            receiverId = item?.userId?.userId || item?.userId?._id
                                        } else if (item?._id) {
                                            console.log('👤 AudioCall: Using item._id:', item?._id)
                                            receiverId = item?._id
                                        }

                                        console.log('🎯 AudioCall: Final receiverId extracted (userId):', receiverId)
                                        console.log('👤 AudioCall: Patient data:', patientData)
                                        console.log('✅ AudioCall: Confirmed - sending userId field as receiverId in API body')

                                        if (!receiverId) {
                                            console.log('❌ AudioCall: Missing receiverId on appointment item', item)
                                            Alert.alert('Audio Call', 'Patient ID not found for this appointment. Please try again.')
                                            return
                                        }

                                        console.log('📞 AudioCall: Initiating audio call for receiverId →', receiverId)
                                        const res = await initiateCall(receiverId, 'audio')
                                        console.log('✅ AudioCall: initiateCall response →', res)

                                        const callData = res?.data || res
                                        if (!callData) {
                                            console.log('❌ AudioCall: No call data received from API')
                                            Alert.alert('Audio Call', 'Failed to start call. Please try again.')
                                            return
                                        }

                                        const doctor = patientData || item?.userId || item
                                        console.log('AudioCall: Navigating to AudioCallScreen with params:', {
                                            doctor: doctor,
                                            callData: callData,
                                            callType: 'audio'
                                        })
                                        navigation.navigate(NavigationString.AudioCallScreen, {
                                            doctor,
                                            callData,
                                            callType: 'audio'
                                        })
                                    } catch (error: any) {
                                        console.log('❌ AudioCall: initiateCall failed →', error?.message, error?.response?.data)
                                        Alert.alert('Audio Call', error?.response?.data?.message || 'Unable to start audio call right now.')
                                    }
                                }}
                                title='Audio Call'
                                backgroundColor={colors.greenCustom}
                                textColor={colors.white}
                                isLoading={false}
                            />
                            <CustomButton
                                icon={null}
                                onPress={async () => {
                                    try {
                                        setCallSheetVisible(false)
                                        
                                        // Enhanced logging for patient ID extraction
                                        console.log('🔍 VideoCall: Full appointment item structure:', JSON.stringify(item, null, 2))
                                        console.log('🔍 VideoCall: patientId field:', item?.patientId)
                                        console.log('🔍 VideoCall: userId field:', item?.userId)
                                        console.log('🔍 VideoCall: item._id:', item?._id)
                                        
                                        // Proper patient ID extraction with better logging
                                        let receiverId = null
                                        let patientData = null
                                        
                                        if (Array.isArray(item?.patientId)) {
                                            console.log('📋 VideoCall: patientId is array, length:', item?.patientId.length)
                                            if (item?.patientId.length > 0) {
                                                patientData = item?.patientId[0]
                                                console.log('👤 VideoCall: Using first patient from array:', patientData)
                                                console.log('🆔 VideoCall: Patient _id:', patientData?._id)
                                                console.log('👤 VideoCall: Patient userId:', patientData?.userId)
                                                receiverId = patientData?.userId || patientData?._id
                                                console.log('🎯 VideoCall: Selected userId as receiverId:', patientData?.userId)
                                                console.log('✅ VideoCall: Will send userId field in API request body')
                                            }
                                        } else if (item?.patientId && typeof item?.patientId === 'object') {
                                            console.log('👤 VideoCall: patientId is object:', item?.patientId)
                                            patientData = item?.patientId
                                            receiverId = item?.patientId?.userId || item?.patientId?._id
                                            console.log('🎯 VideoCall: Using userId from patient object:', item?.patientId?.userId)
                                        } else if (item?.userId) {
                                            console.log('👤 VideoCall: Using userId:', item?.userId)
                                            patientData = item?.userId
                                            receiverId = item?.userId?.userId || item?.userId?._id
                                        } else if (item?._id) {
                                            console.log('👤 VideoCall: Using item._id:', item?._id)
                                            receiverId = item?._id
                                        }
                                        
                                        console.log('🎯 VideoCall: Final receiverId extracted (userId):', receiverId)
                                        console.log('👤 VideoCall: Patient data:', patientData)
                                        console.log('✅ VideoCall: Confirmed - sending userId field as receiverId in API body')
                                        
                                        if (!receiverId) {
                                            console.log('❌ VideoCall: Missing receiverId on appointment item', item)
                                            Alert.alert('Video Call', 'Patient ID not found for this appointment. Please try again.')
                                            return
                                        }
                                        
                                        console.log('📞 VideoCall: Initiating video call for receiverId →', receiverId)
                                        const res = await initiateCall(receiverId, 'video')
                                        console.log('✅ VideoCall: initiateCall response →', res)
                                        
                                        const callData = res?.data || res
                                        if (!callData) {
                                            console.log('❌ VideoCall: No call data received from API')
                                            Alert.alert('Video Call', 'Failed to start call. Please try again.')
                                            return
                                        }
                                        
                                        const doctor = patientData || item?.userId || item
                                        console.log('🚀 VideoCall: Navigating to VideoCallScreen with params:', {
                                            doctor: doctor,
                                            callData: callData
                                        })
                                        navigation.navigate(NavigationString.VideoCallScreen, { doctor, callData })
                                    } catch (error: any) {
                                        console.log('❌ VideoCall: initiateCall failed →', error?.message, error?.response?.data)
                                        Alert.alert('Video Call', error?.response?.data?.message || 'Unable to start video call right now.')
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

export default PatientAppointmentView

const styles = StyleSheet.create({
    mainView: {
        width: '90%',
        backgroundColor: colors.white,
        borderRadius: 16,
        elevation: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        marginVertical: 8,
        shadowColor: colors.greenCustom,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        overflow: 'hidden',
        alignSelf: 'center',
        position: 'relative'
    },
    detailsMainView: {
        width: '100%',
        padding: 6,
        marginTop: 6,
        marginBottom: 6,
        flexDirection: 'row',
        alignItems: 'center',
    
    },
    contentView: {
        width: '75%',
        padding: 8,
        borderRadius: 8,
        paddingRight: 12
    },
    avatarView: {
        width: '25%',
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 8
    },
    avatarOuter: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: colors.lightGreen1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.greenCustom,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4
    },
    avatar: {
        width: 84,
        height: 84,
        borderRadius: 42,
        borderWidth: 2,
        borderColor: colors.greenCustom,
        backgroundColor: colors.white,
        overflow: 'hidden',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        color: colors.black,
        fontWeight: '700',
        marginBottom: 8
    },
    subTitle: {
        fontSize: 14,
        color: colors.dark,
        opacity: 0.8,
        marginLeft: 8,
        flex: 1
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        paddingVertical: 2
    },
    amount: {
        fontSize: 16,
        color: colors.greenCustom,
        fontWeight: '600'
    },
    chipsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        flexWrap: 'wrap',
        gap: 8
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderRadius: 14,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 6,
    },
    chipText: {
        fontSize: 12,
        color: colors.dark,
        marginLeft: 6
    },
    btnRow: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        alignSelf: 'center',
        flexDirection: 'row'
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


