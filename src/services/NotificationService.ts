import { Platform, Alert } from 'react-native'
import RtmService from './RtmService'

export interface CallNotificationPayload {
    callId: string
    callerName: string
    callType: 'audio' | 'video'
    callerId: string
}

class NotificationService {
    private static _instance: NotificationService

    private constructor() {}

    static get instance(): NotificationService {
        if (!NotificationService._instance) {
            NotificationService._instance = new NotificationService()
        }
        return NotificationService._instance
    }

    async sendCallNotification(receiverId: string, payload: CallNotificationPayload) {
        try {
            console.log('📱 Sending call notification to:', receiverId, payload)
            
            // For now, we'll use a simple alert as fallback
            // In production, this should integrate with Firebase Cloud Messaging or similar
            if (Platform.OS === 'android') {
                // Android notification logic would go here
                console.log('📱 Android notification would be sent here')
            } else if (Platform.OS === 'ios') {
                // iOS notification logic would go here
                console.log('📱 iOS notification would be sent here')
            }
            
            // For testing purposes, we'll simulate the notification
            this.simulateNotification(payload)
            
        } catch (error) {
            console.log('❌ Failed to send notification:', error)
        }
    }

    private simulateNotification(payload: CallNotificationPayload) {
        // This simulates receiving a notification
        console.log('🔔 Simulated notification received:', payload)
        
        // Trigger the in-app incoming call popup via RTM emitter (simplified mode)
        // This mirrors what would happen after receiving a real push/RTM message
        try {
            RtmService.simulateIncomingInvite({
                callId: payload.callId,
                callerId: payload.callerId,
                callerName: payload.callerName,
                callType: payload.callType,
                // In real push, backend includes receiverId; here we don't need it for UI
                receiverId: 'local_receiver'
            })
        } catch (e) {
            console.log('❌ Failed to emit simulated incoming invite:', e)
        }
        console.log(`📞 Incoming ${payload.callType} call from ${payload.callerName}`)
    }

    // Method to handle incoming notifications (called by the app when notification is received)
    handleIncomingNotification(notificationData: any) {
        try {
            console.log('📥 Raw notification data received:', notificationData)
            
            // Handle nested FCM data structure (backend may send data inside data.data)
            let raw = notificationData
            if (notificationData?.data?.data) {
                try {
                    raw = typeof notificationData.data.data === 'string' 
                        ? JSON.parse(notificationData.data.data)
                        : notificationData.data.data
                } catch (parseError) {
                    console.log('❌ Failed to parse nested data, using raw notificationData:', parseError)
                }
            }
            
            // FCM sends all data as strings, validate and parse them
            const callId = String(raw.callId || raw?.data?.callId || '');
            const callerId = String(raw.callerId || raw?.data?.callerId || '');
            const callType = (raw.callType === 'audio' || raw.callType === 'video') 
                ? raw.callType 
                : 'video';
            const callerName = String(raw.callerName || raw?.data?.callerName || 'Unknown');
            
            // Validate required fields
            if (!callId) {
                console.log('❌ Missing callId in notification data')
                return null
            }
            
            const payload: CallNotificationPayload = {
                callId,
                callerName,
                callType,
                callerId
            }
            
            console.log('📨 Processing incoming notification:', payload)
            
            // Emit the call_invite event so UI can show the popup
            try {
                RtmService.simulateIncomingInvite({
                    callId: payload.callId,
                    callerId: payload.callerId,
                    callerName: payload.callerName,
                    callType: payload.callType,
                    receiverId: 'local_receiver'
                })
            } catch (e) {
                console.log('❌ Failed to emit incoming invite from notification:', e)
            }
            return payload
        } catch (error) {
            console.log('❌ Error processing notification:', error)
            return null
        }
    }
}

export default NotificationService.instance
