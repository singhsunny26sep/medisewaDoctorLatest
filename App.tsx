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
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      try {
        console.log('📱 Foreground FCM message received:', remoteMessage)
        if (remoteMessage?.data) {
          NotificationService.handleIncomingNotification(remoteMessage.data)
        }
      } catch (error) {
        console.log('❌ Error handling foreground FCM message:', error)
      }
    })

    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp((remoteMessage) => {
      try {
        console.log('📱 FCM notification opened app:', remoteMessage)
        if (remoteMessage?.data) {
          NotificationService.handleIncomingNotification(remoteMessage.data)
        }
      } catch (error) {
        console.log('❌ Error handling opened-app FCM message:', error)
      }
    })

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log('📱 Initial FCM notification:', remoteMessage)
        if (remoteMessage?.data) {
          NotificationService.handleIncomingNotification(remoteMessage.data)
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