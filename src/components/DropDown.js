import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export default function DropDown({
  data,
  placeholder,
  selectedValue,
  onValueChange,
  search = false,
  searchPlaceholder = 'Search for an option...',
}) {
  return (
    <View style={styles.dropdownContainer}>
      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={selectedValue}
        onChange={onValueChange}
        search={search}
        searchPlaceholder={searchPlaceholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    flex: 1,
  },
  dropdown: {
    height: 50,
    borderColor: '#DCDCDC',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F9F9F9',
  },
});
