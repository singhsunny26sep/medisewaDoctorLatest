import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../const/Colors'
import { imgPath } from '../assets/img'
import { useNavigation } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign';

const ChooseRole = (): React.JSX.Element => {
    const navigation = useNavigation<any>()
    const [role, setRole] = useState<string>('')

    const handleRoleChange = (role: string) => {
        setRole(role)
        console.log("role: ", role);

        navigation.navigate('Login', { role: role })
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />
            <View style={styles.mainView}>
                <Text style={{ fontSize: 20, marginBottom: 15, fontWeight: 'bold' }}>Choose Account Type</Text>

                <TouchableOpacity style={[styles.cardView, { borderWidth: role == 'center' ? 1 : 0, borderColor: role == 'center' ? colors.greenCustom : '' }]} onPress={() => handleRoleChange('center')}>
                    <Image source={require('../assets/img/logo.png')} style={{ width: '100%', height: '80%', resizeMode: 'contain' }} />

                    <Text style={styles.titleText}>CENTER</Text>

                    {role == 'center' && <AntDesign name="checkcircle" size={16} style={styles.icon} />}
                </TouchableOpacity>

                <TouchableOpacity style={[styles.cardView, { marginTop: 20, borderWidth: role == 'student' ? 1 : 0, borderColor: role == 'student' ? colors.greenCustom : '' }]} onPress={() => handleRoleChange('student')}>
                    <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/4196/4196591.png" }} style={{ width: '100%', height: '80%', resizeMode: 'contain' }} />

                    <Text style={styles.titleText}>STUDENT</Text>
                    {role == 'student' && <AntDesign name="checkcircle" size={16} style={styles.icon} />}
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default ChooseRole

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '20%',
    },
    cardView: {
        width: '100%',
        height: '30%',
        backgroundColor: colors.white,
        elevation: 3,
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconView: {
        width: '100%',
        height: '50%',
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentView: {
        width: '100%',
        height: '50%',
        backgroundColor: colors.greenCustom,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        color: colors.black,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    icon: {
        position: 'absolute',
        right: 10,
        top: 10,
        color: colors.greenCustom
    }
})