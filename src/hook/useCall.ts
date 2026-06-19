import axios from 'axios'
import { apiCall } from '../const/api'
import RtmService from '../services/RtmService'
import NotificationService from '../services/NotificationService'
import { useLogin } from '../context/LoginProvider'

type CallType = 'audio' | 'video'

const useCall = () => {
    const { optionsGet, user } = useLogin()

    const initiateCall = async (receiverId: string, callType: CallType = 'video') => {
        try {
            const url = `${apiCall.mainUrl}/calls/initiate`
            const payload = { recieverId: receiverId, callType }
            
            console.log('📞 VideoCall API: Initiating call')
            console.log('🔗 URL:', url)
            console.log('📦 Payload being sent:', JSON.stringify(payload, null, 2))
            console.log('🔑 Headers:', optionsGet)
            console.log('👤 Receiver ID (userId):', receiverId)
            console.log('📹 Call Type:', callType)
            console.log('✅ Sending userId field as receiverId in API request body')
            
            const response = await axios.post(url, payload, { headers: optionsGet })
            
            console.log('✅ VideoCall API: Response received')
            console.log('📊 Status:', response.status)
            console.log('📦 Full Response:', JSON.stringify(response?.data, null, 2))
            
            const callDataRaw = response?.data?.data ?? response?.data ?? response
            console.log('🎯 Extracted Call Data:', JSON.stringify(callDataRaw, null, 2))
            
            // Fire RTM invite for incoming popup on receiver side
            if (callDataRaw?.callId) {
                console.log('📡 Sending RTM message to receiver:', receiverId)
                
                try {
                    // Try RTM first
                    await RtmService.sendPeerMessage(receiverId, {
                        type: 'call_invite',
                        callId: callDataRaw.callId,
                        callType,
                        // Use current user's name as caller for popup
                        callerName: user?.name || 'Unknown'
                    })
                    console.log('✅ RTM message sent successfully')
                } catch (rtmError) {
                    console.log('⚠️ RTM failed, falling back to notifications:', rtmError)
                    
// Fallback to notification service
                     await NotificationService.sendCallNotification(receiverId, {
                         callId: callDataRaw.callId,
                         callerName: user?.name || 'Unknown',
                         callType,
                         callerId: String(user?.id || user?._id || '')
                     })
                    console.log('✅ Notification sent successfully')
                }

                // Ensure popup appears in simplified mode by simulating an incoming invite locally
                try {
                    console.log('🧪 Simulating incoming invite locally to ensure popup appears')
                    RtmService.simulateIncomingInvite({
                        callId: callDataRaw.callId,
                        callerId: String(user?.id || user?._id || receiverId),
                        callerName: user?.name || 'Unknown',
                        callType,
                        receiverId: 'local_receiver'
                    })
                } catch (simulateErr) {
                    console.log('❌ Failed to simulate local incoming invite:', simulateErr)
                }
            } else {
                console.log('⚠️ No callId found in response, skipping RTM message')
            }
            
            return callDataRaw ? { ...callDataRaw, callType } : callDataRaw
        } catch (error: any) {
            console.log('❌ VideoCall API Error:')
            console.log('Status:', error?.response?.status)
            console.log('Error Data:', JSON.stringify(error?.response?.data, null, 2))
            console.log('Error Message:', error?.message)
            const backendMsg = error?.response?.data?.msg || error?.response?.data?.message
            console.log('Initiate call error →', backendMsg || error?.message, error?.response?.data)
            throw error
        }
    }

    const acceptCall = async (callId: string) => {
        try {
            const url = `${apiCall.mainUrl}/calls/accept`
            const payload = { callId }
            console.log('Accepting call →', url, payload)
            const response = await axios.put(url, payload, { headers: optionsGet })
            console.log('Accept call response →', response?.data)
            return response?.data
        } catch (error: any) {
            const backendMsg = error?.response?.data?.msg || error?.response?.data?.message
            console.log('Accept call error →', backendMsg || error?.message, error?.response?.data)
            throw error
        }
    }

    const endCall = async (callId: string) => {
        try {
            const url = `${apiCall.mainUrl}/calls/end`
            const payload = { callId }
            console.log('Ending call →', url, payload)
            const response = await axios.post(url, payload, { headers: optionsGet })
            console.log('End call response →', response?.data)
            return response?.data
        } catch (error: any) {
            const backendMsg = error?.response?.data?.msg || error?.response?.data?.message
            console.log('End call error →', backendMsg || error?.message, error?.response?.data)
            throw error
        }
    }

    const cancelCall = async (callId: string) => {
        try {
            const url = `${apiCall.mainUrl}/calls/cancel`
            const payload = { callId }
            console.log('Cancelling call →', url, payload)
            const response = await axios.post(url, payload, { headers: optionsGet })
            console.log('Cancel call response →', response?.data)
            return response?.data
        } catch (error: any) {
            const backendMsg = error?.response?.data?.msg || error?.response?.data?.message
            console.log('Cancel call error →', backendMsg || error?.message, error?.response?.data)
            throw error
        }
    }

    return { initiateCall, acceptCall, endCall, cancelCall }
}

export default useCall


