import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../const/Colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Community = (): React.JSX.Element => {
    return (
        <View style={styles.mainView}>
            <Text style={styles.title}>Our community of doctors and patients drive us to create technologies for the better and offordable heathcare</Text>
            <View style={styles.cardViewsFlex}>
                <View style={styles.cardView}>
                    <Ionicons name={"people"} size={30} color={colors.black} />
                    <Text style={styles.title}>Our Users</Text>
                    <Text style={styles.header}>1 Million</Text>
                </View>
                <View style={styles.cardView}>
                    <FontAwesome6 name={"user-doctor"} size={30} color={colors.black} />
                    <Text style={styles.title}>Our Doctors</Text>
                    <Text style={styles.header}>1 Million</Text>
                </View>
                <View style={styles.cardView}>
                    <MaterialCommunityIcons name={"hospital-building"} size={30} color={colors.black} />
                    <Text style={styles.title}>Hospital</Text>
                    <Text style={styles.header}>1 Million</Text>
                </View>
                <View style={styles.cardView}>
                    <MaterialIcons name={"chat"} size={30} color={colors.black} />
                    <Text style={styles.title}>Patient Stories</Text>
                    <Text style={styles.header}>1 Million</Text>
                </View>
            </View>
        </View>
    )
}

export default Community

const styles = StyleSheet.create({
    mainView: {
        width: '100%',
        backgroundColor: colors.lightGrey,
        paddingHorizontal: '5%',
        marginTop: 10,
        paddingVertical: 10
    },
    title: {
        fontSize: 16,
        fontWeight: 400,
        color: colors.black,
        // marginVertical: 10
    },
    header: {
        fontSize: 24,
        fontWeight: 600,
        color: colors.black,
    },
    cardViewsFlex: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    cardView: {
        width: '50%',
        marginVertical: 10
    }
})