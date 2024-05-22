import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import RightArrow from '../../../assets/oldImg/Down.png'

function ResidenceButton({ style, textStyle, text, onPress, isArrowVisible }) {
    return (
        <TouchableOpacity
            style={[styles.wrapper, style]}
            onPress={isArrowVisible ? onPress : undefined}>
            <View style={styles.container}>
                <Text style={[styles.text, textStyle]}>{text}</Text>
                {isArrowVisible && <Image style={styles.rightIcon} source={RightArrow} />}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 13,
        width: '100%',
    },
    text: {
        color: '#111111',
        fontSize: 16,
        textAlign: 'center',
    },
    rightIcon: {
        tintColor: '#111111',
        height: 3,
        width: 6,
        transform: [{ rotate: '-90deg' }],
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})
export default ResidenceButton
