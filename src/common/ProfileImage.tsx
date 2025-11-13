import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Fragment } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../const/Colors';
import Loader from './Loader';

const WIDTH = Dimensions.get('window').width;

interface CustomProfileProps {
    url: string;
    onPress: () => void; // Function to handle button click
    isLoading: boolean; // Pass the loading state from parent
}

const ProfileImage = ({ url, onPress, isLoading }: CustomProfileProps): React.JSX.Element => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.mainView}>
            {/* <Loader loading={isLoading} /> */}
            <Image source={{ uri: url ? url : "https://i.pinimg.com/280x280_RS/79/dd/11/79dd11a9452a92a1accceec38a45e16a.jpg" }} style={styles.profileImg} />
            {isLoading && <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 5 }}>Loading...</Text>}
            <Feather name='camera' color={colors.greenCustom} size={30} style={styles.iconStyle} />
        </TouchableOpacity>
    )
}

export default ProfileImage

const styles = StyleSheet.create({
    mainView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
    profileImg: {
        width: WIDTH / 3.5,
        height: WIDTH / 3.5,
        borderRadius: WIDTH / 6,
        resizeMode: 'contain',
        marginLeft: 10,
    },
    iconStyle: {
        position: 'absolute',
        right: 5,
        bottom: 10,
    }
})