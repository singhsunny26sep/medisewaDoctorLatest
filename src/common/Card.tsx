import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../const/Colors'

interface CardPropsType {
    title: string;
    onPress: () => void; // Function to handle button click
    img: string; // Button background color
    icons: any; // Button text color,
}

const Card = ({ title, img, icons, onPress }: CardPropsType): React.JSX.Element => {
    return (
        <TouchableOpacity style={styles.mainView} onPress={onPress}>
            <View style={styles.imageView}>
                <Image source={{ uri: img }} style={styles.imageStyle} />
            </View>
            <View style={styles.contentView}>
                <Text style={[styles.contentText, { width: icons ? '80%' : "100%" }]}>{title}</Text>
                {icons && <TouchableOpacity>{icons}</TouchableOpacity>}
            </View>
        </TouchableOpacity>
    )
}

export default Card

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        width: '90%',
        borderRadius: 8,
        marginVertical: 5,
        backgroundColor: '#ffff',
        elevation: 5
    },
    imageView: {
        width: '100%',
        height: '80%',
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        // borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    contentView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        top:5
    },
    contentText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.greenCustom,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'center',
        textTransform: 'capitalize',
    }
})