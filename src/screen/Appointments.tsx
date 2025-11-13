import { FlatList, StatusBar, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AppointmentView from '../components/AppointmentView'
import useBooking from '../hook/useBooking'
import { colors } from '../const/Colors'
import AppointmentSkeletonLoader from '../common/AppointmentSkeletonLoader'
import EmptyState from '../common/EmptyState'

const Appointments = () => {
    const { getBookingByDoctorId } = useBooking()

    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loadingMore, setLoadingMore] = useState<boolean>(false)

    const skeletonArray = Array(4).fill(null);

    const getAppointments = async (newPage = 1, isRefreshing = false) => {
        if (newPage > totalPages && !isRefreshing) return; 
    
        if (newPage === 1) setLoading(true);
        else setLoadingMore(true);
    
        try {
            const response = await getBookingByDoctorId(newPage, 10); 
    
            console.log('Appointments API Response:', JSON.stringify(response, null, 2));
    
            if (response) {
                if (isRefreshing) {
                    setAppointments(response?.result || []);
                } else {
                    setAppointments((prev) => [...prev, ...(response?.result || [])]);
                }
                setTotalPages(response?.totalPages || 1);
                setPage(newPage);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };
    

    useEffect(() => {
        getAppointments();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setAppointments([]);
        getAppointments(1, true);
    }, []);

    const loadMoreAppointments = () => {
        if (!loadingMore && page < totalPages) {
            getAppointments(page + 1);
        }
    };

    return (
        <View style={styles.mainView}>
            <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />

            <FlatList
                showsVerticalScrollIndicator={false}
                data={loading ? skeletonArray : appointments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) =>
                    loading ? (
                        <AppointmentSkeletonLoader isLoading={loading} />
                    ) : (
                        <AppointmentView item={item} />
                    )
                }
                refreshing={refreshing}
                onRefresh={onRefresh}
                onEndReached={loadMoreAppointments}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => (
                    loadingMore ? <ActivityIndicator size="small" color={colors.greenCustom} /> : null
                )}
                ListEmptyComponent={() => (
                    !loading && <EmptyState title={"No appointment found!"} refreshing={refreshing} handleRefresh={onRefresh} />
                )}
            />
        </View>
    )
}

export default Appointments

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingHorizontal: '5%',
        paddingTop: 10
    }
})
