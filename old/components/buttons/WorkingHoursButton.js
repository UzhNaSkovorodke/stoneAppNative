import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import WorkingHours from '../../../assets/oldImg/WorkingHours.png'
import { Fonts } from '../../utils/Fonts'

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flexDirection: 'row',
        width: '100%',
    },
    text: {
        paddingRight: 16,
        fontSize: 12,
        color: '#111111',
        fontFamily: Fonts.TextLight,
    },
    image: {
        alignSelf: 'center',
        marginRight: 5,
        height: 18,
        width: 18,
    },
})

export default class WorkingHoursButton extends React.Component {
    render() {
        const { currentMode, style, onPress } = this.props
        return (
            <TouchableOpacity style={[styles.wrapper, style]} onPress={onPress}>
                <View style={styles.container}>
                    <Image tintcolor="#747E90" style={styles.image} source={WorkingHours} />
                    <Text style={styles.text}>{currentMode}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
