import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import {colors} from '../const/Colors';
import useUser from '../hook/useUser';
import PatientAppointmentView from '../components/PatientAppointmentView';

export default function AllPatients() {
  const { getAllPatients } = useUser();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getAllPatients();
        setPatients(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching patients: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const renderPatientItem = ({item}) => (
    <PatientAppointmentView item={item} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={patients}
        renderItem={renderPatientItem}
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
