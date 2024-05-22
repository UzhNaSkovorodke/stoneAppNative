import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import CallIcon from '../../../assets/oldImg/Call.png'
import { Fonts } from '../../utils/Fonts'
import reportError from '../../utils/ReportError'

// import call from 'react-native-phone-call'

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    text: {
        color: '#111111',
        fontFamily: Fonts.TextLight,
        fontSize: 12,
    },
    icon: {
        width: 18,
        height: 18,
        marginRight: 5,
    },
})

const PhoneButton = ({ number, style }) => {
    const onCallButtonPress = (phone) => {
        const args = {
            number: phone,
        }

        // call(args).catch((error) => reportError(error, 'PhoneButton'))
    }

    return (
        <TouchableOpacity style={[styles.wrapper, style]} onPress={() => onCallButtonPress(number)}>
            <View style={{ flexDirection: 'row' }}>
                <Image style={styles.icon} tintColor="#747E90" source={CallIcon} />
                <Text style={styles.text}>{number}</Text>
            </View>
        </TouchableOpacity>
    )
}
export default PhoneButton
