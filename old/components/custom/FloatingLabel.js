import { Fonts } from '../../utils/Fonts'
import PropTypes from 'prop-types'

import React, { Component } from 'react'
import { Animated, Platform, StyleSheet, Text } from 'react-native'

const styles = StyleSheet.create({
    labelText: {
        position: 'absolute',
        left: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        fontFamily: Fonts.DisplayLight,
    },
})

class FloatingLabel extends Component {
    constructor(props) {
        super(props)
        if (props.dense) {
            this.posTop = 12
            this.posBottom = 32
            this.fontLarge = 13
            this.fontSmall = 13
        } else {
            this.posTop = Platform.OS === 'ios' ? 18 : 10
            this.posBottom = 37
            this.fontLarge = 14
            this.fontSmall = 12
        }
        const posTop = props.hasValue ? this.posTop : this.posBottom
        const fontSize = props.hasValue ? this.fontSmall : this.fontLarge
        this.state = {
            top: new Animated.Value(posTop),
            fontSize: new Animated.Value(fontSize),
            textColor: new Animated.Value(0),
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.hasValue === nextProps.hasValue
    }

    floatLabel() {
        Animated.parallel([
            Animated.timing(this.state.top, {
                toValue: this.posTop,
                duration: this.props.duration,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.fontSize, {
                toValue: this.fontSmall,
                duration: this.props.duration,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.textColor, {
                toValue: 1,
                duration: this.props.duration,
                useNativeDriver: false,
            }),
        ]).start()
    }

    sinkLabel() {
        Animated.parallel([
            Animated.timing(this.state.top, {
                toValue: this.posBottom,
                duration: this.props.duration,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.fontSize, {
                toValue: this.fontLarge,
                duration: this.props.duration,
                useNativeDriver: false,
            }),
            Animated.timing(this.state.textColor, {
                toValue: 0,
                duration: this.props.duration,
                useNativeDriver: false,
            }),
        ]).start()
    }

    render() {
        const { label } = this.props

        let { required } = this.props

        if (required) {
            required = <Text style={{ color: 'red', fontSize: this.props.posTop }}>*</Text>
        }
        return (
            <Animated.Text
                style={[
                    {
                        fontSize: this.state.fontSize,
                        top: this.state.top,
                        color: this.state.textColor.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['#111111', '#747E90'],
                        }),
                    },
                    styles.labelText,
                    this.props.isFocused,
                ]}
                onPress={() => {
                    this.props.focusHandler()
                }}>
                {label}
                {required}
            </Animated.Text>
        )
    }
}

FloatingLabel.propTypes = {
    duration: PropTypes.number,
    label: PropTypes.string,
    dense: PropTypes.bool,
}

FloatingLabel.defaultProps = {
    label: '',
    duration: 0,
    dense: false,
}

export default FloatingLabel
