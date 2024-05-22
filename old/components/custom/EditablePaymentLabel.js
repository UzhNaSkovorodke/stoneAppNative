import React, { useCallback, useEffect, useState } from 'react'
import {
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

import Underline from './Underline'

import { Fonts } from '../../utils/Fonts'
import { normalizePrice } from '../../utils/Utils'

const styles = StyleSheet.create({
    itemTextTitle: {
        marginTop: 20,
        marginBottom: 8,
        color: '#8E97A8',
        fontFamily: 'SFUIText-Light',
        fontSize: 14,
    },
    itemTextDescription: {
        color: '#111',
        fontFamily: 'SFUIText-Light',
        fontSize: 16,
    },
    editLabel: {
        color: '#747E90',
        fontFamily: Fonts.TextLight,
        fontSize: 10,
    },
    cancelEditLabelContainer: {
        bottom: 6,
    },
    editLabelContainer: {
        position: 'absolute',
        right: 0,
        bottom: 3,
    },
    maskedInput: {
        width: '100%',
        paddingTop: 0,
        paddingBottom: 0,
        color: 'black',
    },
})

const priceToString = (price) => price.toString().replace('.', ',')
const getValidNumberString = (value) => value.replace(',', '.')

const EditablePaymentLabel = ({
    amount,
    editable,
    onReject,
    onAccept,
    onClick,
    minValue,
    maxValue,
    setCheckValue,
}) => {
    const [isEditable, setEditable] = useState(false)
    const [currentValue, setCurrentValue] = useState(priceToString(amount))
    const [isValueValid, setValueValid] = useState(true)

    useEffect(() => {
        setCurrentValue(priceToString(amount))
        setValueValid(true)
    }, [setValueValid, amount])

    const checkValueValidity = (value) => {
        const amountValueString = getValidNumberString(value)
        const amountValueArray = amountValueString.split('.')
        if (amountValueArray[1] === '') {
            return false
        }
        const amountValue = Number(amountValueString)
        if (Number.isNaN(amountValue)) {
            return false
        }
        if (amountValue < minValue || amountValue > maxValue) {
            return false
        }
        return true
    }

    const handleAmountChange = (amountText) => {
        let currentText = amountText.replace('-', '').replace('.', ',').replace(' ', '')

        const isNextValueValid = amountText.length !== 1 && Number.isInteger(amountText.charAt(1))
        if (amountText.charAt(0) === '0' && isNextValueValid) {
            currentText = amount.slice(1)
        }

        const partIndex = currentText.indexOf(',')
        if (partIndex >= 0) {
            const parts = [currentText.slice(0, partIndex), currentText.slice(partIndex + 1)]
            let decimalPart = parts[1]
            const invalidDecimalPart =
                decimalPart !== '' || decimalPart?.length > 2 || Number.isNaN(Number(decimalPart))
            if (parts.length > 1 && invalidDecimalPart) {
                decimalPart = decimalPart.replace(/\D/g, '').slice(0, 2)
                currentText = `${parts[0]},${decimalPart}`
            }
        }

        setValueValid(checkValueValidity(currentText))
        setCheckValue(checkValueValidity(currentText))
        setCurrentValue(currentText)
    }

    const handleRejectValue = useCallback(() => {
        setEditable(false)
        priceToString(amount)
        setCurrentValue(priceToString(amount))
        setValueValid(true)
        onReject()
    }, [amount, onReject])

    const handleEditableLabelClick = () => {
        if (isEditable) {
            handleRejectValue()
            return
        }
        if (onClick) {
            onClick()
        }

        setEditable(true)
    }

    useEffect(() => {
        const handleAcceptValue = () => {
            setCurrentValue((state) => {
                const currentAmountValue = Number(getValidNumberString(state))
                if (Number.isNaN(currentAmountValue)) {
                    handleRejectValue()
                } else {
                    setEditable(false)
                    onAccept(currentAmountValue)
                }

                return state
            })
        }

        const showSubscription = Keyboard.addListener('keyboardDidHide', handleAcceptValue)
        return () => {
            showSubscription.remove()
        }
    }, [handleRejectValue, onAccept])

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                height: 58,
            }}>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemTextTitle}>Сумма к оплате</Text>
                {!isEditable ? (
                    <Text style={styles.itemTextDescription}>
                        {`${normalizePrice(amount)} руб.`}
                    </Text>
                ) : (
                    <View style={{ width: '100%' }}>
                        <TextInput
                            {...(Platform.OS === 'ios' && { returnKeyType: 'done' })}
                            style={styles.maskedInput}
                            keyboardType="decimal-pad"
                            value={currentValue}
                            onChangeText={handleAmountChange}
                        />
                        <Underline duration={200} borderColor={isValueValid ? '#E0E0E0' : 'red'} />
                    </View>
                )}
            </View>
            {editable && (
                <TouchableOpacity
                    style={[
                        styles.editLabelContainer,
                        isEditable && styles.cancelEditLabelContainer,
                    ]}
                    onPress={handleEditableLabelClick}>
                    <Text style={[styles.editLabel]}>
                        {isEditable ? 'Отмена' : 'Редактировать'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default EditablePaymentLabel
