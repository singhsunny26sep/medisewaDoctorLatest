import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import {colors} from '../const/Colors';
import useBooking from '../hook/useBooking';
import AppointmentView from '../components/AppointmentView';

export default function AllAppoinment() {
  const { getBookingByDoctorId } = useBooking();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getBookingByDoctorId();
        setAppointments(Array.isArray(response?.result) ? response.result : []);
      } catch (error) {
        console.error('Error fetching appointments: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const renderAppointmentItem = ({item}) => (
    <AppointmentView item={item} type="history" />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => (item?._id || item?.id || Math.random()).toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
});
