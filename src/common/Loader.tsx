import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';
import { colors } from '../const/Colors';

const Loader = ({ loading }: { loading: boolean }) => {
    if (!loading) {
        return null; // If not loading, render nothing
    }

    return (
        <View style={styles.overlay}>
            <ActivityIndicator size="large" color={colors.greenCustom} style={styles.loader} />
        </View>
    );
};

export default Loader;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject, // Covers the entire screen
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a semi-transparent background
        zIndex: 10, // Ensures it appears above other content
    },
    loader: {
        transform: [{ translateX: -25 }, { translateY: -25 }],
    },
});
