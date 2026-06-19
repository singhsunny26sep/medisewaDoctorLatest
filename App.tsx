import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import MainNavigation from './src/Navigation/MainNavigation'
import LoginProvider from './src/context/LoginProvider'
import CallProvider from './src/context/CallProvider'
import { navigationRef } from './src/Navigation/navigationRef'
import messaging from '@react-native-firebase/messaging'
import NotificationService from './src/services/NotificationService'

const App = (): React.JSX.Element => {
  useEffect(() => {
    const handleCallNotification = (remoteMessage: any) => {
      console.log('📱 FCM message received:', JSON.stringify(remoteMessage, null, 2))
      if (remoteMessage?.data) {
        // Handle nested FCM data structure (backend may send data inside data.data)
        const data = remoteMessage.data?.data
          ? (typeof remoteMessage.data.data === 'string'
              ? JSON.parse(remoteMessage.data.data)
              : remoteMessage.data.data)
          : remoteMessage.data
        NotificationService.handleIncomingNotification(data)
      }
    }
    
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      try {
        handleCallNotification(remoteMessage)
      } catch (error) {
        console.log('❌ Error handling foreground FCM message:', error)
      }
    })

    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp((remoteMessage) => {
      try {
        handleCallNotification(remoteMessage)
      } catch (error) {
        console.log('❌ Error handling opened-app FCM message:', error)
      }
    })

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log('📱 Initial FCM notification:', JSON.stringify(remoteMessage, null, 2))
        if (remoteMessage?.data) {
          handleCallNotification(remoteMessage)
        }
      })
      .catch((error) => {
        console.log('❌ Error handling initial FCM notification:', error)
      })

    return () => {
      unsubscribeForeground()
      unsubscribeOpenedApp()
    }
  }, [])

  return (
    <NavigationContainer ref={navigationRef}>
      <LoginProvider>
        <CallProvider>
          <MainNavigation />
        </CallProvider>
      </LoginProvider>
    </NavigationContainer>
  )
}

export default App