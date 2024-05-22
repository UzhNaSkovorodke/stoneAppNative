import React, { Component } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

import FloatingLabel from './FloatingLabel'
import Underline from './Underline'

import { TextInputMask } from 'react-native-masked-text'

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        width: '100%',
        height: 62,
        paddingTop: 20,
        paddingBottom: 7,
    },
    denseWrapper: {
        position: 'relative',
        height: 60,
        paddingTop: 28,
        paddingBottom: 4,
    },
    textInput: {
        height: 44,
        fontSize: 14,
        lineHeight: 24, // Расстояние до нижней линии
    },
    denseTextInput: {
        height: 27,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingBottom: 3,
        fontSize: 13,
        lineHeight: 24,
    },
})

export default class extends Component {
    masked = false

    static defaultProps = {
        maskDefaultValue: true,
    }

    constructor(props, context) {
        super(props, context)
        this.state = {
            isFocused: false,
            text: props.value && props.value !== undefined ? props.value : '',
        }
    }

    focus = () => {
        this.input?.focus?.()
    }

    blur() {
        this.input?.blur?.()
    }

    isFocused() {
        const { isFocused } = this.state
        return isFocused
    }

    renderMaskedInput = ({ textInputProps }) => (
        <TextInputMask
            type="custom"
            options={{
                mask: '+7 (999) 999 99 99',
            }}
            {...textInputProps}
        />
    )

    renderDefaultTextInput = ({ textInputProps }) => <TextInput {...textInputProps} />

    render() {
        const {
            label,
            required,
            onFocus,
            onBlur,
            onChangeText,
            value,
            masked,
            style,
            // dense,
            ...rest
        } = this.props
        const { isFocused, text } = this.state
        const textInputProps = {
            ...rest,
            style: [styles.textInput, { color: '#111111' }],
            selectionColor: '#747E90',
            onFocus: () => {
                this.setState({ isFocused: true })
                this.refs.floatingLabel.floatLabel()
                this.refs.underline.expandLine()

                onFocus && onFocus()
            },
            onBlur: () => {
                this.setState({ isFocused: false })

                !text.length && this.refs.floatingLabel.sinkLabel()
                this.refs.underline.shrinkLine()

                onBlur && onBlur()
            },
            onChangeText: (textValue) => {
                this.setState({
                    text: textValue,
                })
                if (onChangeText) {
                    onChangeText(textValue)
                }
            },
            ref: (ref) => {
                this.input = ref
            },
            value: text,
        }

        return (
            <View style={[styles.wrapper, style]} ref="wrapper">
                {masked
                    ? this.renderMaskedInput({ textInputProps })
                    : this.renderDefaultTextInput({ textInputProps })}
                <Underline ref="underline" duration={200} borderColor="#E0E0E0" />
                <FloatingLabel
                    isFocused={isFocused}
                    focusHandler={this.focus}
                    label={label}
                    required={required}
                    duration={200}
                    dense={false}
                    hasValue={!!text.length}
                    ref="floatingLabel"
                />
            </View>
        )
    }
}
