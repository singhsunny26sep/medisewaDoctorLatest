import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../const/Colors'
import useCall from '../hook/useCall'

const AudioCallScreen = ({ route, navigation }: any) => {
    const { doctor, callData, onCallEnd } = route?.params || {}
    const { endCall: endCallApi } = useCall()

    const [isMuted, setIsMuted] = useState(false)
    const [isSpeakerOn, setIsSpeakerOn] = useState(true)
    const [seconds, setSeconds] = useState(0)
    const [callStatus, setCallStatus] = useState<'connecting' | 'in-call' | 'ended'>('connecting')
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
        navigation.setOptions({ title: 'Audio Call' })
    }, [navigation])

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSeconds((s) => s + 1)
        }, 1000)

        const statusTimeout = setTimeout(() => {
            setCallStatus('in-call')
        }, 2000)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
            clearTimeout(statusTimeout)
        }
    }, [])

    useEffect(() => {
        if (callData?.callId) {
            console.log('🎯 Audio call screen loaded with callId:', callData.callId)
            console.log('👤 Caller info:', doctor)
        }
    }, [callData, doctor])

    const timerLabel = useMemo(() => {
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
        const ss = String(seconds % 60).padStart(2, '0')
        return `${mm}:${ss}`
    }, [seconds])

    const endCall = async () => {
        try {
            const callId = callData?.callId
            if (callId) {
                console.log('Ending audio call with callId:', callId)
                const res = await endCallApi(callId)
                console.log('Audio call end API response →', res)
                hasEndedServerRef.current = true
            }
        } catch (error) {
            console.log('Error ending audio call:', error)
        } finally {
            setCallStatus('ended')
            notifyCallEnded()
            navigation.goBack()
        }
    }

    useEffect(() => {
        return () => {
            if (callData?.callId && !hasEndedServerRef.current) {
                console.log('ℹ️ AudioCall: Screen unmounted before explicit end. Leaving call active on server for callId:', callData.callId)
            }
            notifyCallEnded()
        }
    }, [callData?.callId, notifyCallEnded])

    const displayName = callData?.receiver?.name || callData?.caller?.name || doctor?.name || 'Patient'

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.callStatusLabel}>
                    {callStatus === 'connecting' ? 'Connecting…' : callStatus === 'in-call' ? 'On Call' : 'Call Ended'}
                </Text>
                <Text style={styles.timer}>{timerLabel}</Text>
            </View>

            <View style={styles.body}>
                <View style={styles.avatarCircle}>
                    <Ionicons name="call" size={74} color={colors.white} />
                </View>
                <Text style={styles.displayName} numberOfLines={1}>
                    {displayName}
                </Text>
                {!!callData?.callType && <Text style={styles.callTypeLabel}>{callData.callType.toUpperCase()} CALL</Text>}
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.controlButton, !isMuted ? styles.enabledButton : null]}
                    onPress={() => {
                        setIsMuted((prev) => !prev)
                        console.log('Toggle audio mute:', !isMuted)
                    }}
                >
                    <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={26} color={colors.white} />
                    <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.controlButton, isSpeakerOn ? styles.enabledButton : null]}
                    onPress={() => {
                        setIsSpeakerOn((prev) => !prev)
                        console.log('Toggle speaker:', !isSpeakerOn)
                    }}
                >
                    <Ionicons name={isSpeakerOn ? 'volume-high' : 'volume-mute'} size={26} color={colors.white} />
                    <Text style={styles.controlLabel}>{isSpeakerOn ? 'Speaker' : 'Handset'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.controlButton, styles.neutralButton]} onPress={() => console.log('Open keypad')}>
                    <Ionicons name="keypad" size={26} color={colors.white} />
                    <Text style={styles.controlLabel}>Keypad</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.endCallButton]} onPress={endCall}>
                <Ionicons name="call" size={30} color={colors.white} />
            </TouchableOpacity>
        </View>
    )
}

export default AudioCallScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    topBar: {
        alignItems: 'center',
    },
    callStatusLabel: {
        color: colors.white,
        fontSize: 16,
        opacity: 0.8,
        marginBottom: 4,
    },
    timer: {
        color: colors.white,
        fontSize: 22,
        fontWeight: '600',
        letterSpacing: 1,
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: colors.greenCustom,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    displayName: {
        color: colors.white,
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    callTypeLabel: {
        color: colors.white,
        fontSize: 14,
        letterSpacing: 1,
        opacity: 0.7,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    controlButton: {
        flex: 1,
        marginHorizontal: 6,
        borderRadius: 18,
        paddingVertical: 18,
        backgroundColor: '#35383F',
        alignItems: 'center',
    },
    enabledButton: {
        backgroundColor: colors.greenCustom,
    },
    neutralButton: {
        backgroundColor: '#4B4F58',
    },
    controlLabel: {
        color: colors.white,
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    endCallButton: {
        alignSelf: 'center',
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.red,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

