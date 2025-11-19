import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../const/Colors'
import useCall from '../hook/useCall'

const VideoCallScreen = ({ route, navigation }: any) => {
    const { doctor, callData, onCallEnd } = route?.params || {}
    const { endCall: endCallApi } = useCall()

    const [isMuted, setIsMuted] = useState(false)
    const [isCameraOn, setIsCameraOn] = useState(true) 
    const [seconds, setSeconds] = useState(0)
    const [callStatus, setCallStatus] = useState<'connecting' | 'live'>('connecting')
    useEffect(() => {
        const statusTimer = setTimeout(() => {
            setCallStatus('live')
        }, 2000)
        return () => clearTimeout(statusTimer)
    }, [])

    const intervalRef = useRef<any>(null)
    const hasEndedServerRef = useRef(false)
    const hasNotifiedEndRef = useRef(false)

    const notifyCallEnded = useCallback(() => {
        if (hasNotifiedEndRef.current) return
        hasNotifiedEndRef.current = true
        if (typeof onCallEnd === 'function') {
            try {
                onCallEnd()
            } catch (error) {
                console.log('Error executing onCallEnd callback:', error)
            }
        }
    }, [onCallEnd])

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
            console.log('Video call screen loaded with callId:', callData.callId)
            console.log(' Opponent info:', doctor)
            setCallStatus('connecting')
        }
    }, [callData, doctor])

    useEffect(() => {
        navigation.setOptions({
            title: 'Video Call',
        })
    }, [navigation])

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
                hasEndedServerRef.current = true
            }
        } catch (error) {
            console.log('Error ending call:', error)
        } finally {
            notifyCallEnded()
            navigation.goBack()
        }
    }

    useEffect(() => {
        return () => {
            if (callData?.callId && !hasEndedServerRef.current) {
                console.log('Video call screen unmounted without explicit end, attempting cleanup for callId:', callData.callId)
                endCallApi(callData.callId)
                    .then((res) => console.log('Auto-ended video call on unmount →', res))
                    .catch((error) => console.log('Error auto-ending video call on unmount:', error))
                hasEndedServerRef.current = true
            }
            notifyCallEnded()
        }
    }, [callData?.callId, endCallApi, notifyCallEnded])

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
                <View style={styles.remoteVideo}>
                    <Text style={styles.videoLabel}>{callStatus === 'connecting' ? 'Connecting…' : 'Live'}</Text>
                </View>
                <View style={styles.localVideo}>
                    <Text style={styles.videoLabelSmall}>You</Text>
                </View>
            </View>

            <View style={styles.controls}>
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

