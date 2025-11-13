import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../const/Colors';
import CustomButton from '../utils/CustomButton';



const EmptyState = ({ title, refreshing, handleRefresh, color = colors.greenCustom }: any): React.JSX.Element => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title || 'No Data Available'}</Text>

            <CustomButton icon={null} title={"Refresh"} onPress={handleRefresh} isLoading={refreshing} backgroundColor={colors.greenCustom} textColor={colors.white} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    title: {
        color: '#999',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 15
    },
    button: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default EmptyState;
