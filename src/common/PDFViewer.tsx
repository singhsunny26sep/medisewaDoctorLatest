import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    Alert, 
    TouchableOpacity, 
    ActivityIndicator, 
    SafeAreaView,
    StatusBar,
    Dimensions,
    Platform
} from 'react-native';
import { colors } from '../const/Colors';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const PDFViewer = ({ fileUrl, onClose }: { fileUrl: string; onClose?: () => void }): React.JSX.Element => {
    const [loading, setLoading] = useState<boolean>(true);
    const [downloading, setDownloading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [error, setError] = useState<boolean>(false);

    const handleDownload = async () => {
        if (!fileUrl) {
            Alert.alert('Error', 'No file URL provided.');
            return;
        }

        try {
            setDownloading(true);
            const fileName = fileUrl.split('/').pop() || 'document.pdf';
            const destinationPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

            const downloadResult = await RNFS.downloadFile({
                fromUrl: fileUrl,
                toFile: destinationPath,
            }).promise;

            if (downloadResult.statusCode === 200) {
                Alert.alert(
                    'Download Successful', 
                    `File has been downloaded to your Downloads folder.`,
                    [{ text: 'OK', style: 'default' }]
                );
            } else {
                Alert.alert('Download Failed', 'Unable to download the file. Please try again.');
            }
        } catch (error) {
            console.error('Download Error:', error);
            Alert.alert('Download Error', 'An error occurred while downloading the file.');
        } finally {
            setDownloading(false);
        }
    };

    const handleLoadComplete = (numberOfPages: number) => {
        setLoading(false);
        setTotalPages(numberOfPages);
        setError(false);
    };

    const handleError = (error: any) => {
        setLoading(false);
        setError(true);
        console.error('PDF Error:', error);
    };

    const handlePageChanged = (page: number) => {
        setCurrentPage(page);
    };

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <AntDesign name="arrowleft" size={24} color={colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>PDF Viewer</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={80} color={colors.red} />
                    <Text style={styles.errorTitle}>Unable to Load PDF</Text>
                    <Text style={styles.errorMessage}>
                        The PDF file could not be loaded. Please check your internet connection and try again.
                    </Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => setError(false)}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onClose}>
                    <AntDesign name="arrowleft" size={24} color={colors.white} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>PDF Document</Text>
                    {totalPages > 0 && (
                        <Text style={styles.pageInfo}>
                            Page {currentPage} of {totalPages}
                        </Text>
                    )}
                </View>
                <TouchableOpacity 
                    style={[styles.downloadButton, downloading && styles.downloadButtonDisabled]} 
                    onPress={handleDownload}
                    disabled={downloading}
                >
                    {downloading ? (
                        <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                        <AntDesign name="download" size={20} color={colors.white} />
                    )}
                </TouchableOpacity>
            </View>

            {/* PDF Content */}
            <View style={styles.pdfContainer}>
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.greenCustom} />
                        <Text style={styles.loadingText}>Loading PDF...</Text>
                    </View>
                )}
                
                <Pdf 
                    source={{ uri: fileUrl }} 
                    onLoadComplete={handleLoadComplete}
                    onPageChanged={handlePageChanged}
                    onError={handleError}
                    style={styles.pdf}
                    enablePaging={true}
                    horizontal={false}
                    enableAnnotationRendering={true}
                    enableAntialiasing={true}
                    spacing={10}
                />
            </View>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <View style={styles.navInfo}>
                    <MaterialIcons name="description" size={20} color={colors.gray} />
                    <Text style={styles.navText}>PDF Document</Text>
                </View>
                <View style={styles.navActions}>
                    <TouchableOpacity style={styles.navButton}>
                        <MaterialIcons name="zoom-in" size={20} color={colors.gray} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navButton}>
                        <MaterialIcons name="zoom-out" size={20} color={colors.gray} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PDFViewer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.greenCustom,
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerContent: {
        flex: 1,
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.white,
    },
    pageInfo: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    placeholder: {
        width: 40,
    },
    downloadButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        minWidth: 40,
        alignItems: 'center',
    },
    downloadButtonDisabled: {
        opacity: 0.6,
    },
    pdfContainer: {
        flex: 1,
        backgroundColor: colors.secondary,
        position: 'relative',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        zIndex: 1,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: colors.gray,
        fontWeight: '500',
    },
    pdf: {
        flex: 1,
        backgroundColor: colors.white,
        margin: 8,
        borderRadius: 8,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor: colors.white,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.dark,
        marginTop: 16,
        marginBottom: 8,
    },
    errorMessage: {
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: colors.greenCustom,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    retryButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: colors.lightGrey2,
        elevation: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    navInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navText: {
        marginLeft: 8,
        fontSize: 14,
        color: colors.gray,
        fontWeight: '500',
    },
    navActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navButton: {
        padding: 8,
        marginLeft: 8,
        borderRadius: 20,
        backgroundColor: colors.secondary,
    },
});
