import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'

import shared from '../../../store/index'
import DefaultButton from '../../components/buttons/DefaultButton'
import TextFieldNew from '../../components/custom/TextFieldNew'
import { Controller, useForm } from 'react-hook-form'

const EditProfileScreen = ({ navigation, setSuccess, editProfile, route }) => {
    const { control, getValues } = useForm({
        defaultValues: {
            fio: route.params.profileFio,
            phone: route.params.phoneNumber,
            email: route.params.profileEmail,
        },
    })

    const [isProgress, setIsProgress] = useState(false)

    const sendChangesButtonPress = () => {
        setIsProgress(true)
        const values = getValues()

        editProfile({
            fio: values.fio.replace('"', '\\"'),
            phone: values.phone,
            email: values.email,
        })
            .then(() => {
                setSuccess([
                    {
                        message: 'Ваша заявка принята, следите за статусом в разделе «обращения»',
                    },
                ])
                navigation.goBack()
            })
            .finally(() => setIsProgress(false))
    }

    return (
        <View style={styles.mainWrapper}>
            <ScrollView scrollEventThrottle={16}>
                <View style={styles.wrapper}>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextFieldNew
                                placeholder="Фио"
                                keyboardType="default"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                        name="fio"
                    />

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextFieldNew
                                isPhoneMask
                                placeholder="Телефон"
                                keyboardType="phone-pad"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                        name="phone"
                    />

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextFieldNew
                                placeholder="Электронная почта"
                                keyboardType="email-address"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                        name="email"
                    />
                </View>
            </ScrollView>
            <View style={styles.buttonWrapper}>
                <DefaultButton
                    isShowLoader={isProgress}
                    disabled={isProgress}
                    text="Отправить заявку на изменения"
                    onPress={sendChangesButtonPress}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        paddingBottom: 120,
        paddingHorizontal: 16,
    },
    buttonWrapper: {
        position: 'absolute',
        bottom: 32,
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: 16,
    },
})

export default connect(null, {
    setSuccess: shared.actions.success,
    editProfile: shared.actions.editProfileRequest,
})(EditProfileScreen)
