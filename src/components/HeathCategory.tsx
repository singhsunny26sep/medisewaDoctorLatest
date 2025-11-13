import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import CategoryCard from '../common/CategoryCard';
import { colors } from '../const/Colors';
import { NavigationString } from '../const/NavigationString';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import useDepartment from '../hook/useDepartment';
import useSpecialization from '../hook/useSpecialization';
import SkeletonLoader from '../common/SkeletonLoader';

const HealthCategory = ({ title, limit, type }: any) => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const { getAllPagination, getAllDepartments } = useDepartment();
    const { getAllPaginationSpecialization, getAllSpecialization } = useSpecialization();

    const [departments, setDepartments] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    // let loading = true

    const skeletonArray = Array(3).fill(null);

    // Function to fetch departments
    const getDepartments = async () => {
        try {
            setLoading(true);
            let data;
            if (limit) {
                if (type === 'department') data = await getAllPagination(limit);
                if (type === 'Specialist') data = await getAllPaginationSpecialization(limit);
            } else {
                if (type === 'department') data = await getAllDepartments();
                if (type === 'Specialist') data = await getAllSpecialization();
            }
            if (data) setDepartments(data);
            setLoading(false)
        } catch (error) {
            console.error('Error fetching departments: ', error);
        } finally {
            setLoading(false);
        }
    };

    // Pull-to-refresh handler
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await getDepartments();
        setRefreshing(false);
    }, [limit, type]);

    // Fetch data when the component mounts
    useEffect(() => {
        getDepartments();
    }, [limit, type]);

    return (
        <Fragment>
            <View style={styles.mainView}>
                {loading ? <View style={styles.skeletonText} /> : <Text style={styles.header}>{title}</Text>}

                <FlatList
                    data={loading ? skeletonArray : departments}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) =>
                        loading ? (
                            <SkeletonLoader isLoading={true} />
                        ) : (
                            <CategoryCard image={item.image} text={item.name} onPress={() => navigation.navigate(NavigationString.FindConcern, { type: type, id: item?._id })} />
                        )
                    }
                    numColumns={3} // Display items in 3 columns
                    columnWrapperStyle={styles.columnWrapper} // Handles column spacing
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    contentContainerStyle={styles.cardCategory}
                />

            </View>
        </Fragment>
    );
};

export default HealthCategory;

const styles = StyleSheet.create({
    mainView: {
        width: '90%',
        // justifyContent: 'space-between',
        paddingVertical: 10,
        alignSelf: 'center',
    },
    cardCategory: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5, // Set the desired gap between items (adjust this value as needed)
        alignSelf: 'center',
    },
    /* cardCategory: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 8
    }, */
    header: {
        color: colors.black,
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
    skeletonText: {
        width: '60%',
        height: 15,
        backgroundColor: '#d6d6d6',
        borderRadius: 4,
    },
    columnWrapper: {
        justifyContent: 'space-between', // Distributes items evenly
        marginBottom: 8, // Adjust row spacing
    }
});
