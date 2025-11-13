import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../const/Colors';  // Adjust path as per your project structure

interface CustomDropdownProps {
    label: string;                // The label to display above the dropdown
    data: { id: string | number, name: string }[];  // Array of data for the dropdown options
    selectedValue: any;          // Current selected value (from the parent component)
    onSelect: (item: any) => void; // Callback function to handle the selected item
    valSchool?: string;          // Optional prop for custom validation state (like error color)
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, data, selectedValue, onSelect, valSchool = "" }) => {
    // const [isOpened, isSelected] = useState<boolean>(false)
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <SelectDropdown
                data={data}
                onSelect={onSelect}
                buttonTextAfterSelection={(selectedItem: any) => (selectedItem ? selectedItem.name : "Select option")}
                rowTextForSelection={(item: any) => item.name}
                defaultButtonText="Select an option"
                buttonStyle={[styles.dropdownButtonStyle, { borderColor: valSchool ? "red" : colors.greenCustom }]}
                buttonTextStyle={styles.dropdownButtonTxtStyle}
                rowStyle={styles.rowStyle}
                renderDropdownIcon={(isOpened: any) => <Icon name={isOpened ? 'arrow-up-sharp' : 'arrow-down-sharp'} style={styles.dropdownButtonArrowStyle} />}
                renderButton={(selectedItem, isOpened) => (
                    <View style={[styles.dropdownButtonStyle, { borderColor: valSchool ? "red" : colors.greenCustom }]}>
                        <Text style={styles.dropdownButtonTxtStyle}>{selectedItem ? selectedItem.name : 'Select option'}</Text>
                        <Icon name={isOpened ? 'arrow-up-sharp' : 'arrow-down-sharp'} style={styles.dropdownButtonArrowStyle} />
                    </View>
                )}
                renderItem={(item, index, isSelected) => (
                    <View style={[styles.dropdownItemStyle, isSelected && { backgroundColor: '#D2D9DF' }]}>
                        <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownStartPointStyle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        width: '100%',
    },
    label: {
        fontSize: 16,
        color: colors.greenCustom, // Adjusted to use color from your `colors` module
        marginBottom: 8,
    },
    dropdownButtonStyle: {
        width: '100%',
        height: 40,
        // backgroundColor: 'white',
        borderRadius: 6,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 15,
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 20,
        color: '#151E26',
    },
    dropdownStartPointStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    rowStyle: {
        backgroundColor: '#fff',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#151E26',
    },
});

export default CustomDropdown;
