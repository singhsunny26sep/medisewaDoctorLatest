import { View, Text, Image, StyleSheet, ImageBackground, StatusBar } from 'react-native'
import React, { useState } from 'react'
import showToast from '../utils/ShowToast'
import CustomInput from '../utils/CustomInput'
import CustomButton from '../utils/CustomButton'
import axios from 'axios'
import { useLogin } from '../context/LoginProvider'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiCall } from '../const/api'
import { colors } from '../const/Colors'
import { NavigationString } from '../const/NavigationString'

const Login = ({ navigation, route }: any): React.JSX.Element => {
    const { setIsLoggedIn } = useLogin()
    const [username, setUsername] = useState<string | any>()
    const [password, setPassword] = useState<string | any>()


    const [usernameVal, setUsernameVal] = useState<string | any>()
    const [passwordVal, setPasswordVal] = useState<string | any>()

    const [isLoading, setIsLoading] = useState<boolean>(false)


    const handleSubmit = async () => {
        if (!username) {
            setUsernameVal("Email is required")
            return
        }
        if (!password) {
            setPasswordVal("Password is required")
            return
        }
        setIsLoading(true)
        return await axios.post(`${apiCall.mainUrl}/users/login`, { email: username, password: password }).then(async (response) => {
            // console.log("response: ", response?.data);
            console.log('Login Token:', response.data.token);

            setIsLoggedIn(true)
            await AsyncStorage.setItem('token', response.data.token);
            showToast(response?.data?.msg || "Login Successfully")
            // Keep loading briefly and navigate to Profile screen inside Drawer
            setTimeout(() => {
                try {
                    navigation.navigate(NavigationString.Drawer, { screen: NavigationString.Profile })
                } catch (e) {
                    // fallback: try direct navigation to Profile
                    navigation.navigate(NavigationString.Profile)
                } finally {
                    setIsLoading(false)
                }
            }, 600)
        }).catch((error: any) => {
            console.log("error on handleSubmit: ", error);
            console.log("error: ", error?.response);
            setIsLoading(false)
            showToast(error?.response?.data?.msg || "Error login. Please try again later.")
        })
    }
    
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />
            <View style={{ width: '100%', height: '50%', paddingHorizontal: 2, paddingTop: 5 }}>
                <ImageBackground source={require('../assets/img/login.png')} style={styles.img} ></ImageBackground>
            </View>
            <View>
                <Text style={styles.headerText}>Login</Text>

                <View style={{ marginHorizontal: '5%' }}>

                    <View>
                        <CustomInput label="Email" value={username} autoCapitalize='none' keyboardType='email-address' placeholder="Enter your email..." onChangeText={(e: string) => { setUsername(e); setUsernameVal("") }} error={usernameVal ? true : false} errorMessage={usernameVal} />
                    </View>

                    <View>
                        <CustomInput label="Password" value={password} placeholder="Enter your password" onChangeText={(e) => { setPassword(e); setPasswordVal("") }} isPassword={true} error={passwordVal ? true : false} errorMessage={passwordVal} />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>


                        <CustomButton icon={null} title="Register" onPress={() => navigation.navigate(NavigationString.Register)} isLoading={false} backgroundColor={colors.greenCustom} textColor={colors.white} />
                        <CustomButton icon={null} title="Forgot Password?" onPress={() => navigation.navigate(NavigationString.ForgotPassword)} isLoading={false} backgroundColor={colors.yellow} textColor={colors.black} />

                    </View>

                    <View style={{ marginTop: 10 }}>
                        <CustomButton icon={null} title="Login" onPress={handleSubmit} isLoading={isLoading} backgroundColor={colors.greenCustom} textColor={colors.white} />
                        {/* <CustomButton title="Login" onPress={handleNavigation} isLoading={isLoading} backgroundColor={colors.greenCustom} textColor={colors.white} /> */}
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    img: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        // justifyContent: 'center',
        alignItems: 'center',
        // margin: '5%',
    },
    headerText: {
        color: colors.greenCustom,
        fontSize: 20,
        fontWeight: 'bold',
        // backgroundColor: 'rgba(0,0,0,0.5)',
        // padding: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginHorizontal: '5%'
    },
})