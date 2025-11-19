import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

/**
 * Get FCM token for push notifications
 * @returns Promise<string> - FCM token or empty string if unavailable
 */
export const getFcmToken = async (): Promise<string> => {
  try {
    // Request permission for iOS
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('⚠️ FCM: User has not granted notification permission');
        return '';
      }
    }

    await messaging().registerDeviceForRemoteMessages();

    await messaging().setAutoInitEnabled(true);

    const token = await messaging().getToken();
    
    if (token) {
      console.log('✅ FCM Token obtained successfully');
      console.log('📱 FCM Token:', token);
      console.log('📱 FCM Token length:', token.length);
      return token;
    } else {
      console.log('⚠️ FCM: Token is empty');
      return '';
    }
  } catch (error: any) {
    console.error('❌ Error getting FCM token:', error);
    console.error('❌ Error details:', error?.message || 'Unknown error');
    console.error('❌ Make sure @react-native-firebase/messaging is installed and properly configured');
    return '';
  }
};

