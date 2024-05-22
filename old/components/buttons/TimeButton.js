import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import ClockIcon from '../../../assets/oldImg/Clock.png'
import { Fonts } from '../../utils/Fonts'

const TimeButton = ({ time, style, onPress }) => {
    return (
        <TouchableOpacity style={[styles.wrapper, style]} onPress={onPress}>
            <View style={{ flexDirection: 'row' }}>
                <Image style={styles.image} tintColor="#111111" source={ClockIcon} />
                <Text style={styles.text}>{time}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
        fontFamily: Fonts.TextLight,
        color: '#111111',
    },
    image: {
        resizeMode: 'contain',
        marginRight: 7,
        height: 17,
        width: 17,
    },
})

export default TimeButton
