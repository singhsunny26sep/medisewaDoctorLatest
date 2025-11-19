/**
 * @format
 */
// import './gesture-handler';
import { decode, encode } from 'base-64';

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import NotificationService from './src/services/NotificationService';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    try {
        if (remoteMessage?.data) {
            NotificationService.handleIncomingNotification(remoteMessage.data);
        }
    } catch (error) {
        console.log('❌ Error handling background FCM message:', error);
    }
});

AppRegistry.registerComponent(appName, () => App);
