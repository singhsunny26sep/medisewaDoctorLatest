import { RTMClient, createAgoraRtmClient, RtmConfig } from 'agora-react-native-rtm'
import { Platform } from 'react-native'

type Listener = (...args: any[]) => void

class SimpleEmitter {
    private listeners: Map<string, Set<Listener>> = new Map()

    on(event: string, listener: Listener) {
        if (!this.listeners.has(event)) this.listeners.set(event, new Set())
        this.listeners.get(event)!.add(listener)
        return () => this.removeListener(event, listener)
    }
    removeListener(event: string, listener: Listener) {
        const set = this.listeners.get(event)
        if (!set) return
        set.delete(listener)
        if (set.size === 0) this.listeners.delete(event)
    }

    emit(event: string, ...args: any[]) {
        const set = this.listeners.get(event)
        if (!set) return
        // clone to avoid mutation during emit
        Array.from(set).forEach((l) => l(...args))
    }
}

export type RtmIncomingCallPayload = {
    callId: string
    callerId: string
    callerName?: string
    callType: 'audio' | 'video'
    receiverId: string
}

export type RtmEventMap = {
    call_invite: (payload: RtmIncomingCallPayload) => void
    call_cancelled: (callId: string) => void
}

class RtmService {
    private static _instance: RtmService
    private emitter: SimpleEmitter
    private isInitialized: boolean
    private isLoggedIn: boolean
    private appId?: string
    private userId?: string
    // private rtmClient?: RTMClient

    private constructor() {
        this.emitter = new SimpleEmitter()
        this.isInitialized = false
        this.isLoggedIn = false
    }

    static get instance(): RtmService {
        if (!RtmService._instance) {
            RtmService._instance = new RtmService()
        }
        return RtmService._instance
    }

    async initialize(appId: string) {
        if (this.isInitialized) return
        this.appId = appId

        try {
            // For now, we'll use a simplified approach without native RTM
            // This will be replaced with proper RTM integration later
            console.log('📱 Initializing RTM Service (Simplified Mode)')

            this.isInitialized = true
            console.log('✅ RTM Service initialized successfully (Simplified Mode)')
        } catch (error) {
            console.log('❌ RTM Service initialization failed:', error)
            throw error
        }
    }

    async login(userId: string, token?: string) {
        if (!this.isInitialized) {
            console.log('❌ RTM not initialized')
            return
        }
        
        try {
            this.userId = userId
            this.isLoggedIn = true
            console.log('✅ RTM login successful for user:', userId, '(Simplified Mode)')
        } catch (error) {
            console.log('❌ RTM login failed:', error)
            throw error
        }
    }

    async logout() {
        if (!this.isInitialized || !this.isLoggedIn) return
        
        try {
            this.isLoggedIn = false
            this.userId = undefined
            console.log('✅ RTM logout successful (Simplified Mode)')
        } catch (error) {
            console.log('❌ RTM logout failed:', error)
        }
    }

    on<T extends keyof RtmEventMap>(event: T, listener: RtmEventMap[T]) {
        return this.emitter.on(event as string, listener as any)
    }

    async sendPeerMessage(receiverId: string, message: any) {
        if (!this.isInitialized || !this.isLoggedIn) {
            console.log('❌ RTM not ready for sending messages')
            return
        }
        
        try {
            const messageText = JSON.stringify(message)
            console.log('📤 Sending RTM message to:', receiverId, messageText)
            console.log('📱 Note: Using simplified mode - message will be sent via API instead of RTM')
            
            // For now, we'll just log the message
            // In a real implementation, this would send via RTM or fallback to push notifications
            console.log('✅ RTM message logged successfully (Simplified Mode)')
        } catch (error) {
            console.log('❌ Failed to send RTM message:', error)
            throw error
        }
    }

    // Helper to simulate receiving an invite (useful for testing without SDK)
    simulateIncomingInvite(payload: RtmIncomingCallPayload) {
        console.log('🧪 Simulating incoming invite:', payload)
        this.emitter.emit('call_invite', payload)
    }

    // Test method to simulate incoming call for testing
    testIncomingCall() {
        const testPayload: RtmIncomingCallPayload = {
            callId: 'test_call_123',
            callerId: 'test_caller',
            callerName: 'Test Doctor',
            callType: 'video',
            receiverId: this.userId || 'test_receiver'
        }
        this.simulateIncomingInvite(testPayload)
    }
}

export default RtmService.instance


