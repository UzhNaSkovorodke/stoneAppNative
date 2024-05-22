import React, { useState } from 'react'
import { Dimensions, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

const { width } = Dimensions.get('window')
const buttonSize = width / 5.2

const NumButton = ({ numValue, wordValue, onPress }) => {
    const [buttonIsTouched, setButtonIsTouched] = useState(false)

    const onPressIn = () => {
        setButtonIsTouched(true)
    }

    const onPressOut = () => {
        setButtonIsTouched(false)
    }

    return (
        <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center' }}>
            <TouchableHighlight
                style={styles.blueButton}
                underlayColor="#747E90"
                onPressIn={onPressIn}
                delayPressIn={0}
                onPressOut={onPressOut}
                onPress={() => onPress(numValue)}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text
                        style={[styles.blueButtonNumber, buttonIsTouched && { color: '#FFFFFF' }]}>
                        {numValue}
                    </Text>
                    <Text style={[styles.blueButtonText, buttonIsTouched && { color: '#FFFFFF' }]}>
                        {wordValue}
                    </Text>
                </View>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    blueButton: {
        width: buttonSize,
        height: buttonSize,
        borderWidth: 1.3,
        borderColor: '#747E90',
        borderRadius: 50,
    },
    blueButtonNumber: {
        marginTop: 3,
        color: '#747E90',
        fontSize: buttonSize / 2.7,
        textAlign: 'center',
    },
    blueButtonText: {
        color: '#747E90',
        fontSize: buttonSize / 6.5,
        textAlign: 'center',
    },
    buttonBlueColumn: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
})

export default NumButton
