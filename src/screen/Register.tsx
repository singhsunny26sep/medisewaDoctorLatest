import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CustomInput from '../utils/CustomInput';
import CustomButton from '../utils/CustomButton';
import showToast from '../utils/ShowToast';
import axios from 'axios';
import { apiCall } from '../const/api';
import { NavigationString } from '../const/NavigationString';
import { colors } from '../const/Colors';
import { getFcmToken } from '../utils/FcmTokenUtils';

let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const Register = ({ navigation, route }: any): React.JSX.Element => {
    const [name, setName] = useState<string>()
    const [mobile, setMobile] = useState<number | any>()
    const [email, setEmail] = useState<string>()
    const [address, setAddress] = useState<string>()
    const [password, setPassword] = useState<string | any>()
    const [conPass, setConPass] = useState<string>()

    const [valName, setValName] = useState<string>()
    const [valMobile, setValMobile] = useState<string>()
    const [valEmail, setValEmail] = useState<string>()
    const [valAddress, setValAddress] = useState<string>()
    const [valConPass, setValConPass] = useState<string>()
    const [passwordVal, setPasswordVal] = useState<string | any>()
    const [valPassword, setValPassword] = useState<string | any>()

    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async () => {
        if (!name) {
            setValName("Name is required")
            return
        }
        if (!mobile) {
            setValMobile("Mobile number is required")
            return
        }
        if (mobile.toString().length < 10) {
            setValMobile("Enter a valid 10 digit mobile number")
            return
        }
        if (!email) {
            setValEmail("Email is required")
            return
        }
        if (!email.match(regex)) {
            setValEmail("Enter a valid email address")
            return
        }
        if (!address) {
            setValAddress("Address is required")
            return
        }
        if (!password) {
            setValPassword("Password is required")
            return
        }
        if (!conPass) {
            setValConPass("Confirm Password is required")
            return
        }
        if (password !== conPass) {
            setValConPass("Passwords do not match")
            return
        }
        setIsLoading(true)
        
        // Get FCM token
        const fcmToken = await getFcmToken();
        console.log('📱 FCM Token for Register:', fcmToken);
        
        return await axios.post(`${apiCall.mainUrl}/users/register`, { 
            name: name, 
            email: email, 
            password: password, 
            mobile: mobile, 
            address: address, 
            role: "patient",
            fcmToken: fcmToken 
        }).then((response: any) => {
            // console.log("response: ", response?.data);
            console.log('✅ Register successful');
            console.log('📱 FCM Token sent in register request:', fcmToken);
            setIsLoading(false)
            navigation.navigate(NavigationString.Login)
            showToast(response?.data?.msg || "Register Successfull")
        }).catch((error: any) => {
            setIsLoading(false)
            console.log("❌ Error: ", error)
            showToast(error?.response?.data?.msg || "Error registering. Please try again later.")
        })
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />
            {/* <View style={styles.headerView}>
                <TouchableOpacity >
                    <Icon name="arrow-back" size={20} color={colors.white} />
                </TouchableOpacity>
            </View> */}

            {/* <Text style={styles.headerText}>{role == 'center' ? "Center Register" : "Student Register"}</Text> */}
            <Text style={styles.headerText}>Register</Text>

            <View style={{ marginHorizontal: '5%' }}>
                <View>
                    <CustomInput label="Name" value={name} placeholder="Enter your name" onChangeText={(e: string) => { setName(e); setValName("") }} error={valName ? true : false} errorMessage={valName} autoCapitalize='words' />
                </View>

                <View>
                    <CustomInput label="Mobile" value={mobile} placeholder="Enter your mobile" keyboardType='numeric' onChangeText={(e: string) => { setMobile(e); setValMobile("") }} error={valMobile ? true : false} errorMessage={valMobile} maxLength={10} />
                </View>

                <View>
                    <CustomInput label="Email" value={email} placeholder="Enter your email" onChangeText={(e: string) => { setEmail(e); setValEmail("") }} error={valEmail ? true : false} errorMessage={valEmail} autoCapitalize='none' keyboardType='email-address' />
                </View>

                <View>
                    <CustomInput label="Address" value={address} placeholder="Enter your address" onChangeText={(e: string) => { setAddress(e); setValAddress("") }} error={valAddress ? true : false} errorMessage={valAddress} autoCapitalize='words' />
                    {/* <CustomDropdown label="Select Program" data={schools} selectedValue={selection} onSelect={handleSchoolSelect} valSchool={valSchool} /> */}
                </View>

                <View>
                    <CustomInput label="Password" value={password} placeholder="Enter your password" onChangeText={(e) => { setPassword(e); setPasswordVal("") }} isPassword={true} error={passwordVal ? true : false} errorMessage={passwordVal} />
                </View>

                <View>
                    <CustomInput label="Confirm Password" value={conPass} placeholder="Enter your confirm password" onChangeText={(e) => { setConPass(e); setValConPass("") }} isPassword={true} error={valConPass ? true : false} errorMessage={valConPass} />
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginHorizontal: '5%' }}>

                <CustomButton icon={null} title="Back To Login" onPress={() => navigation.navigate(NavigationString.Login)} isLoading={false} backgroundColor={colors.greenCustom} textColor={colors.white} />

                {/* <CustomButton title="Forgot Password?" onPress={() => console.log("Forgot password clicked")} isLoading={false} backgroundColor={colors.yellow} textColor={colors.black} /> */}
                <CustomButton icon={null} title="Register" onPress={handleSubmit} isLoading={isLoading} backgroundColor={colors.greenCustom} textColor={colors.white} />

            </View>
        </View>
    )
}

export default Register

const styles = StyleSheet.create({
    headerView: {
        // backgroundColor: colors.greenCustom,

        // height: 150,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    headerText: {
        marginTop: '5%',
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