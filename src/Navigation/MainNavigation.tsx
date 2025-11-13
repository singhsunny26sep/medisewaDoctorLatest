import { View, Text, Alert } from 'react-native'
import React, { Fragment, useEffect } from 'react'
import { useLogin } from '../context/LoginProvider';
import Auth from './Auth';
import UnAuth from './UnAuth';
import { PermissionsAndroid, Platform } from 'react-native'
import { check, PERMISSIONS, request, requestNotifications, RESULTS } from 'react-native-permissions'

const MainNavigation = (): React.JSX.Element => {
    const checkPermission = async () => {
        try {
            // Request notification permission
            const { status: notificationStatus } = await requestNotifications(['alert', 'badge', 'sound']);

            if (notificationStatus !== 'granted') {
                Alert.alert(
                    'Notification Permission Denied',
                    'Please enable notifications to use this feature.',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Enable', // If user presses Enable, re-request permission
                            onPress: () => requestPermission(),
                        },
                    ]
                );
            } else {
                // setPermissionStatus(notificationStatus);
            }

            // Check camera and gallery permissions
            if (Platform.OS === 'android') {
                const cameraPermission = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'We need access to your camera to capture photos.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                const galleryPermission = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission',
                        message: 'We need access to your photo library to upload images.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (
                    cameraPermission !== PermissionsAndroid.RESULTS.GRANTED ||
                    galleryPermission !== PermissionsAndroid.RESULTS.GRANTED
                ) {
                    Alert.alert(
                        'Permission Denied',
                        'Camera and Storage permissions are required to use this feature.'
                    );
                }
            } else {
                // iOS permissions
                const cameraStatus = await check(PERMISSIONS.IOS.CAMERA);
                const galleryStatus = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

                if (cameraStatus !== RESULTS.GRANTED) {
                    const cameraRequest = await request(PERMISSIONS.IOS.CAMERA);
                    if (cameraRequest !== RESULTS.GRANTED) {
                        Alert.alert('Permission Denied', 'Camera access is required.');
                    }
                }

                if (galleryStatus !== RESULTS.GRANTED) {
                    const galleryRequest = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
                    if (galleryRequest !== RESULTS.GRANTED) {
                        Alert.alert('Permission Denied', 'Photo Library access is required.');
                    }
                }
            }
        } catch (error) {
            console.error('Error checking permissions:', error);
        }
    };

    const requestPermission = async () => {
        try {
            // Re-request notification permission
            const { status: notificationStatus } = await requestNotifications(['alert', 'badge', 'sound']);
            if (notificationStatus !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'You can enable notifications in settings later.'
                );
                return;
            }

            // Re-request camera and gallery permissions
            if (Platform.OS === 'android') {
                const cameraPermission = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA
                );
                const galleryPermission = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                );

                if (
                    cameraPermission !== PermissionsAndroid.RESULTS.GRANTED ||
                    galleryPermission !== PermissionsAndroid.RESULTS.GRANTED
                ) {
                    Alert.alert(
                        'Permission Denied',
                        'Camera and Storage permissions are required to use this feature.'
                    );
                }
            } else {
                const cameraRequest = await request(PERMISSIONS.IOS.CAMERA);
                const galleryRequest = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

                if (cameraRequest !== RESULTS.GRANTED || galleryRequest !== RESULTS.GRANTED) {
                    Alert.alert('Permission Denied', 'Camera and Photo Library access are required.');
                }
            }
        } catch (error) {
            console.error('Error requesting permissions:', error);
        }
    };


    const { isLoggedIn } = useLogin()

    useEffect(() => {
        checkPermission()
    }, [])

    return (
        <Fragment>
            {isLoggedIn ? <Auth /> : <UnAuth />}
            {/* <Auth /> */}
        </Fragment>
    )
}

export default MainNavigation