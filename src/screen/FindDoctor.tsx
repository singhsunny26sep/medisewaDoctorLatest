import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../const/Colors'
import HealthCategory from '../components/HeathCategory'
import CustomInput from '../utils/CustomInput'
import Search from '../components/Search'

const FindDoctor = (): React.JSX.Element => {
    return (
        <ScrollView>
            <View style={{ flex: 1,backgroundColor:colors.white}}>
                <StatusBar backgroundColor={colors.greenCustom} barStyle="light-content" />

                <Search />

                <HealthCategory title="Category" limit={null} type={"department"} />

                <HealthCategory title="Specialist" limit={null} type={"Specialist"} />
            </View>

            {/* pateint review */}
        </ScrollView>
    )
}

export default FindDoctor

const styles = StyleSheet.create({
    serachView: {
        width: '90%',
        alignSelf: 'center'
    }
})