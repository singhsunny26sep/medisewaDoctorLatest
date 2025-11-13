import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../const/Colors'

const Dashboard = (): React.JSX.Element => {
    return (
        <View style={{ flex: 1, }}>
            <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />
            <Text>Dashboard</Text>
        </View>
    )
}

export default Dashboard

const styles = StyleSheet.create({})