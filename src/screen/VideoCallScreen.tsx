import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../const/Colors'
import useCall from '../hook/useCall'

const VideoCallScreen = ({ route, navigation }: any) => {
    const { doctor, callData, callType = 'video' } = route?.params || {}
    const { endCall: endCallApi } = useCall()

    const [isMuted, setIsMuted] = useState(false)
    const [isCameraOn, setIsCameraOn] = useState(callType === 'video')
    const [isSpeakerOn, setIsSpeakerOn] = useState(true)
    const [seconds, setSeconds] = useState(0)
    const [callStatus, setCallStatus] = useState('connecting')
    const intervalRef = useRef<any>(null)

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSeconds((s) => s + 1)
        }, 1000)
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    useEffect(() => {
        if (callData?.callId) {
            console.log('🎯 Call screen loaded with callId:', callData.callId)
            console.log('📞 Call type:', callType)
            console.log('👤 Doctor info:', doctor)
            setCallStatus('connecting')
        }
    }, [callData, callType, doctor])

    const timerLabel = useMemo(() => {
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
        const ss = String(seconds % 60).padStart(2, '0')
        return `${mm}:${ss}`
    }, [seconds])

    const endCall = async () => {
        try {
            const callId = callData?.callId
            if (callId) {
                console.log('Ending call with callId:', callId)
                const res = await endCallApi(callId)
                console.log('Call end API response →', res)
            }
        } catch (error) {
            console.log('Error ending call:', error)
        } finally {
            navigation.goBack()
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
             
                <View style={styles.topBarCenter}>
                    <Text style={styles.doctorName} numberOfLines={1}>
                        {callData?.receiver?.name || doctor?.name || 'Doctor'}
                    </Text>
                    <Text style={styles.timer}>{timerLabel}</Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.videoArea}>
                {callType === 'video' ? (
                    <>
                        <View style={styles.remoteVideo}>
                            <Text style={styles.videoLabel}>Connecting...</Text>
                        </View>
                        <View style={styles.localVideo}>
                            <Text style={styles.videoLabelSmall}>You</Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.audioCallArea}>
                        <View style={styles.audioCallContent}>
                            <Ionicons name="call" size={80} color={colors.greenCustom} />
                            <Text style={styles.audioCallTitle}>
                                {callData?.receiver?.name || doctor?.name || 'Doctor'}
                            </Text>
                            <Text style={styles.audioCallStatus}>
                                {callStatus === 'connecting' ? 'Calling...' : callStatus}
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.controls}>
                {callType === 'video' ? (
                    <>
                        <TouchableOpacity
                            style={[styles.controlButton, !isMuted ? styles.enabled : null]}
                            onPress={() => {
                                setIsMuted((v) => !v)
                                console.log('Toggle mute:', !isMuted)
                            }}
                        >
                            <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={24} color={colors.white} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.controlButton, isCameraOn ? styles.enabled : null]}
                            onPress={() => {
                                setIsCameraOn((v) => !v)
                                console.log('Toggle camera:', !isCameraOn)
                            }}
                        >
                            <Ionicons name={isCameraOn ? 'videocam' : 'videocam-off'} size={24} color={colors.white} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.controlButton} onPress={() => console.log('Switch camera')}>
                            <Ionicons name="camera-reverse" size={24} color={colors.white} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.controlButton, styles.hangup]} onPress={endCall}>
                            <Ionicons name="call" size={24} color={colors.white} />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity
                            style={[styles.controlButton, !isMuted ? styles.enabled : null]}
                            onPress={() => {
                                setIsMuted((v) => !v)
                                console.log('Toggle mute:', !isMuted)
                            }}
                        >
                            <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={24} color={colors.white} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.controlButton, isSpeakerOn ? styles.enabled : null]}
                            onPress={() => {
                                setIsSpeakerOn((v) => !v)
                                console.log('Toggle speaker:', !isSpeakerOn)
                            }}
                        >
                            <Ionicons name={isSpeakerOn ? 'volume-high' : 'volume-mute'} size={24} color={colors.white} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.controlButton} onPress={() => console.log('Show keypad')}>
                            <Ionicons name="keypad" size={24} color={colors.white} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.controlButton, styles.hangup]} onPress={endCall}>
                            <Ionicons name="call" size={24} color={colors.white} />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    )
}

export default VideoCallScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black
    },
    topBar: {
        height: 56,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.greenCustom
    },
    topBarCenter: {
        flex: 1,
        alignItems: 'center'
    },
    doctorName: {
        color: colors.white,
        fontSize: 15
    },
    timer: {
        color: colors.lightGrey,
        fontSize: 12,
        marginTop: 2
    },
    videoArea: {
        flex: 1,
        position: 'relative',
        backgroundColor: colors.black
    },
    remoteVideo: {
        flex: 1,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center'
    },
    localVideo: {
        position: 'absolute',
        right: 12,
        bottom: 12,
        width: 110,
        height: 160,
        backgroundColor: '#222',
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333'
    },
    videoLabel: {
        color: colors.white,
        fontSize: 16
    },
    videoLabelSmall: {
        color: colors.white,
        fontSize: 12
    },
    controls: {
        height: 90,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: 16
    },
    controlButton: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center'
    },
    enabled: {
        backgroundColor: colors.greenCustom
    },
    hangup: {
        backgroundColor: colors.red
    },
    audioCallArea: {
        flex: 1,
        backgroundColor: colors.black,
        justifyContent: 'center',
        alignItems: 'center'
    },
    audioCallContent: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    audioCallTitle: {
        color: colors.white,
        fontSize: 24,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10
    },
    audioCallStatus: {
        color: colors.lightGrey,
        fontSize: 16
    }
})

