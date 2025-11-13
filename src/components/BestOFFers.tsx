import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { colors } from '../const/Colors';
import Carousel from 'react-native-reanimated-carousel';

const WIDTH = Dimensions.get('window').width;

const BestOFFers = (): React.JSX.Element => {
    const offers = [
        { image: require('../assets/img/doctors-lp2.png'), text: 'Fitness' },
        { image: require('../assets/img/doctorDiscount3.jpg'), text: 'Fitness' },
        { image: require('../assets/img/doctorDiscount2.jpg'), text: 'Diet' },
        { image: require('../assets/img/doctorDiscount.jpg'), text: 'Meditation' },
    ];

    return (
        <View style={styles.mainView}>
            {/* Header Section */}
            <View style={styles.haederView}>
                <View style={styles.iconView}>
                    <MaterialCommunityIcons name="brightness-percent" size={25} color={colors.black} />
                </View>
                <View style={{ width: '80%', paddingLeft: 5 }}>
                    <Text style={styles.headerText}>Best Offers</Text>
                    <Text style={styles.titleText}>Explore deals, offers, health updates and more</Text>
                </View>
            </View>

            {/* Carousel Section */}
            <View style={styles.carouselView}>
                <Carousel
                    loop
                    width={WIDTH / 1.11}
                    height={200}
                    autoPlay
                    autoPlayInterval={3000} // Adjusted interval
                    data={offers}
                    renderItem={({ item }) => (
                        <Image source={item.image} style={styles.imgView} />
                    )}
                />
            </View>

            {/* Another Header Section */}
            <View style={styles.haederView}>
                <View style={styles.iconView}>
                    <FontAwesome6 name="helmet-safety" size={25} color={colors.black} />
                </View>
                <View style={{ width: '80%', paddingLeft: 5 }}>
                    <Text style={styles.headerText}>Safe and Secure Surgeries</Text>
                    <Text style={styles.titleText}>Get your first consultation FREE</Text>
                </View>
            </View>

            {/* Carousel Section */}
            <View style={styles.carouselView}>
                <Carousel
                    loop
                    width={WIDTH / 1.11}
                    height={200}
                    autoPlay
                    autoPlayInterval={3000} // Adjusted interval
                    data={offers}
                    renderItem={({ item }) => (
                        <Image source={item.image} style={styles.imgView} />
                    )}
                />
            </View>
        </View>
    );
};

export default BestOFFers;

const styles = StyleSheet.create({
    mainView: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: colors.lightGreen,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    haederView: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 20
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.black,
    },
    iconView: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        marginTop: 10,
        fontSize: 16,
        color: colors.black,
    },
    carouselView: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        borderRadius: 8,
        marginLeft:8

    },
    imgView: {
        width: '95%',
        height: '100%',
        borderRadius: 8,
        resizeMode: 'cover',
    },
});
