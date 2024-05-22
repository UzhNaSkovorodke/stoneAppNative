import React from 'react'
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Fonts } from '../../utils/Fonts'

const ButtonWithIcon = ({ imageStyle, style, onPress, source, label, description }) => {
    return (
        <Pressable style={[styles.wrapper, style]} onPress={onPress}>
            <Image style={[styles.icon, imageStyle]} source={source} />
            <View style={{ flexDirection: 'column', flex: 1 }}>
                <Text style={styles.labelText}>{label}</Text>
                <Text style={styles.descriptionText}>{description}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    labelText: {
        color: '#F7F7F9',
        fontFamily: Fonts.DisplaySemiBold,
        fontSize: 14,
    },
    descriptionText: {
        color: '#C5CAD2',
        fontFamily: Fonts.TextLight,
        fontSize: 12,
    },
    icon: {
        resizeMode: 'cover',
        tintColor: '#F7F7F9',
    },
    wrapper: {
        width: '100%',
        height: 75,
        marginBottom: 14,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#747E90',
        shadowColor: '#8E97A8',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
})

export default ButtonWithIcon
