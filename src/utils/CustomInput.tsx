import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle, TextStyle, TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming react-native-vector-icons is installed
import { colors } from '../const/Colors';

interface CustomInputProps extends TextInputProps {
    label?: string;                // Optional label for the input
    isPassword?: boolean;          // Indicates if the input is a password
    error?: boolean;               // Indicates if there's an error
    errorMessage?: string;         // Error message to display
    customStyles?: {
        container?: StyleProp<ViewStyle>;
        label?: StyleProp<TextStyle>;
        input?: StyleProp<TextStyle>;
        inputWrapper?: StyleProp<ViewStyle>;
        error?: StyleProp<TextStyle>;
        toggleIcon?: StyleProp<TextStyle>;
    }; // Custom styles
}

const CustomInput: React.FC<CustomInputProps> = ({ label, value, onChangeText, placeholder, placeholderTextColor: propPlaceholderColor, error = false, errorMessage, isPassword = false, customStyles = {}, ...rest }) => {
    const [isSecure, setIsSecure] = useState(isPassword);
    const placeholderColor = propPlaceholderColor ?? customStyles.placeholderTextColor ?? colors.black;

    return (
        <View style={[styles.inputContainer, customStyles.container]}>
            {label && <Text style={[styles.inputLabel, customStyles.label]}>{label}</Text>}
            <View style={[styles.inputWrapper, customStyles.inputWrapper]}>
                <TextInput value={value} placeholder={placeholder} placeholderTextColor={placeholderColor} onChangeText={onChangeText} secureTextEntry={isSecure} style={[styles.inputField, customStyles.input, { borderColor: error ? 'red' : colors.greenCustom },]}{...rest} />
                {isPassword && (
                    <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={styles.toggleButton}>
                        <Icon name={isSecure ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.greenCustom} style={customStyles.toggleIcon} />
                    </TouchableOpacity>
                )}
            </View>
            {error && errorMessage && (<Text style={[styles.errorText, customStyles.error]}>{errorMessage}</Text>)}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 15,
    },
    inputLabel: {
        color: colors.greenCustom,
        marginBottom: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
        borderColor: colors.greenCustom,
    },
    inputField: {
        flex: 1, // Take available space
        height: 45,
        fontSize: 16,
        color: 'black',
    },
    toggleButton: {
        paddingLeft: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 12,
    },
});

export default CustomInput;
