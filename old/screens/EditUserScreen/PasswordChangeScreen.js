import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import shared from '../../../store/index'
import DefaultButton from '../../components/buttons/DefaultButton'
import TextFieldNew from '../../components/custom/TextFieldNew'
import commonStyles from '../../styles/CommonStyles'
import { Fonts } from '../../utils/Fonts'
import reportError from '../../utils/ReportError'
import { Controller, useForm } from 'react-hook-form'

const PasswordChangeScreen = ({ changePassword, navigation, setError }) => {
    //TODO сделать валидацию сделать loading и сообщение, обработку ошибок
    const { control, watch } = useForm({
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            newPasswordCheck: '',
        },
    })

    const newPassword = watch('newPassword')
    const oldPassword = watch('oldPassword')
    const newPasswordCheck = watch('newPasswordCheck')
    const onSendButtonPress = () => {
        if (newPassword !== newPasswordCheck) {
            setError([
                {
                    message: 'Пароли не совпадают. Проверьте правильность введенных данных.',
                },
            ])
            return
        }

        changePassword({
            password: oldPassword,
            newPassword,
        })
            .then(() => {
                navigation.goBack()
            })
            .catch((error) => {
                reportError(error, 'PasswordChange/onSendButtonPress/changePassword')
                setError({ message: 'Ошибка сервера' })
            })
    }
    return (
        <ScrollView scrollEventThrottle={16}>
            <View style={[commonStyles.container, { justifyContent: 'center' }]}>
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextFieldNew
                            placeholder="Текущий пароль"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                    name="oldPassword"
                />

                <Controller
                    control={control}
                    rules={{
                        minLength: 10,
                        required: true,
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextFieldNew
                            placeholder="Новый пароль"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                    name="newPassword"
                />

                <Controller
                    control={control}
                    rules={{
                        required: true,
                        minLength: 10,
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextFieldNew
                            placeholder="Повторите пароль"
                            secureTextEntry
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                    name="newPasswordCheck"
                />

                <Text style={[styles.requirements]}>
                    {
                        'Требования к паролю:\nПароль должен быть длиной не менее 10 символов, содержать латинские символы верхнего и нижнего региста, а также знаки пунктуации'
                    }
                </Text>

                <DefaultButton
                    disabled={!oldPassword || !newPassword || !newPasswordCheck}
                    onPress={onSendButtonPress}
                    text="Применить"
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    requirements: {
        fontSize: 13,
        color: '#BBBBBB',
        fontFamily: Fonts.TextRegular,
        marginTop: 20,
    },
})
export default connect(
    ({ auth, profile }) => ({
        auth,
        profile,
    }),
    {
        changePassword: shared.actions.changePassword,
        setError: shared.actions.error,
    }
)(PasswordChangeScreen)
