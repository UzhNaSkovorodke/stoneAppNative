import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Fonts } from '../../utils/Fonts'

const styles = StyleSheet.create({
    commentLabel: {
        color: '#747E90',
        fontFamily: Fonts.DisplayLight,
        fontSize: 12,
    },
    element: {
        fontSize: 12,
        color: 'red',
    },
})

const CommentLabel = ({ required, viewStyle, style, text }) => {
    const requiredElement = required ? <Text style={styles.element}>*</Text> : null

    return (
        <View style={[{ flexDirection: 'row' }, viewStyle]}>
            <Text style={[styles.commentLabel, style]}>{text}</Text>
            {requiredElement}
        </View>
    )
}

export default CommentLabel
