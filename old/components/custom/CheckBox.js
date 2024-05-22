import React from 'react'
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import IconOk from '../../../assets/oldImg/Checked.png'
import { Fonts } from '../../utils/Fonts'

const styles = StyleSheet.create({
    margVertical: {
        marginVertical: 9,
    },
    image: {
        height: 14,
        width: 10.5,
    },
    wrapperImage: {
        height: 16,
        width: 16,
        borderRadius: 3,
        backgroundColor: '#747E90',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyView: {
        height: 16,
        width: 16,
        borderRadius: 3,
        backgroundColor: '#DEE0E5',
    },
    text: {
        marginLeft: 10,
        color: '#111111',
        fontSize: 14,
        fontFamily: Fonts.TextLight,
    },
})
const Checkbox = ({ label, value, onValueChange, style }) => {
    return (
        <TouchableHighlight
            underlayColor="transparent"
            onPress={onValueChange}
            style={[styles.margVertical, style]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {value ? (
                    <View style={styles.wrapperImage}>
                        <Image style={styles.image} source={IconOk} resizeMode="contain" />
                    </View>
                ) : (
                    <View style={styles.emptyView} />
                )}
                <Text style={styles.text}>{label}</Text>
            </View>
        </TouchableHighlight>
    )
}
export default Checkbox
