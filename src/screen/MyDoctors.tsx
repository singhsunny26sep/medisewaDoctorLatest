import { FlatList, StatusBar, StyleSheet, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { colors } from '../const/Colors'
import AppointmentSkeletonLoader from '../common/AppointmentSkeletonLoader'
import PatientAppointmentView from '../components/PatientAppointmentView'
import useUser from '../hook/useUser'

const MyPatient = (): React.JSX.Element => {

    const { getAllPatients } = useUser()
    const [appointments, setAppointments] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [refreshing, setRefreshing] = useState(false);

    const [refresh, setRefresh] = useState<boolean>(false)

    const skeletonArray = Array(4).fill(null);

    const fetchAppointments = async () => {
        try {
            const patients = await getAllPatients()
            setAppointments(patients || [])
        } catch (error) {
            console.log('Error fetching patients', error)
        } finally {
            setLoading(false)
        }
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        fetchAppointments();
        setRefreshing(false);
    }, [loading]);

    useEffect(() => {
        fetchAppointments()
    }, [loading, refreshing, refresh])




    return (
        <View style={{ flex: 1,backgroundColor:colors.white}}>
            <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />

            <FlatList
                data={loading ? skeletonArray : appointments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) =>
                    loading ? (
                        <AppointmentSkeletonLoader isLoading={loading} />
                    ) : (
                        <PatientAppointmentView item={item} />
                    )
                }
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </View>
    )
}

export default MyPatient

const styles = StyleSheet.create({})