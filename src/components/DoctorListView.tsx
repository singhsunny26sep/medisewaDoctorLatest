// import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React, { useState } from 'react'
// import Divider from '../common/Divider';
// import { colors, WIDTH } from '../const/Colors';
// import CustomButton from '../utils/CustomButton';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { NavigationString } from '../const/NavigationString';
// import { ParamListBase, useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
// import showToast from '../utils/ShowToast';
// import useCart from '../hook/useCart';



// const DoctorListView = ({ item, type, refreshing, setRefreshing }: any): React.JSX.Element => {
//     const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
//     const { removeCartDoctor } = useCart()


//     const [callLoading, setCallLoading] = useState<boolean>(false);
//     // console.log("item: ", item);

//     const handleCall = (phoneNumber: number) => {
//         const url = `tel:${phoneNumber}`;
//         setCallLoading(true)
//         Linking.canOpenURL(url).then((supported) => {
//             if (supported) {
//                 setCallLoading(false)
//                 Linking.openURL(url);
//             } else {
//                 showToast('Calling is not supported on this device.');
//                 setCallLoading(false)
//             }
//         }).catch((err) => {
//             setCallLoading(false)
//             console.log(err)
//         });
//     };

//     /* const handleShare = () => {
//         const message = `Hello, I found this doctor on Medisewa app. Visit https://medisewa.com/doctor/${item?._id} to know more about him/her.`;
//         Linking.share({ message });
//     }; */

//     const handlRemoveCart = async () => {
//         /* awati removeCartDoctor(item?._id).then((resopnse) =>{

//         }).catch((error) =>{

//         }) */
//         await removeCartDoctor(item?._id)
//         setRefreshing(!refreshing)
//     }


//     return (
//         <TouchableOpacity style={{ flex: 1, elevation: 1, backgroundColor: colors.white, marginVertical: 3, }} onPress={() => navigation.navigate(NavigationString.DoctorDetails, { id: type == 'cart' ? item?.doctorId?.userId : item?.userId })}>
//             {/* <TouchableOpacity style={{ flex: 1, elevation: 1, backgroundColor: colors.white, marginVertical: 3, }} onPress={() => navigation.navigate(NavigationString.DoctorDetails, { id: type == 'cart' ? item?.doctorId?.userId : item?._id })}> */}
//             <TouchableOpacity style={styles.removeCart} onPress={handlRemoveCart} >
//                 <MaterialCommunityIcons name='cart-remove' size={25} color={colors.red} />
//             </TouchableOpacity>
//             <Text>{type}</Text>
//             <View style={styles.profileView}>
//                 <View style={styles.avatarView}>
//                     {/* avatar */}
//                     <Image source={{ uri: type == 'cart' ? item?.doctorId?.image : item?.image }} style={styles.imgAvatar} />
//                 </View>
//                 <View style={styles.doctorDetailsView}>
//                     <Text style={styles.nameText}>{type == 'cart' ? item?.doctorId?.name : item?.name}</Text>
//                     <Text style={styles.nameText}>{type == 'cart' ? item?.doctorId?.department?.name : item?.department?.name}</Text>
//                     <Text style={styles.nameText}>{type == 'cart' ? item?.doctorId?.specialization?.name : item?.specialization?.name}</Text>
//                     <Text style={styles.title}>{type == 'cart' ? item?.doctorId?.experience : item?.experience} Years of Expreience</Text>
//                     {/* doctor name */}
//                     {/* doctor categor */}
//                     {/* doctor speciligention */}
//                     {/* doctor sperience */}
//                     {/* feature patient review and stories or like in % */}
//                 </View>
//             </View>
//             {/* divider */}
//             <Divider />

//             <View style={styles.clinicDetailsView}>
//                 <View style={{ width: '50%' }}>
//                     <Text style={styles.title}>{type == 'cart' ? item?.doctorId?.address : item?.address}</Text>
//                     <Text style={styles.title}>{type == 'cart' ? item?.doctorId?.clinicContactNumber : item?.clinicContactNumber}</Text>
//                 </View>
//                 <View style={{ width: '50%' }}>
//                     <CustomButton onPress={() => handleCall(type == 'cart' ? item?.doctorId?.clinicContactNumber : item?.clinicContactNumber)} icon={<Ionicons name='call-outline' color={colors.white} size={20} />} title={"Call"} backgroundColor={colors.greenCustom} textColor={colors.white} isLoading={callLoading} />
//                 </View>

//                 {/* clinic name */}
//                 {/* fees */}
//                 {/* contact clinic */}
//             </View>
//         </TouchableOpacity>
//     )
// }

// export default DoctorListView

