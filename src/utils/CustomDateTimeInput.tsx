import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure you have react-native-vector-icons installed
import { colors } from '../const/Colors';
import moment from 'moment';

interface CustomDateTimeInputProps {
    label?: string;
    mode?: 'date' | 'time'; // Can be date or time
    value?: Date | string | null;
    onChange: (date: Date) => void;
    error?: boolean; // Indicates if there's an error
    errorMessage?: string; // Error message to display
}

const CustomDateTimeInput: React.FC<CustomDateTimeInputProps> = ({ label, mode = 'date', value, onChange, error = false, errorMessage }) => {
    const [open, setOpen] = useState(false);

    // Ensure `value` is always a valid Date object
    // const formattedValue = value ? new Date(value) : null;
    // const formattedValue = value && !isNaN(new Date(value).getTime()) ? new Date(value) : new Date();
    /* let formattedValue
    if (mode === 'date') {
        formattedValue = value && !isNaN(new Date(value).getTime()) ? new Date(value) : new Date();
    } else if (mode === 'time' && typeof value === 'string') {
        // Extract hours and minutes correctly for time values
        const [hours, minutes] = value.split(':').map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
            const now = new Date();
            now.setHours(hours, minutes, 0, 0); // Set time without changing the date
            formattedValue = now;
        } else {
            formattedValue = new Date(); // Default fallback
        }
    } else {
        formattedValue = value;
    } */
    let formattedValue: Date | null = null;

    if (mode === 'date') {
        if (value instanceof Date && !isNaN(value.getTime())) {
            formattedValue = value;
        } else if (typeof value === 'string') {
            const parsed = moment(value, [moment.ISO_8601, 'YYYY-MM-DD', 'DD-MM-YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD'], true);
            formattedValue = parsed.isValid() ? parsed.toDate() : new Date();
        } else {
            formattedValue = new Date();
        }
    } else if (mode === 'time') {
        if (value instanceof Date && !isNaN(value.getTime())) {
            formattedValue = value;
        } else if (typeof value === 'string') {
            // Expect "HH:mm" or "HH:mm:ss"
            const match = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
            if (match) {
                const hours = Number(match[1]);
                const minutes = Number(match[2]);
                const seconds = match[3] ? Number(match[3]) : 0;
                if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                    const now = new Date();
                    now.setHours(hours, minutes, seconds, 0);
                    formattedValue = now;
                }
            }
            if (!formattedValue) {
                const now = new Date();
                formattedValue = now;
            }
        } else {
            formattedValue = new Date();
        }
    }


    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity style={[styles.inputWrapper, { borderColor: error ? 'red' : '#00B074' }]} onPress={() => setOpen(true)}>
                <Text style={[styles.inputText, { color: formattedValue ? '#000' : '#888' }]}>
                    {formattedValue
                        ? (mode === 'date'
                            ? formattedValue.toLocaleDateString()
                            : formattedValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
                        : '-- : --'}
                </Text>
                <Icon name="calendar-outline" size={20} color="black" />
            </TouchableOpacity>

            {error && errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <DatePicker
                modal
                open={open}
                date={formattedValue || new Date()}
                mode={mode}
                onConfirm={(date) => {
                    setOpen(false);
                    onChange(date);
                }}
                onCancel={() => setOpen(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    label: {
        fontSize: 14,
        color: colors.greenCustom,
        marginBottom: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
    },
    inputText: {
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 12,
    },
});

export default CustomDateTimeInput;
