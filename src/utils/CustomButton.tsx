import React, { useState } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';

interface CustomButtonProps {
    title: string;
    onPress: () => void; // Function to handle button click
    isLoading: boolean; // Pass the loading state from parent
    backgroundColor: string; // Button background color
    textColor: string; // Button text color,
    icon?: any,
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, isLoading, backgroundColor, textColor, icon }) => {

    return (
        <TouchableOpacity onPress={onPress} style={[{ backgroundColor: isLoading ? 'gray' : backgroundColor, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }]} disabled={isLoading}>
            {icon && <Text style={{ marginRight: 10 }}>{icon}</Text>}{isLoading ? (<><Text style={{ color: textColor, fontSize: 16, marginRight: 5 }}>{title} </Text><ActivityIndicator size="small" color={textColor} /></>) : (<Text style={{ color: textColor, fontSize: 16 }}>{title}</Text>)}
        </TouchableOpacity>
    );
};

export default CustomButton;
