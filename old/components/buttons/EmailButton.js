import React from 'react'
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import CallIcon from '../../../assets/oldImg/Mail.png'
import { Fonts } from '../../utils/Fonts'

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 12,
        color: '#111111',
        fontFamily: Fonts.TextLight,
    },
    icon: {
        marginRight: 5,
        height: 18,
        width: 18,
    },
})

const EmailButton = ({ mail, style }) => {
    return (
        <TouchableOpacity
            style={[styles.wrapper, style]}
            onPress={() => Linking.openURL(`mailto:${mail}`)}>
            <View style={{ flexDirection: 'row' }}>
                <Image style={styles.icon} tintColor="#747E90" source={CallIcon} />
                <Text style={styles.text}>{mail}</Text>
            </View>
        </TouchableOpacity>
    )
}
export default EmailButton
