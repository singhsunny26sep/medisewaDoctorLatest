import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions, Easing } from 'react-native';
import { colors } from '../const/Colors';
import Divider from './Divider';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const  AppointmentSkeletonLoader = ({ isLoading }: any) => {
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
            <View style={styles.mainView}>
                <View style={styles.bookingStatus}>
                    <View style={styles.bookingText} />
                    <View style={styles.btnTouch} />
                </View>
                <Divider />
                <View style={styles.detailsMainView}>
                    <View style={styles.contentView}>
                        <Text style={styles.title} />
                        <Text style={styles.title} />
                        <Text style={styles.title} />
                        <Text style={styles.title} />
                        <Text style={styles.title} />
                    </View>
                    <View style={styles.avatarView}>
                        <View style={styles.avatar} />
                    </View>
                </View>
                <Divider />

                <View style={styles.btnView}>
                    <View style={styles.btnLoader} />
                    <View style={styles.btnLoader} />
                </View>
            </View>
        );
    }

    return null; // Return null if not loading
};

export default AppointmentSkeletonLoader;

const styles = StyleSheet.create({
    mainView: {
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: 8,
        elevation: 3,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        marginVertical: 3
    },
    bookingStatus: {
        width: '100%',
        borderRadius: 5,
        marginBottom: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: colors.lightGrey2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bookingText: {
        color: colors.greenCustom,
        fontSize: 15,
        width: '70%',
        backgroundColor: colors.lightGrey2,
        height: 30
    },
    detailsMainView: {
        width: '100%',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
    },
    contentView: {
        width: '70%',
        padding: 10,
        borderRadius: 5,
    },
    avatarView: {
        width: '30%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: WIDTH / 2,
        backgroundColor: colors.lightGrey2,
        overflow: 'hidden',
        marginBottom: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnView: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    btnLoader: {
        width: '40%',
        height: 35,
        borderRadius: 20,
        backgroundColor: colors.lightGrey2
    },
    btnTouch: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightGrey2,
        borderRadius: 6
    },
    title: {
        color: colors.black,
        height: 15,
        backgroundColor: '#e0e0e0',
        width: '80%',
        marginBottom: 1,
    }
});
