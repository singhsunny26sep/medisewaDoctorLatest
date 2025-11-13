import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
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
}

const CallContext = createContext<Partial<CallContextType>>({})

export const useCallCenter = () => useContext(CallContext)

const IncomingCallModal = ({ visible, onAccept, onDecline, callerName, callType }: any) => {
    return (
        <Modal visible={visible} transparent animationType='fade'>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: '80%', backgroundColor: colors.white, borderRadius: 12, padding: 16 }}>
                    <Text style={{ fontSize: 16, color: colors.black, marginBottom: 6 }}>Incoming {callType} call</Text>
                    <Text style={{ fontSize: 18, color: colors.black, fontWeight: '600', marginBottom: 16 }}>{callerName || 'Unknown'}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={onDecline} style={{ flex: 1, marginRight: 8, padding: 12, borderRadius: 8, backgroundColor: colors.red, alignItems: 'center' }}>
                            <Text style={{ color: colors.white }}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onAccept} style={{ flex: 1, marginLeft: 8, padding: 12, borderRadius: 8, backgroundColor: colors.greenCustom, alignItems: 'center' }}>
                            <Text style={{ color: colors.white }}>Accept</Text>
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
    const { acceptCall, cancelCall } = useCall()

    useEffect(() => {
        const setup = async () => {
            // Initialize and login to RTM when user is available
            if (!user?.id && !user?._id) return
            await RtmService.initialize(AGORA_APP_ID)
            await RtmService.login(String(user?.id || user?._id))
        }
        setup()
    }, [user?.id, user?._id])

    useEffect(() => {
        const offInvite = RtmService.on('call_invite', (payload) => {
            setIncoming(payload)
        })
        const offCancel = RtmService.on('call_cancelled', () => {
            setIncoming(null)
        })
        return () => {
            offInvite()
            offCancel()
        }
    }, [])

    const onAccept = async () => {
        const callId = incoming?.callId
        if (!callId) return setIncoming(null)
        try {
            await acceptCall(callId)
            const callData: any = { callId, receiver: { name: incoming?.callerName } }
            setIncoming(null)
            navigate(NavigationString.VideoCallScreen, { doctor: { name: incoming?.callerName }, callData })
        } catch (e) {
            setIncoming(null)
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
    }

    const value = useMemo(() => ({ incoming, setIncoming }), [incoming])

    return (
        <CallContext.Provider value={value}>
            {children}
            <IncomingCallModal
                visible={!!incoming}
                callerName={incoming?.callerName}
                callType={incoming?.callType}
                onAccept={onAccept}
                onDecline={onDecline}
            />
        </CallContext.Provider>
    )
}

export default CallProvider


