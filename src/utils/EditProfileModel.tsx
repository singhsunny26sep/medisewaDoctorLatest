import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../const/Colors'
import CustomInput from './CustomInput'
import CustomButton from './CustomButton'
import Icon from 'react-native-vector-icons/AntDesign'
import useUser from '../hook/useUser'
import { useLogin } from '../context/LoginProvider'
import Loader from '../common/Loader'

let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const EditProfileModel = ({ visible, setVisible, title, setLoading, loading }: any) => {
    const { refresh, setRefresh } = useLogin()
    const [updateLoading, setUpdateLoading] = useState<boolean>(true)
    const { getUserProfile, updateProfile } = useUser()
    const [name, setName] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [mobile, setMobile] = useState<string>()
    const [address, setAddress] = useState<string>()
    const [error, setError] = useState<string>()

    const [valName, setValName] = useState<string>()
    const [valMobile, setValMobile] = useState<string>()
    const [valEmail, setValEmail] = useState<string>()
    const [valAddress, setValAddress] = useState<string>()

    const getUserDetails = async () => {
        const user = await getUserProfile()
        setName(user?.name)
        setEmail(user?.email)
        setMobile(user?.mobile)
        setAddress(user?.address)
        setUpdateLoading(false)
    }


    useEffect(() => {
        getUserDetails()
    }, [visible, updateLoading])

    const handleSubmit = async () => {
        console.log("clicked");

        if (!name) {
            console.log("name");

            setValName("Name is required")
            return
        }
        if (!mobile) {
            console.log("mobile");
            setValMobile("Mobile number is required")
            return
        }
        if (mobile.toString().length < 10) {
            console.log("mobile lent");
            setValMobile("Enter a valid 10 digit mobile number")
            return
        }
        if (!email) {
            console.log("email");
            setValEmail("Email is required")
            return
        }
        if (!email.match(regex)) {
            console.log("email valid");
            setValEmail("Enter a valid email address")
            return
        }
        if (!address) {
            console.log("address");
            setValAddress("Address is required")
            return
        }
        setUpdateLoading(true)
        setLoading(true)
        // let user = { email, address, mobile, name }
        await updateProfile(name, email, address, mobile)
        // console.log("result: ", result);
        setRefresh(!refresh)
        setLoading(false)
        setVisible(false)
        setUpdateLoading(false)
    }
    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={() => setVisible(false)}>
            <View style={styles.modalBackground}>
                {/* <Loader loading={updateLoading} /> */}
                <View style={styles.modalContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <Icon name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '100%' }}>
                        <CustomInput label="Name" value={name} placeholder="Enter your name" onChangeText={(e: string) => { setName(e); setValName("") }} error={valName ? true : false} errorMessage={valName} autoCapitalize='words' />
                        <CustomInput label="Email" value={email} placeholder="Enter your email" onChangeText={(e: string) => { setEmail(e); setValEmail("") }} error={valEmail ? true : false} errorMessage={valEmail} autoCapitalize='none' keyboardType='email-address' />
                        <CustomInput label="Mobile" value={mobile} placeholder="Enter your mobile" keyboardType='numeric' onChangeText={(e: string) => { setMobile(e); setValMobile("") }} error={valMobile ? true : false} errorMessage={valMobile} maxLength={10} />
                        <CustomInput label="Address" value={address} placeholder="Enter your address" onChangeText={(e: string) => { setAddress(e); setValAddress("") }} error={valAddress ? true : false} errorMessage={valAddress} autoCapitalize='words' />


                    </View>
                    <View style={{ marginTop: 10 }}>
                        <CustomButton icon={null} isLoading={updateLoading} onPress={handleSubmit} title={'Submit'} backgroundColor={colors.greenCustom} textColor={colors.white} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default EditProfileModel

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.black,
        textAlign: "center"
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '90%'
    },
})