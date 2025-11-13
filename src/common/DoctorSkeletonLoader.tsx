import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions, Easing } from 'react-native';
import { colors } from '../const/Colors';
import Divider from './Divider';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const DoctorSkeletonLoader = ({ isLoading }: any) => {
    const [shimmerAnim] = useState(new Animated.Value(0)); // For shimmer effect

    useEffect(() => {
        if (isLoading) {
            // Start the shimmer effect when loading
            Animated.loop(
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1500, // Duration of one shimmer cycle
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        }
    }, [isLoading]);


    // Shimmer style that moves across the screen
    const shimmerStyle = {
        /* transform: [
            {
                translateX: shimmerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-WIDTH, WIDTH], // Ensure these values are numeric, not objects
                }),
            },
        ], */
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, elevation: 1, backgroundColor: colors.white, marginVertical: 3 }}>
                <View style={styles.profileView}>
                    <View style={styles.avatarView}>
                        {/* Shimmer effect on avatar */}
                        <Animated.View style={[styles.imgAvatar, shimmerStyle]} />
                    </View>
                    <View style={styles.doctorDetailsView}>
                        <View style={[styles.nameText, shimmerStyle]} />
                        <View style={[styles.categoryText, shimmerStyle]} />
                        <View style={[styles.title, shimmerStyle]} />
                        <View style={[styles.title, shimmerStyle]} />
                    </View>
                </View>
                <Divider />
                <View style={styles.clinicDetailsView}>
                    <View style={{ width: '50%' }}>
                        <View style={[styles.title, shimmerStyle]} />
                        <View style={[styles.title, shimmerStyle]} />
                    </View>
                    <View style={{ width: '50%' }}>
                        <View style={[styles.buttonSkelleton, shimmerStyle]} />
                    </View>
                </View>
            </View>
        );
    }

    return null; // Return null if not loading
};

export default DoctorSkeletonLoader;

const styles = StyleSheet.create({
    profileView: {
        width: '100%',
        flexDirection: 'row',
    },
    avatarView: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    imgAvatar: {
        width: WIDTH / 3,
        height: WIDTH / 3,
        borderRadius: WIDTH / 6,
        resizeMode: 'cover',
        backgroundColor: '#e0e0e0',
    },
    doctorDetailsView: {
        width: '50%',
        justifyContent: 'center',
    },
    nameText: {
        height: 18,
        fontWeight: 'bold',
        color: colors.black,
        backgroundColor: '#e0e0e0',
        marginBottom: 1,
        width: '80%',
    },
    categoryText: {
        height: 16,
        color: colors.black,
        textDecorationLine: 'underline',
        backgroundColor: '#e0e0e0',
        marginBottom: 1,
        width: '90%',
    },
    title: {
        color: colors.black,
        height: 15,
        backgroundColor: '#e0e0e0',
        width: '70%',
        marginBottom: 1,
    },
    clinicDetailsView: {
        width: '90%',
        flexDirection: 'row',
        marginVertical: 10,
        alignSelf: 'center',
    },
    buttonSkelleton: {
        backgroundColor: '#e0e0e0',
        height: 40,
        width: '90%',
        borderRadius: 25,
    },
});
