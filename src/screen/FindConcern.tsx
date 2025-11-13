import { FlatList, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { colors } from '../const/Colors'
import DoctorListView from '../components/DoctorListView'
import useDoctor from '../hook/useDoctor'
import DoctorSkeletonLoader from '../common/DoctorSkeletonLoader'
import { useRoute } from '@react-navigation/native'

const FindConcern = (): React.JSX.Element => {
    const route = useRoute()
    const { type, id }: any = route?.params //doctor user id

    const { getAllDoctors } = useDoctor()
    const [doctors, setDocotrs] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [refreshing, setRefreshing] = useState(false);

    const skeletonArray = Array(4).fill(null);

    const getDoctors = async () => {
        getAllDoctors(id, type).then((rerespones) => {
            setDocotrs(rerespones)
            setLoading(false)
        }).catch((error: any) => {
            console.log('Error fetching doctors', error)
            setLoading(false)
        })
    }

    // console.log("doctors: ", doctors);

    // Pull-to-refresh handler
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        getDoctors();
        setRefreshing(false);
    }, [loading]);

    useEffect(() => {
        getDoctors()
    }, [loading, refreshing])

    
    return (
        // <ScrollView>
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />
            {/* <DoctorListView /> */}
            {/* <FlatList data={doctors} renderItem={({ item }) => <DoctorListView />} refreshing={loading} onRefresh={onRefresh} /> */}

            <FlatList
                data={loading ? skeletonArray : doctors}
                keyExtractor={(item, index) => index.toString()} // Ensure unique keys for each item
                // renderItem={({ item }) => <DoctorListView />}
                renderItem={({ item, index }) =>
                    loading ? (
                        <DoctorSkeletonLoader isLoading={loading} />
                    ) : (
                        <DoctorListView item={item} />
                    )
                }
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </View>
        // </ScrollView>
    )
}

export default FindConcern

const styles = StyleSheet.create({})