// const styles = StyleSheet.create({
//     profileView: {
//         width: '100%',
//         flexDirection: 'row',
//     },
//     avatarView: {
//         width: '50%',
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 10
//     },
//     imgAvatar: {
//         width: WIDTH / 3,
//         height: WIDTH / 3,
//         borderRadius: WIDTH / 6,
//         resizeMode: 'cover',
//     },
//     doctorDetailsView: {
//         width: '50%',
//         // alignItems: 'center',
//         justifyContent: 'center',
//     },
//     nameText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: colors.black
//     },
//     categoryText: {
//         fontSize: 16,
//         color: colors.black,
//         textDecorationLine: 'underline',
//     },
//     title: {
//         color: colors.black,
//         fontSize: 16,
//     },
//     clinicDetailsView: {
//         width: '90%',
//         flexDirection: 'row',
//         marginVertical: 10,
//         alignSelf: 'center'
//     },
//     removeCart: {
//         width: 30,
//         height: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'absolute',
//         right: 10,
//         top: 10,
//         zIndex: 5
//     }
// })

import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Divider from '../common/Divider';
import { colors, WIDTH } from '../const/Colors';
import CustomButton from '../utils/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationString } from '../const/NavigationString';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import showToast from '../utils/ShowToast';
import useCart from '../hook/useCart';

const DoctorListView = ({ item, type, refreshing, setRefreshing }: any): React.JSX.Element => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { removeCartDoctor } = useCart();
    
    const [callLoading, setCallLoading] = useState<boolean>(false);

    const handleCall = (phoneNumber: number) => {
        const url = `tel:${phoneNumber}`;
        setCallLoading(true);
        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                setCallLoading(false);
                Linking.openURL(url);
            } else {
                showToast('Calling is not supported on this device.');
                setCallLoading(false);
            }
        }).catch((err) => {
            setCallLoading(false);
            console.log(err);
        });
    };

    const handlRemoveCart = async () => {
        await removeCartDoctor(item?._id);
        setRefreshing(!refreshing);
    };

    return (
        <View 
            style={styles.container} 
            // onPress={() => navigation.navigate(NavigationString.DoctorDetails, { id: type === 'cart' ? item?.doctorId?.userId : item?.userId })}
        >
            
            {/* Remove Cart Button */}
            {/* <TouchableOpacity style={styles.removeCart} onPress={handlRemoveCart}>
                <MaterialCommunityIcons name="cart-remove" size={25} color={colors.red} />
            </TouchableOpacity> */}

            {/* Profile and Doctor Details */}
            <View style={styles.profileView}>
                <View style={styles.avatarView}>
                    <Image 
                        source={{ uri: type === 'cart' ? item?.doctorId?.image : item?.image }} 
                        style={styles.imgAvatar} 
                    />
                </View>
                <View style={styles.doctorDetailsView}>
                    <Text style={styles.nameText}>{type === 'cart' ? item?.doctorId?.name : item?.name}</Text>
                    <Text style={styles.categoryText}>{type === 'cart' ? item?.doctorId?.department?.name : item?.department?.name}dbvks</Text>
                    <Text style={styles.title}>{type === 'cart' ? item?.doctorId?.specialization?.name : item?.specialization?.name}cscac</Text>
                    {/* <Text style={styles.title}>{type === 'cart' ? item?.doctorId?.experience : item?.experience} Years of Experience</Text> */}
                </View>
            </View>

            <Divider />

            {/* Clinic Details */}
            <View style={styles.clinicDetailsView}>
                <View style={{ width: '50%' }}>
                    <Text style={styles.title}>{type === 'cart' ? item?.doctorId?.address : item?.address}</Text>
                    <Text style={styles.title}>{type === 'cart' ? item?.doctorId?.clinicContactNumber : item?.clinicContactNumber}</Text>
                </View>
                <View style={{ width: '50%',top:5 }}>
                    <CustomButton 
                        onPress={() => handleCall(type === 'cart' ? item?.doctorId?.clinicContactNumber : item?.clinicContactNumber)} 
                        icon={<Ionicons name='call-outline' color={colors.white} size={20} />} 
                        title="Call" 
                        backgroundColor={colors.greenCustom} 
                        textColor={colors.white} 
                        isLoading={callLoading} 
                    />
                </View>
            </View>
        </View>
    );
};

export default DoctorListView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        elevation: 3,
        backgroundColor: colors.white,
        marginVertical: 10,
        borderRadius: 10,
        marginHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
    removeCart: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 5,
        backgroundColor: colors.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.red,
    },
    profileView: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    avatarView: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgAvatar: {
        width: WIDTH / 3.5,
        height: WIDTH / 3.5,
        borderRadius: WIDTH / 7,
        resizeMode: 'cover',
    },
    doctorDetailsView: {
        width: '70%',
        justifyContent: 'center',
        marginLeft:10
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.black,
    },
    categoryText: {
        fontSize: 16,
        color: colors.black,
        textDecorationLine: 'underline',
    },
    title: {
        color: colors.black,
        fontSize: 14,
        marginTop: 5,
        fontWeight:"500"
    },
    clinicDetailsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
});
