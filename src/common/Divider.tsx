import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../const/Colors'

const Divider = (): React.JSX.Element => {
    return (
        <View style={styles.dividerView} />
    )
}

export default Divider

const styles = StyleSheet.create({
    dividerView: {
        height: 1,
        backgroundColor: colors.drawerLineColor  // Replace with your desired color here. Use hex color codes. For example, #E1E1E1 for light gray.
    }
})