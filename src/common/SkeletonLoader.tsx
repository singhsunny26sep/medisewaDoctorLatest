import React, { useState, useEffect, Fragment } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { colors, WIDTH } from '../const/Colors';

const SkeletonLoader = ({ isLoading }: any) => {
    const [fadeAnim] = useState(new Animated.Value(0)); // For fade-in effect

    useEffect(() => {
        // if (!isLoading) {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
        // }
    }, [isLoading]);

    if (isLoading) {
        // Skeleton loader
        return (
            <View style={[styles.card, styles.skeletonCard]}>
                <View style={styles.skeletonImage} />
                <View style={styles.skeletonText} />
            </View>
        );
    }
    if (!isLoading) null
}

export default SkeletonLoader

const styles = StyleSheet.create({
    // Skeleton loader styles
    card: {
        width: WIDTH / 4,
        height: WIDTH / 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1.5,
        elevation: 1,
        marginHorizontal: '2.5%',
        marginTop: 10,
    },
    skeletonCard: {
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    skeletonImage: {
        width: '100%',
        height: '70%',
        backgroundColor: '#d6d6d6',
        borderRadius: WIDTH / 2,
        marginBottom: 8,
    },
    skeletonText: {
        width: '60%',
        height: 12,
        backgroundColor: '#d6d6d6',
        borderRadius: 4,
    },
})