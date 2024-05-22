import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import PropTypes from 'prop-types'

export const LABEL_POSITION = {
    RIGHT: 'right',
    LEFT: 'left',
}

const styles = StyleSheet.create({
    checkBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    alignStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBoxLabel: {
        marginRight: 5,
        marginLeft: 5,
    },
})

const CircleCheckBox = ({
    checked = false,
    label = '',
    filterSize = 12.5,
    innerSize = 8,
    filterColor = '#FFFFFF',
    innerColor = '#747E90',
    outerColor = '#747E90',
    onToggle,
    labelPosition = LABEL_POSITION.RIGHT,
    styleCheckboxContainer,
    styleLabel,
}) => {
    const customStyle = {
        circleFilterStyle: {
            width: filterSize,
            height: filterSize,
            backgroundColor: filterColor,
            borderRadius: filterSize / 2,
            borderWidth: 1,
            borderColor: outerColor,
        },
        circleInnerStyle: {
            width: innerSize,
            height: innerSize,
            backgroundColor: innerColor,
            borderRadius: innerSize / 2,
        },
    }

    const toggleCheckBox = () => {
        if (onToggle) {
            onToggle(!checked)
        }
    }

    const renderInner = () => {
        return checked ? <View style={customStyle.circleInnerStyle} /> : <View />
    }

    const renderLabel = (position) => {
        return label.length > 0 && position === labelPosition ? (
            <Text style={[styles.checkBoxLabel, styleLabel]}>{label}</Text>
        ) : (
            <View />
        )
    }

    return (
        <TouchableOpacity onPress={toggleCheckBox}>
            <View style={[styles.checkBoxContainer, styleCheckboxContainer]}>
                {renderLabel(LABEL_POSITION.LEFT)}
                <View style={[styles.alignStyle, customStyle.circleFilterStyle]}>
                    {renderInner()}
                </View>
                {renderLabel(LABEL_POSITION.RIGHT)}
            </View>
        </TouchableOpacity>
    )
}

CircleCheckBox.propTypes = {
    checked: PropTypes.bool,
    label: PropTypes.string,
    outerSize: PropTypes.number,
    filterSize: PropTypes.number,
    innerSize: PropTypes.number,
    outerColor: PropTypes.string,
    filterColor: PropTypes.string,
    innerColor: PropTypes.string,
    onToggle: PropTypes.func.isRequired,
    labelPosition: PropTypes.oneOf([LABEL_POSITION.RIGHT, LABEL_POSITION.LEFT]),
    styleCheckboxContainer: PropTypes.object, // Вместо ViewPropTypes.style
    styleLabel: PropTypes.object,
}

export default CircleCheckBox
