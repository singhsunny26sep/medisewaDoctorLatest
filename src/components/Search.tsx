import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomInput from '../utils/CustomInput'
import useDepartment from '../hook/useDepartment'
import useSpecialization from '../hook/useSpecialization'
import DropDownPicker from 'react-native-dropdown-picker'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../const/Colors'
import { NavigationString } from '../const/NavigationString'

const Search = () => {
    const [specialist, setSpecialist] = useState<any[]>([])
    const [department, setDepartment] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const { getAllDepartments } = useDepartment()
    const { getAllSpecialization } = useSpecialization()
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const navigation = useNavigation<any>()

    const getApis = async () => {
        const specializations = await getAllSpecialization()
        const departments = await getAllDepartments()

        setSpecialist(specializations)
        setDepartment(departments)
        setFilteredData([...specializations, ...departments]) // Initialize dropdown data
        setLoading(false)
    }

    useEffect(() => {
        getApis()
    }, [])


    const handleSelect = (item: any) => {
        setValue(item.value);
        setOpen(false);

        // Determine the type based on the source of the selected item
        const isSpecialist = specialist.some(s => s._id === item.value);
        const type = isSpecialist ? "Specialist" : "department";

        // Navigate to the next screen with type and id parameters
        navigation.navigate(NavigationString.FindConcern, { type, id: item.value });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>

            <DropDownPicker
                open={open}
                setOpen={setOpen}
                value={value}
                setValue={setValue}
                items={filteredData.map(item => ({ label: item.name, value: item._id }))}
                searchable={true}
                searchPlaceholder="Type to search..."
                onChangeSearchText={(text) => {
                    // Filter items based on search text
                    const searchResults = [...specialist, ...department].filter(item => item.name.toLowerCase().includes(text.toLowerCase()))
                    setFilteredData(searchResults)
                }}
                onSelectItem={handleSelect}
                placeholder={"Search by Specialist/Symptoms"}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropDownContainer}
                listMode="SCROLLVIEW" // Optimizes rendering performance
                searchTextInputStyle={{
                    color: colors.black,
                    borderWidth: 1,
                    borderColor: colors.greenCustom,
                    height: 40
                }}
                searchPlaceholderTextColor="grey"
            />
        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    searchView: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 20
    },
    dropdown: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 10,
        borderColor: colors.greenCustom,
        borderWidth: 1,
        zIndex: 1000, // Ensure dropdown appears above other elements
    },
    dropDownContainer: {
        width: '90%',
        alignSelf: 'center',
        borderColor: colors.greenCustom,
    }
})
