import { FlatList, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { colors } from '../const/Colors'
import AppointmentSkeletonLoader from '../common/AppointmentSkeletonLoader'
import useUser from '../hook/useUser'
import PatientAppointmentView from '../components/PatientAppointmentView'
import Feather from 'react-native-vector-icons/Feather'

const MyPatient = (): React.JSX.Element => {

    const { getAllPatients } = useUser()
    const [patients, setPatients] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [refreshing, setRefreshing] = useState(false);

    const skeletonArray = Array(4).fill(null);

    const fetchPatients = async () => {
        try {
            const res = await getAllPatients()
            
            if (Array.isArray(res) && res.length > 0) {
                console.log("Patient details:")
                res.forEach((patient, index) => {
                    console.log(`Patient ${index + 1}:`, {
                        id: patient._id || patient.id,
                        name: patient.name,
                        email: patient.email,
                        mobile: patient.mobile,
                        address: patient.address,
                        role: patient.role
                    })
                })
            } else {
                console.log("No patients found or invalid response format")
            }
            
            setPatients(Array.isArray(res) ? res : [])
        } catch (error) {
            console.log("Error fetching patients:", error)
        } finally {
            setLoading(false)
        }
    }

    const onRefresh = useCallback(async () => {
        console.log("🔄 Refreshing patients data...")
        setRefreshing(true);
        await fetchPatients();
        setRefreshing(false);
        console.log("✅ Refresh completed")
    }, []);

    useEffect(() => {
        console.log("🚀 MyPatient component mounted, fetching patients...")
        fetchPatients()
    }, [])

    useEffect(() => {
        console.log("📊 Patients state updated:", {
            count: patients.length,
            loading,
            refreshing
        })
    }, [patients, loading, refreshing])

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />
            
            <View style={styles.headerContainer}>
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <View style={styles.iconContainer}>
                            <Feather name="users" size={24} color={colors.white} />
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>My Patients</Text>
                            <Text style={styles.headerSubtitle}>
                                {loading ? 'Loading...' : `${patients.length} ${patients.length === 1 ? 'Patient' : 'Patients'}`}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.refreshButton}
                        onPress={onRefresh}
                        disabled={loading}
                    >
                        <Feather 
                            name="refresh-cw" 
                            size={20} 
                            color={colors.greenCustom} 
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={loading ? skeletonArray : patients}
                keyExtractor={(item, index) => (item?._id || index).toString()}
                renderItem={({ item }) => loading ? <AppointmentSkeletonLoader isLoading={loading} /> : <PatientAppointmentView item={item} />}
                refreshing={refreshing}
                onRefresh={onRefresh}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Feather name="user-x" size={48} color={colors.lightGrey} />
                            <Text style={styles.emptyTitle}>No Patients Found</Text>
                            <Text style={styles.emptySubtitle}>Your patients will appear here</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    )
}

export default MyPatient

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary
    },
    headerContainer: {
        backgroundColor: colors.greenCustom,
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: colors.greenCustom,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    headerTextContainer: {
        flex: 1
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 2
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500'
    },
    refreshButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    listContainer: {
        paddingVertical: 16,
        paddingHorizontal: 8
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.dark,
        marginTop: 16,
        marginBottom: 8
    },
    emptySubtitle: {
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
        lineHeight: 20
    }
})


