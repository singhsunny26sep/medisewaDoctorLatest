/* import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import { colors } from '../const/Colors'

const CustomSelection = ({ title, data, defaultValue, setDataValue, label, searchAble, error, errorMessage, customStyles, setErrorMsg }: any) => {
    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState<any>(null)

    useEffect(() => {
        if (defaultValue) {
            // Set the default value when the component mounts or the default value changes
            setValue({ label: defaultValue.name, value: defaultValue.value });
        }
    }, [defaultValue]);

    const handleSelect = (item: any) => {
        setValue(item?._id);
        setOpen(false);
        setDataValue(item)
        setErrorMsg('')
    };

    return (
        <View>
            {label && <Text style={[styles.inputLabel]}>{label}</Text>}
            <DropDownPicker
                open={open}
                setOpen={setOpen}
                value={value}
                setValue={setValue}
                // items={departments}
                items={data.map((item: any) => ({ label: item.name, value: item._id }))}
                searchable={searchAble}
                searchPlaceholder="Type to search..."
                onSelectItem={handleSelect}
                placeholder={title}
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
            {error && errorMessage && (<Text style={[styles.errorText, customStyles?.error]}>{errorMessage}</Text>)}
        </View>
    )
}

export default CustomSelection

const styles = StyleSheet.create({
    dropdown: {
        width: '100%',
        alignSelf: 'center',
        borderColor: colors.greenCustom,
        borderWidth: 1,
        zIndex: 1000, // Ensure dropdown appears above other elements
    },
    dropDownContainer: {
        width: '100%',
        alignSelf: 'center',
        borderColor: colors.greenCustom,
    },
    inputLabel: {
        color: colors.greenCustom,
        marginBottom: 5,
        marginTop: 10
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 12,
    },
}) */


/* import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { colors } from '../const/Colors';

const CustomSelection = ({
    title,
    data,
    defaultValue,
    setDataValue,
    label,
    searchAble,
    error,
    errorMessage,
    customStyles,
    setErrorMsg
}: any) => {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<any>(null);

    useEffect(() => {
        if (defaultValue) {
            // Set the default value when the component mounts or the default value changes
            setValue({ label: defaultValue.name, value: defaultValue._id });
        }
    }, [defaultValue]);

    const handleSelect = (item: any) => {
        setValue(item);
        setOpen(false);
        setDataValue(item);  // Update selected value
        setErrorMsg('');  // Reset error message
    };

    return (
        <View>
            {label && <Text style={[styles.inputLabel]}>{label}</Text>}
            <DropDownPicker
                open={open}
                setOpen={setOpen}
                value={value ? value.value : null} // Set the correct selected value
                setValue={setValue}
                items={data.map((item: any) => ({
                    label: item.name,
                    value: item._id
                }))}
                searchable={searchAble}
                searchPlaceholder="Type to search..."
                onSelectItem={handleSelect}
                placeholder={title}
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
            {error && errorMessage && (
                <Text style={[styles.errorText, customStyles?.error]}>{errorMessage}</Text>
            )}
        </View>
    );
};

export default CustomSelection;

const styles = StyleSheet.create({
    dropdown: {
        width: '100%',
        alignSelf: 'center',
        borderColor: colors.greenCustom,
        borderWidth: 1,
        zIndex: 1000, // Ensure dropdown appears above other elements
    },
    dropDownContainer: {
        width: '100%',
        alignSelf: 'center',
        borderColor: colors.greenCustom,
    },
    inputLabel: {
        color: colors.greenCustom,
        marginBottom: 5,
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 12,
    },
});
 */

import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { colors } from '../const/Colors';

const CustomSelection = ({ title, data, defaultValue, setDataValue, label, searchAble, error, errorMessage, customStyles, setErrorMsg }: any) => {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<any>(null);

    useEffect(() => {
        if (defaultValue) {
            // Set initial value only if it's available, otherwise leave as null
            setValue({ label: defaultValue.name, value: defaultValue.value });
        }
    }, [defaultValue]);  // This ensures it updates when the defaultValue changes

    const handleSelect = (item: any) => {
        // Update the selected value and close the dropdown
        setValue({ label: item.name, value: item._id });
        setOpen(false);
        setDataValue(item);  // Pass selected item to parent component
        setErrorMsg('');  // Reset error message
    };

    return (
        <View>
            {label && <Text style={[styles.inputLabel]}>{label}</Text>}
            <DropDownPicker
                open={open}
                setOpen={setOpen}
                value={value ? value.value : null}  // Use state value for controlling the selection
                setValue={setValue}
                items={data.map((item: any) => ({
                    label: item.name,
                    value: item._id
                }))}
                searchable={searchAble}
                searchPlaceholder="Type to search..."
                onSelectItem={handleSelect}
                placeholder={title}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropDownContainer}
                listMode="SCROLLVIEW"
                searchTextInputStyle={{
                    color: colors.black,
                    borderWidth: 1,
                    borderColor: colors.greenCustom,
                    height: 40
                }}
                searchPlaceholderTextColor="grey"
            />
            {error && errorMessage && (
                <Text style={[styles.errorText, customStyles?.error]}>{errorMessage}</Text>
            )}
        </View>
    );
};

export default CustomSelection;

const styles = StyleSheet.create({
    dropdown: {
        width: '100%',
        alignSelf: 'center',
        borderColor: colors.greenCustom,
        borderWidth: 1,
        zIndex: 1000,
    },
    dropDownContainer: {
        width: '100%',
        alignSelf: 'center',
        borderColor: colors.greenCustom,
    },
    inputLabel: {
        color: colors.greenCustom,
        marginBottom: 5,
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 12,
    },
});
