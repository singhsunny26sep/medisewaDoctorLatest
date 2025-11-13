import { Image, ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Modal, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { colors, HEIGHT } from '../const/Colors'
import useDoctor from '../hook/useDoctor'
import { useNavigation, useRoute } from '@react-navigation/native'
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Calendar } from 'react-native-calendars'
import moment from 'moment'
import useBooking from '../hook/useBooking'
import TimeFormate from '../utils/TimeFormate'
import showToast from '../utils/ShowToast'
import CustomButton from '../utils/CustomButton'
import AppointmentSkeletonLoader from '../common/AppointmentSkeletonLoader'
import AppointmentView from '../components/AppointmentView'
import useCart from '../hook/useCart'

const DoctorDetails = (): React.JSX.Element => {
    const route = useRoute()
    const { id }: any = route?.params //doctor user id
    const navigation = useNavigation()

    const [doctor, setDoctor] = useState<any>()
    const { getSingleDoctor } = useDoctor()
    const { getDoctorBookings, addBooking, getBookingHistorybyDoctorId } = useBooking()
    const { addCartDoctor } = useCart()

    const [loading, setLoading] = useState<boolean>(true)
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'))
    const [bookings, setBookings] = useState<any>([])

    const [cart, setCart] = useState<any>()
    const [history, setHistory] = useState<any>([])
    const [hostiryLoading, setHistoryLoading] = useState<boolean>(true)
    const [refreshing, setRefreshing] = useState<boolean>(false)

    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [isBookingModalVisible, setBookingModalVisible] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false)
    const [timeLoading, setTimeLoading] = useState<boolean>(true)
    const [cartLoading, setCartLoading] = useState<boolean>(false)

    const skeletonArray = Array(4).fill(null);

    const getSingleDoctors = async () => {
        getSingleDoctor(id).then((response) => {
            setDoctor(response?.result)
            setCart(response?.cart)
            setLoading(false)
        }).catch((error: any) => {
            console.log('Error fetching doctor', error)
            setLoading(false)
        })
    }

    const getBookingHostory = async () => {
        const history = await getBookingHistorybyDoctorId(null, id)
        setHistory(history?.result)
        setHistoryLoading(false)
    }

    const fetchDoctorBookings = async (date: string) => {
        setTimeLoading(true)
        try {
            const response = await getDoctorBookings(id, date);
            setBookings(response?.slots);
            setTimeLoading(false)
        } catch (error) {
            setTimeLoading(false)
            console.log('Error fetching bookings:', error);
        }
    };

    useEffect(() => {
        getSingleDoctors()
        fetchDoctorBookings(selectedDate)
    }, [selectedDate, cartLoading])

    useEffect(() => {
        getBookingHostory()
    }, [hostiryLoading])

    const handleSlotSelection = (slot: any) => {
        setSelectedSlot(slot);
        setBookingModalVisible(true);
    };

    const onRefresh = useCallback(async () => {
        getBookingHostory();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000)
    }, [loading]);

    const confirmBooking = async () => {
        if (!doctor || !selectedSlot) return;

        const bookingData = {
            doctorId: doctor?.doctorId?._id,
            appointmentDate: selectedDate,
            appointmentTime: selectedSlot?.time,
            consultationFee: doctor?.doctorId?.fee || 0,
            serviceCharge: doctor?.doctorId?.serviceCharge || 0,
        };
        setSubmitLoading(true)
        try {
            await addBooking(bookingData, null);
            setBookingModalVisible(false);
            fetchDoctorBookings(selectedDate);
            setSubmitLoading(false)
        } catch (error) {
            setSubmitLoading(false)
            console.log("Booking error:", error);
            showToast("Something went wrong. Please try again.");
        }
    };

    const handleAddToCart = async () => {
        setCartLoading(true);
        await addCartDoctor(doctor?.doctorId?._id)
        setCartLoading(false);
    }

    return (
        <>
            <View style={{ width: '100%', backgroundColor: colors.greenCustom, elevation: 6, height: 70, position: 'absolute', zIndex: 5, top: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                <View style={{ flexDirection: 'row', height: 70, marginHorizontal: '4%', alignItems: 'center' }}>
                    <TouchableOpacity style={{ width: 35, height: 35, alignItems: 'center' }} onPress={() => navigation.goBack()}>
                        <Feather name='arrow-left' size={28} color={colors.white} />
                    </TouchableOpacity>

                    <Text style={{ color: colors.white, fontSize: 22, fontWeight: '600', marginLeft: 15, marginTop: -7 }}>Doctor Details</Text>

                    <TouchableOpacity onPress={handleAddToCart} style={{ position: 'absolute', right: 15, width: 45, height: 45, alignItems: 'center', justifyContent: 'center' }} >
                        {cart ? <FontAwesome name='star' size={28} color={colors.white} /> : <FontAwesome name='star-o' size={28} color={colors.white} />}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ marginTop: 70, paddingHorizontal: '5%' }}>
                <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />
                <View style={styles.imgView}>
                    <Image source={{ uri: doctor?.doctorId?.image }} style={styles.imgStyle} />
                    <View style={styles.doctorBasicDetails}>
                    <View style={styles.contentView}>
                        <Text style={styles.title}>{doctor?.doctorId?.name}</Text>
                        <Text style={styles.subtitle}>{doctor?.doctorId?.clinicAddress}</Text>
                        <Text style={styles.subtitle}>{doctor?.doctorId?.clinicContactNumber}</Text>
                    </View>
                    <View style={styles.contentView}>
                        <Text style={[styles.subtitle, { textAlign: 'right' }]}>{doctor?.doctorId?.department?.name}</Text>
                        <Text style={[styles.subtitle, { textAlign: 'right' }]}>{doctor?.doctorId?.specialization?.name}</Text>
                        <Text style={[styles.subtitle, { textAlign: 'right' }]}>{doctor?.doctorId?.experience} years</Text>
                    </View>
                </View>
                </View>

               

                <View style={styles.calendarContainer}>
                    <Text style={styles.sectionTitle}>Select a Date</Text>
                    <Calendar
                        onDayPress={(day: any) => setSelectedDate(day.dateString)}
                        markedDates={{ [selectedDate]: { selected: true, selectedColor: colors.greenCustom } }}
                        minDate={moment().format('YYYY-MM-DD')}
                    />
                    <Text style={styles.noteText}>
                        Note:- Book before Time: {doctor?.doctorId?.bookingBeforeTime ? `${doctor?.doctorId?.bookingBeforeTime}:00 H before of ${TimeFormate(doctor?.doctorId?.endTime)}` : `${TimeFormate(doctor?.doctorId?.endTime)}`}
                    </Text>

                    <View style={styles.timeSlotsContainer}>
                        <Text style={styles.sectionTitle}>Available Slots</Text>
                        {timeLoading ? (
                            <ActivityIndicator size="large" color={colors.greenCustom} />
                        ) : (
                            <View style={styles.timeSlots}>
                                {bookings?.map((item: any, ind: number) => (
                                    <TouchableOpacity
                                        key={ind}
                                        style={[styles.slot, item?.isBooked ? styles.bookedSlot : styles.availableSlot]}
                                        disabled={item?.isBooked}
                                        onPress={() => handleSlotSelection(item)}
                                    >
                                        <Text style={styles.slotText}>{TimeFormate(item?.time)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>Booking History</Text>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={hostiryLoading ? skeletonArray : history}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                            hostiryLoading ? (
                                <AppointmentSkeletonLoader isLoading={hostiryLoading} />
                            ) : (
                                <AppointmentView item={item} key={index} type={"history"} />
                            )
                        }
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                </View>

                {/* Booking Modal */}
                <Modal visible={isBookingModalVisible} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Confirm Booking</Text>
                            <Text>Doctor: {doctor?.doctorId?.name}</Text>
                            <Text>Date: {selectedDate}</Text>
                            <Text>Time: {TimeFormate(selectedSlot?.time)}</Text>
                            <Text>Consultation Fee: ₹{doctor?.doctorId?.fee}</Text>
                            <Text>Service Charge: ₹{doctor?.doctorId?.serviceCharge}</Text>
                            <Text style={styles.totalAmount}>
                                Total: ₹{(doctor?.doctorId?.fee || 0) + (doctor?.doctorId?.serviceCharge || 0)}
                            </Text>

                            <CustomButton title="Submit" onPress={confirmBooking} backgroundColor={colors.greenCustom} textColor={colors.white} isLoading={submitLoading} />
                            <TouchableOpacity onPress={() => setBookingModalVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </>
    )
}

export default DoctorDetails

const styles = StyleSheet.create({
    imgView: {
        // width: '100%',
        // height: HEIGHT / 3,
        backgroundColor: colors.greenCustom,
        borderRadius: 10,
        overflow: 'hidden',
        marginTop:5
    },
    imgStyle: {
        height: 200,
        width: 200,
        resizeMode: 'cover',
        alignSelf:"center",
        marginTop:5
    },
    doctorBasicDetails: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: '5%',
        borderRadius: 8,
        marginTop: 5,
    },
    contentView: {
        width: '50%',
    },
    title: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        color: colors.white,
        fontSize: 14,
        marginVertical: 5,
    },
    calendarContainer: {
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    noteText: {
        color: colors.red,
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
    timeSlotsContainer: {
        marginTop: 20,
    },
    timeSlots: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    slot: {
        padding: 12,
        margin: 8,
        borderRadius: 10,
        width: 85,
        justifyContent: 'center',
        alignItems: 'center',
    },
    availableSlot: {
        backgroundColor: colors.greenCustom,
    },
    bookedSlot: {
        backgroundColor: 'gray',
    },
    slotText: {
        color: 'white',
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        width: 320,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    cancelText: {
        marginTop: 15,
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
    historyContainer: {
        marginTop: 30,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        marginVertical: 10,
    },
});
