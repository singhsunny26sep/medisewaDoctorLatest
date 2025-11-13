import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { colors } from '../const/Colors'
import useUser from '../hook/useUser'
import { useLogin } from '../context/LoginProvider'
import Loader from '../common/Loader'

interface DrawerContentProps extends DrawerContentComponentProps {
    // Add any additional props specific to your custom drawer content component
}

const CustomDrawer: React.FC<DrawerContentProps> = (props) => {
    const { refresh } = useLogin()
    const [userDetails, setUserDetails] = useState<any>()
    const { getUserProfile } = useUser()
    const [loading, setLoading] = useState<boolean>(true)

    const getUserDetails = async () => {
        const user = await getUserProfile()
        setLoading(false)
        setUserDetails(user)
    }

    useEffect(() => {
        getUserDetails()
    }, [loading, refresh])

    return (
        <View style={{ flex: 1, }}>
            <View style={styles.userSection}>
                <Loader loading={loading} />
                <View style={styles.userView}>
                    <View style={styles.avatarMainView}>
                        <View style={{ width: '40%' }}>
                            <View style={styles.avatarView}>
                                <Image source={{ uri: userDetails?.image || "https://i.pinimg.com/280x280_RS/79/dd/11/79dd11a9452a92a1accceec38a45e16a.jpg" }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                            </View>
                        </View>
                        <View style={{ width: '100%', }}>
                            <View style={{ marginTop: 5 }}>
                                <Text style={styles.title}>{userDetails?.name}</Text>
                                <Text style={styles.title}>{userDetails?.email}</Text>
                                <Text style={styles.title}>{userDetails?.mobile}</Text>
                            </View>
                        </View>
                    </View>
                    {/* <View> */}

                    {/* </View> */}
                    {/* <Text>alsdfjs lsjf dsklf </Text> */}
                </View>
            </View>
            <DrawerContentScrollView {...props} contentContainerStyle={{}}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View >
    )
}

export default CustomDrawer

const styles = StyleSheet.create({
    userSection: {
        height: '22%',
        width: '100%',
        borderTopRightRadius: 12,
        borderBlockColor: colors.lightGreen1,
        borderBottomWidth: 1,
        paddingTop: 10,
        backgroundColor: colors.greenCustom,
        alignItems:"center"

    },
    userView: {
        width: '100%',
        height: '100%',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    avatarView: {
        backgroundColor: 'grey',
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'white',
        elevation: 3,
        overflow: 'hidden',
        alignSelf:"center",
        marginLeft:130
    },
    userTextView: {
        width: '100%',
        paddingTop: 10,
        elevation: 3,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'center',
        borderRadius: 8,
        marginTop: 10
    },
    title: {
        color: colors.white,
        fontSize: 15,
        textAlign:"center",
        marginTop:2
    },
    avatarMainView: {
        width: '100%',
    }
})