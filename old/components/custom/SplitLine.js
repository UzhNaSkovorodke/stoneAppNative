import React from 'react'
import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
    splitLine: {
        borderBottomColor: '#E6E6E6',
        width: '100%',
        borderBottomWidth: 1,
        marginBottom: 10,
        marginTop: 10,
    },
})

export default function SplitLine({ style }) {
    return <View style={[styles.splitLine, style]} />
}
