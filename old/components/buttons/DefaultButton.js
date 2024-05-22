import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Fonts } from '../../utils/Fonts'
import SpinLoader from '../custom/Spinner'

const DefaultButton = ({
    text,
    textStyle,
    style,
    onPress,
    disabled,
    isShowLoader,
    wrapperStyle,
}) => {
    return (
        <View style={[styles.shadowBox, style]}>
            <TouchableOpacity
                style={[
                    disabled ? styles.disabledWrapperColor : styles.defaultWrapperColor,
                    styles.defaultWrapper,
                    wrapperStyle,
                ]}
                onPress={onPress}
                disabled={disabled || isShowLoader}>
                <View style={styles.wrapper}>
                    <Text
                        style={[
                            disabled ? styles.disabledTextColor : styles.defaultTextColor,
                            styles.defaultText,
                            textStyle,
                        ]}>
                        {text}
                    </Text>
                </View>

                {isShowLoader !== undefined && isShowLoader && (
                    <View style={styles.spinnerWrapper}>
                        <SpinLoader style={styles.spinner} />
                    </View>
                )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shadowBox: {
        width: '100%',
        height: 50,
        marginTop: 30,
        backgroundColor: '#747E90',
        borderRadius: 10,
        shadowColor: '#8E97A8',
        shadowOpacity: 0.35,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    defaultWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
    },
    defaultWrapperColor: {
        backgroundColor: '#747E90',
    },
    disabledWrapperColor: {
        backgroundColor: '#DDDDDD',
    },
    defaultText: {
        fontFamily: Fonts.DisplayCompactRegular,
        fontSize: 14,
    },
    defaultTextColor: {
        color: '#FEFEFE',
    },
    disabledTextColor: {
        color: '#FFFFFF',
    },
    spinnerWrapper: {
        position: 'absolute',
        right: 20,
    },
    spinner: {
        width: 12,
        height: 12,
        tintColor: '#FFFFFF',
    },
})
export default DefaultButton
