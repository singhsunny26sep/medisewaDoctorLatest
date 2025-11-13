import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../const/Colors';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';


interface PdfViewerScreenProps {
  route: {
    params: {
      pdfPath: string;
      prescriptionData?: any;
    };
  };
  navigation: any;
}

const PdfViewerScreen: React.FC<PdfViewerScreenProps> = ({route, navigation}) => {
  const {pdfPath, prescriptionData} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Prescription PDF',
      headerStyle: {
        backgroundColor: colors.greenCustom,
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation]);

  const getCorrectFilePath = (path: string) => {
    if (path.startsWith('file://')) {
      return path.substring(7);
    }
    return path;
  };

   const checkFileExists = async (path: string) => {
    try {
      const correctPath = getCorrectFilePath(path);
      return await RNFS.exists(correctPath);
    } catch (error) {
      console.log('Error checking file existence:', error);
      return false;
    }
  };

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 29) {
        console.log('Android 10+ detected, proceeding without storage permission');
        return true;
      }

      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      
      if (hasPermission) {
        return true;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs storage permission to save PDF files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Grant Permission',
        },
      );
      
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission Required',
          'Storage permission is required. Please go to Settings > Apps > Your App > Permissions and enable Storage permission.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: () => Linking.openSettings()}
          ]
        );
        return false;
      }
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Storage permission is required to download PDF files.');
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Permission request error:', err);
      // For Android 10+ (API 29+), we don't need storage permission for Downloads folder
      if (Platform.OS === 'android' && Platform.Version >= 29) {
        console.log('Android 10+ detected, proceeding without storage permission');
        return true;
      }
      Alert.alert('Error', 'Failed to request storage permission.');
      return false;
    }
  };

  const downloadPDF = async () => {
    try {
      setIsLoading(true);
  
      if (!pdfPath) {
        Alert.alert('Error', 'No PDF to download');
        return;
      }

      console.log('Original pdfPath:', pdfPath);
      const correctSourcePath = getCorrectFilePath(pdfPath);
      console.log('Corrected source path:', correctSourcePath);

      const sourceExists = await checkFileExists(pdfPath);
      console.log('Source file exists:', sourceExists);
      if (!sourceExists) {
        Alert.alert('Error', 'Source PDF file not found');
        return;
      }
  
      const fileName = `Prescription_${prescriptionData?.id || Date.now()}.pdf`;
      let destPath = '';
  
      if (Platform.OS === 'android') {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) return;
  
        // Use Download directory
        destPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
        console.log('Destination path:', destPath);
  
        // Check if file already exists and remove it
        const fileExists = await RNFS.exists(destPath);
        if (fileExists) {
          await RNFS.unlink(destPath);
        }
  
        // Copy the file from internal storage to Downloads
        try {
          await RNFS.copyFile(correctSourcePath, destPath);
          console.log('File copied successfully');
          
          // Make file visible in Downloads app
          if (ReactNativeBlobUtil.fs.scanFile) {
            await ReactNativeBlobUtil.fs.scanFile([{
              path: destPath,
              mime: 'application/pdf'
            }]);
            console.log('File scanned for Downloads app');
          }
          
          Alert.alert(
            'Download Complete!',
            `PDF has been saved to your Downloads folder`,
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('Drawer');
                }
              }
            ]
          );
        } catch (copyError) {
          console.log('Copy failed:', copyError);
          
          // Alternative method using react-native-blob-util
          try {
            const response = await ReactNativeBlobUtil.fs.readFile(correctSourcePath, 'base64');
            await ReactNativeBlobUtil.fs.writeFile(destPath, response, 'base64');
            console.log('File written using react-native-blob-util');
            
            // Make file visible
            if (ReactNativeBlobUtil.fs.scanFile) {
              await ReactNativeBlobUtil.fs.scanFile([{path: destPath, mime: 'application/pdf'}]);
            }
            
            Alert.alert(
              'Download Complete!',
              `PDF has been saved to your Downloads folder`,
              [
                {text: 'OK'},
                {
                  text: 'Open Downloads',
                  onPress: () => {
                    try {
                      Linking.openURL('content://com.android.providers.downloads.documents');
                    } catch (e) {
                      FileViewer.open(destPath, {showOpenWithDialog: true});
                    }
                  }
                },
                {
                  text: 'Open File',
                  onPress: () => FileViewer.open(destPath, {showOpenWithDialog: true})
                }
              ]
            );
          } catch (blobError) {
            console.log('RNFetchBlob method failed:', blobError);
            throw new Error('Failed to copy PDF file');
          }
        }
      } else {
        // iOS implementation
        destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        await RNFS.copyFile(correctSourcePath, destPath);
        
        Alert.alert(
          'Download Complete!',
          `PDF has been saved to your Documents folder`,
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('DrawerNavigator');
              }
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('Download error:', error);
      Alert.alert(
        'Error',
        `Failed to download PDF: ${error.message || 'Unknown error'}`,
        [
          {text: 'OK'},
          {
            text: 'Try Sharing Instead',
            onPress: () => sharePDF()
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const sharePDF = async () => {
    try {
      setIsSharing(true);
  
      if (!pdfPath) {
        Alert.alert('Error', 'No PDF to share');
        return;
      }
  
      const correctPath = getCorrectFilePath(pdfPath);
      const sourceExists = await checkFileExists(correctPath);
      if (!sourceExists) {
        Alert.alert('Error', 'PDF file not found');
        return;
      }
  
      const fileName = `prescription_${Date.now()}.pdf`;
      const tempPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
      
      // Copy to cache to ensure access
      await RNFS.copyFile(correctPath, tempPath);
  
      const shareOptions = {
        title: 'Share PDF',
        url: `file://${tempPath}`,
        type: 'application/pdf',
        failOnCancel: false,
      };
  
      const result = await Share.open(shareOptions);
  
      if (result.success) {
        console.log('PDF shared successfully');
      } else {
        console.log('Share cancelled or failed');
      }
  
    } catch (error: any) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share PDF');
    } finally {
      setIsSharing(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.pdfContainer}>
        <Pdf
          source={{ uri: `file://${getCorrectFilePath(pdfPath)}`, cache: false }}
          style={styles.pdf}
          scale={1.5}
          onLoadComplete={(numberOfPages) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onError={(error) => {
            console.log('PDF error:', error);
            Alert.alert('Error', 'Failed to load PDF');
          }}
          onPageChanged={(page) => {
            console.log(`Current page: ${page}`);
          }}
        />
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, isLoading && styles.disabledButton]}
          onPress={downloadPDF}
          disabled={isLoading}
        >
          <Ionicons name="download" size={20} color={colors.white} />
          <Text style={styles.actionButtonText}>
            {isLoading ? 'Downloading...' : 'Download'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, isSharing && styles.disabledButton]}
          onPress={sharePDF}
          disabled={isSharing}
        >
          <Ionicons name="share-social" size={20} color={colors.white} />
          <Text style={styles.actionButtonText}>
            {isSharing ? 'Sharing...' : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
    elevation: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.greenCustom,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 2,
    minWidth: 100,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: colors.lightGrey,
    opacity: 0.7,
  },
});

export default PdfViewerScreen;