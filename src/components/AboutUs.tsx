import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../const/Colors'
import AntDesign from 'react-native-vector-icons/AntDesign';

const AboutUs = (): React.JSX.Element => {
    return (
        <View style={styles.mainView}>
            <Text style={styles.header}>New Medihub Doctor</Text>
            <Text style={styles.title}>Our vision is to help mankind live healthier, longer lives by making qulity healthcare accessible, affordable and convenient. </Text>
            <Text style={styles.copyRight}>Made with <AntDesign name={"heart"} size={22} color={colors.white} /> in Jamshedpur</Text>
        </View>
    )
}

export default AboutUs

const styles = StyleSheet.create({
    mainView: {
        width: '100%',
        backgroundColor: colors.greenCustom,
        paddingTop: 10,
        paddingHorizontal: '5%'
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.white,
    },
    title: {
        fontSize: 18,
        color: colors.white,
        marginBottom: 20,
    },
    copyRight: {
        fontSize: 12,
        color: colors.white,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
        lineHeight: 20,
    }
})