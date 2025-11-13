import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import CustomButton from "../utils/CustomButton";
import { colors } from "../const/Colors";


interface CustomModalProps {
    title: string;
    onConfirm: () => void; // Function to handle button click
    onCancel: () => void; // Function to handle button click
    isLoading: boolean; // Pass the loading state from parent
    msg: string,
    visible: boolean;
}


// 
// Are you sure you want to cancel this booking? This action cannot be undone.
const CancelConfirmModal = ({ title, msg, visible, onCancel, onConfirm, isLoading }: CustomModalProps) => {
    return (
        <Modal isVisible={visible} backdropOpacity={0.5} animationIn="fadeIn" animationOut="fadeOut">
            <View style={styles.modalContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{msg}</Text>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    {/* <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={isLoading}>
                        <Text style={styles.cancelText}>No</Text>
                    </TouchableOpacity> */}
                    <CustomButton icon={null} isLoading={false} onPress={onCancel} title='No' backgroundColor={colors.red} textColor={colors.white} />

                    <CustomButton icon={null} onPress={onConfirm} title='Yes' backgroundColor={colors.greenCustom} textColor={colors.white} isLoading={isLoading} />
                    {/* <TouchableOpacity style={[styles.confirmButton, isLoading && styles.disabledButton]} onPress={onConfirm} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.confirmText}>Yes, Cancel</Text>
                        )}
                    </TouchableOpacity> */}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center"
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    message: {
        fontSize: 14,
        textAlign: "center",
        color: "#555",
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: "#ddd",
        marginRight: 10,
    },
    confirmButton: {
        flex: 1,
        padding: 12,
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: "#e53935",
    },
    cancelText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "bold",
    },
    confirmText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
    disabledButton: {
        opacity: 0.6,
    }
});

export default CancelConfirmModal;
