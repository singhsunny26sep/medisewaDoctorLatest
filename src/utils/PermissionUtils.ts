import { Platform, Alert, Linking } from 'react-native'
import { request, check, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions'

export const PERMISSION_TYPES = {
  CAMERA: Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  MICROPHONE: Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO,
  STORAGE: Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
}

export const requestPermissions = async (): Promise<boolean> => {
  try {
    console.log('🔐 Requesting permissions...')
    
    // Request camera permission
    const cameraResult = await request(PERMISSION_TYPES.CAMERA)
    console.log('📷 Camera permission result:', cameraResult)
    
    // Request microphone permission
    const microphoneResult = await request(PERMISSION_TYPES.MICROPHONE)
    console.log('🎤 Microphone permission result:', microphoneResult)
    
    // Request storage permission (Android only)
    let storageResult: string = RESULTS.GRANTED
    if (Platform.OS === 'android') {
      storageResult = await request(PERMISSION_TYPES.STORAGE)
      console.log('💾 Storage permission result:', storageResult)
    }
    
    const allGranted = cameraResult === RESULTS.GRANTED && 
                      microphoneResult === RESULTS.GRANTED && 
                      (storageResult === RESULTS.GRANTED || storageResult === RESULTS.UNAVAILABLE)
    
    if (!allGranted) {
      Alert.alert(
        'Permissions Required',
        'Camera, microphone, and storage permissions are required for video calling. Please enable them in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      )
    }
    
    return allGranted
  } catch (error) {
    console.log('❌ Permission request error:', error)
    return false
  }
}

export const checkPermissions = async (): Promise<boolean> => {
  try {
    const cameraResult = await check(PERMISSION_TYPES.CAMERA)
    const microphoneResult = await check(PERMISSION_TYPES.MICROPHONE)
    const storageResult = Platform.OS === 'android' ? await check(PERMISSION_TYPES.STORAGE) : RESULTS.GRANTED
    
    return cameraResult === RESULTS.GRANTED && 
           microphoneResult === RESULTS.GRANTED && 
           (storageResult === RESULTS.GRANTED || storageResult === RESULTS.UNAVAILABLE)
  } catch (error) {
    console.log('❌ Permission check error:', error)
    return false
  }
}
