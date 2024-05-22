import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Fonts } from '../../utils/Fonts'

const CalendarButton = ({ style, onPress, currentMode }) => {
    return (
        <TouchableOpacity style={[styles.wrapper, style]} onPress={onPress}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.text}>{currentMode}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 9,
    },
    text: {
        fontFamily: Fonts.PFEncoreSansPro,
        color: '#111111',
        fontSize: 18,
        lineHeight: 22,
        fontWeight: '300',
    },
    image: {
        width: 19,
        height: 18,
        marginRight: 9,
        resizeMode: 'contain',
    },
})
export default CalendarButton
