import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors } from '../const/Colors';

const FeatureServices = (): React.JSX.Element => {
    return (
        <View style={styles.mainView}>
            <View style={styles.haederView}>
                <AntDesign name="staro" size={25} color={colors.greenCustom} />
                <Text style={styles.headerText}>Best Offers</Text>
            </View>
        </View>
    )
}

export default FeatureServices

const styles = StyleSheet.create({
    mainView: {
        width: "90%",
        alignSelf: 'center',
        // backgroundColor: colors.lightGreen
    },
    haederView: {
        width: '100%',
        flexDirection: 'row'
    },
    headerText: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.greenCustom
    }
})