import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'

import shared from '../../../store/index'
import DefaultButton from '../../components/buttons/DefaultButton'
import TextFieldNew from '../../components/custom/TextFieldNew'
import reportError from '../../utils/ReportError'

function PasswordRecoveryScreen({ resetPassword, setSuccess, navigation }) {
    const [value, setValue] = useState('')

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/
        return re.test(email)
    }

    const onGetNewPassButtonPress = () => {
        resetPassword({ [validateEmail(value) ? 'email' : 'login']: value })
            .then(() => {
                setSuccess([{ message: 'Новый пароль выслан на указанный в профиле e-mail' }])
                navigation.navigate('SignInScreen')
            })
            .catch((error) => {
                reportError(error, 'PasswordRecovery/onGetNewPassButtonPress/resetPassword')
                navigation.navigate('SignInScreen')
            })
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEventThrottle={16}>
            <View style={styles.wrapper}>
                <View style={styles.inputWrapper}>
                    <TextFieldNew
                        value={value}
                        onChangeText={(changedValue) => {
                            setValue(changedValue)
                        }}
                        isBorderBot={true}
                        placeholder={'Введите логин или email'}
                    />
                </View>
                <DefaultButton
                    disabled={!value}
                    text="Выслать новый пароль"
                    onPress={onGetNewPassButtonPress}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        marginBottom: 16,
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    inputWrapper: {
        marginBottom: 50,
    },
})

export default connect(null, {
    resetPassword: shared.actions.resetPassword,
    setSuccess: shared.actions.success,
})(PasswordRecoveryScreen)
