import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Alert, Modal, Text, TouchableOpacity, View, StyleSheet, SafeAreaView } from 'react-native'
import RtmService, { RtmIncomingCallPayload } from '../services/RtmService'
import { useLogin } from './LoginProvider'
import { colors } from '../const/Colors'
import { AGORA_APP_ID } from '../const/api'
import { NavigationString } from '../const/NavigationString'
import { navigate } from '../Navigation/navigationRef'
import useCall from '../hook/useCall'

type CallContextType = {
    incoming?: RtmIncomingCallPayload | null
    setIncoming: React.Dispatch<React.SetStateAction<RtmIncomingCallPayload | null | undefined>>
    showIncomingModal: boolean
    setShowIncomingModal: React.Dispatch<React.SetStateAction<boolean>>
}

const CallContext = createContext<Partial<CallContextType>>({})

export const useCallCenter = () => useContext(CallContext)

const getInitials = (name?: string) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const IncomingCallModal = ({ visible, onAccept, onDecline, callerName, callType }: any) => {
    const initials = getInitials(callerName)
    const formattedCallType = callType === 'audio' ? 'Voice' : 'Video'

    if (!visible) return null

    return (
        <Modal 
            visible={visible} 
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={onDecline}
        >
            <View style={styles.modalContainer}>
                <View style={styles.card}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <Text style={styles.callLabel}>Incoming {formattedCallType} Call</Text>
                    <Text style={styles.callerName}>{callerName || 'Unknown caller'}</Text>
                    <Text style={styles.subLabel}>is calling you...</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onDecline} style={[styles.actionButton, styles.declineButton]}>
                            <Text style={styles.actionText}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onAccept} style={[styles.actionButton, styles.acceptButton]}>
                            <Text style={styles.actionText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const CallProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useLogin()
    const [incoming, setIncoming] = useState<RtmIncomingCallPayload | null>()
    const [showIncomingModal, setShowIncomingModal] = useState(false)
    const { acceptCall, cancelCall } = useCall()

    useEffect(() => {
        const setup = async () => {
            if (!user?.id && !user?._id) return
            await RtmService.initialize(AGORA_APP_ID)
            await RtmService.login(String(user?.id || user?._id))
        }
        setup()
    }, [user?.id, user?._id])

    useEffect(() => {
        const currentUserId = String(user?.id || user?._id || '')
        const offInvite = RtmService.on('call_invite', (payload) => {
            console.log('📞 Call invite received:', payload)
            console.log('👤 Current user ID:', currentUserId)
            console.log('📞 Caller ID:', payload?.callerId)
            
            const callerId = String(payload?.callerId || '')
            // Only ignore if callerId matches currentUserId (self-call scenario)
            if (currentUserId && callerId && callerId === currentUserId) {
                console.log('ℹ️ Ignoring self-initiated call invite for user:', currentUserId)
                return
            }
            
            console.log('✅ Showing incoming call modal for:', payload?.callerName)
            setIncoming(payload)
            setShowIncomingModal(true) // ✅ Incoming call आने पर ही modal show करें
        })
        const offCancel = RtmService.on('call_cancelled', (callId) => {
            console.log('📞 Call cancelled:', callId)
            setIncoming(null)
            setShowIncomingModal(false) // ✅ Call cancel होने पर modal hide करें
        })
        return () => {
            offInvite()
            offCancel()
        }
    }, [user?.id, user?._id])

    const onAccept = async () => {
        const callId = incoming?.callId
        if (!callId) {
            setIncoming(null)
            setShowIncomingModal(false)
            return
        }
        try {
            const response = await acceptCall(callId)
            const resolvedCallData = response?.data || response || {}
            const callData: any = {
                ...resolvedCallData,
                callId: resolvedCallData?.callId || callId,
                receiver: resolvedCallData?.receiver || { name: incoming?.callerName }
            }

            if (!callData?.channelName && !callData?.agoraChannel && !callData?.roomId) {
                console.log('⚠️ Accept call response missing video credentials. Response:', JSON.stringify(response, null, 2))
            }

            setIncoming(null)
            setShowIncomingModal(false)
            navigate(NavigationString.VideoCallScreen, {
                doctor: { name: incoming?.callerName },
                callData
            })
        } catch (error: any) {
            console.log('❌ Accept call failed:', error?.message)
            setIncoming(null)
            setShowIncomingModal(false)
            Alert.alert('Video Call', error?.response?.data?.message || 'Unable to accept the call right now. Please try again.')
        }
    }

    const onDecline = async () => {
        const callId = incoming?.callId
        if (callId) {
            try {
                await cancelCall(callId)
            } catch (error) {
                console.log('Error cancelling call:', error)
            }
        }
        setIncoming(null)
        setShowIncomingModal(false)
    }

    const value = useMemo(() => ({ 
        incoming, 
        setIncoming,
        showIncomingModal,
        setShowIncomingModal
    }), [incoming, showIncomingModal])

    return (
        <CallContext.Provider value={value}>
            {children}
            <IncomingCallModal
                visible={showIncomingModal} 
                callerName={incoming?.callerName}
                callType={incoming?.callType}
                onAccept={onAccept}
                onDecline={onDecline}
            />
        </CallContext.Provider>
    )
}

export default CallProvider


const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'rgba(0,0,0,0.65)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    safeArea: {
        width: '100%',
    },
    card: {
        width: '85%',
        maxWidth: 360,
        backgroundColor: colors.white,
        borderRadius: 20,
        paddingVertical: 28,
        paddingHorizontal: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
        elevation: 15,
        zIndex: 1000,
    },
    avatarCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: colors.greenCustom,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: 1,
    },
    callLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.gray,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    callerName: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.black,
        textAlign: 'center',
        marginBottom: 4,
    },
    subLabel: {
        fontSize: 15,
        color: colors.gray,
        marginBottom: 28,
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: colors.greenCustom,
    },
    declineButton: {
        backgroundColor: colors.red,
    },
    actionText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
})