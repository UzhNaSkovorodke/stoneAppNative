import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

const RoundButton = ({ text, style, onPress, isSelected }) => {
    return (
        <TouchableOpacity
            style={[isSelected ? styles.selectedButton : styles.notSelectedButton, style]}
            onPress={onPress}>
            <Text style={isSelected ? styles.selectedText : styles.notSelectedText}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    notSelectedButton: {
        height: 40,
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        marginTop: 30,
        backgroundColor: '#DDDDDD',
        borderRadius: 30,
        paddingHorizontal: 16,
    },
    selectedButton: {
        height: 40,
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        marginTop: 30,
        backgroundColor: '#747E90',
        borderRadius: 30,
        paddingHorizontal: 16,
    },
    notSelectedText: {
        color: '#747E90',
        fontSize: 14,
        textAlign: 'center',
    },
    selectedText: {
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
    },
})

export default RoundButton
