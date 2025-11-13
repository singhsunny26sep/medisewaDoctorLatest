import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View ,Image} from 'react-native';
import React from 'react';
import { colors } from '../const/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BestOFFers from '../components/BestOFFers';
import FeatureServices from '../components/FeatureServices';
import AboutUs from '../components/AboutUs';
import Community from '../components/Community';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { NavigationString } from '../const/NavigationString';

const Home = (): React.JSX.Element => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const Dashboarddata = [
        {
            id: 1,
            totalAppointment: 20,
            Img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1dT50wLNs0nzkX8m-0ktWt34o_MPN34oP5A&s",
            type: 'appointment',
        },
        {
            id: 2,
            totalPatient: 23,
            Img: "https://static.vecteezy.com/system/resources/thumbnails/002/072/163/small/doctor-injecting-coronavirus-vaccine-to-a-patient-concept-free-vector.jpg",
            type: 'patient',
        },
        
    ];

    const handleCardPress = (item: { type: string, totalAppointment?: number, totalPatient?: number, Img: string }) => {
        if (item.type === 'appointment') {
            navigation.navigate('AllAppoinment', { appointments: item.totalAppointment, image: item.Img });
        } else if (item.type === 'patient') {
            navigation.navigate('AllPatients', { patients: item.totalPatient, image: item.Img });
        }
    };
    
    return (
        <ScrollView>
            <View style={styles.mainView}>
                <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />

                <View style={styles.dashboardRow}>
                    {Dashboarddata.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.card} onPress={() => handleCardPress(item)}>
                            <View style={styles.cardContent}>
                                <View style={styles.imageContainer}>
                                    <Image src={item.Img} style={styles.cardImage} resizeMode='contain'/>
                                </View>
                                <Text style={styles.cardTitle}>
                                    {item.totalAppointment ? `Appointments: ${item.totalAppointment}` : `Patients: ${item.totalPatient}`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Best Offers */}
                <BestOFFers />

                {/* Community */}
                <Community />

                {/* About Us */}
                <AboutUs />
            </View>
        </ScrollView>
    );
};

export default Home;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colors.white,
    },
    dashboardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: 10,
    },
    card: {
        flex: 0.48,
        backgroundColor: colors.white,
        borderRadius: 10,
        elevation: 5, // Shadow for elevation
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        padding: 15,
        marginBottom: 15,
    },
    cardContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop:10,
        color:colors.greenCustom
    },
    imageContainer: {
        width: '100%',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
});
