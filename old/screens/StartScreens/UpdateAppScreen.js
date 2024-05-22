import React, { useState, useEffect } from 'react'
import { Image, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import Warning from '../../../assets/oldImg/Warning.png'
import { version } from '../../../package.json'
import shared from '../../../store/index'
import DefaultButton from '../../components/buttons/DefaultButton'
import Spinner from '../../components/custom/Spinner'
import { Fonts } from '../../utils/Fonts'

const UpdateAppScreen = ({ fetchConfig, navigation }) => {
    const [config, setConfig] = useState(null)

    useEffect(() => {
        const handleFocus = () => {
            fetchConfig()
                .then(({ payload }) => {
                    const { config } = payload.data
                    if (version < config.lastBuild) {
                        console.log('ver ' + version, ' ' + config.lastBuild)
                        // setConfig(config);
                        // return;
                    }
                    navigation.navigate('SwitcherScreen')
                })
                .catch(() => {
                    navigation.navigate('SwitcherScreen')
                })
        }
        navigation.addListener('focus', handleFocus)
        return () => {
            navigation.removeListener('focus', handleFocus)
        }
    }, [navigation])

    const handleUpdateApp = () => {
        const { appStoreLink, googlePlayLink } = config
        Linking.openURL(Platform.OS === 'android' ? googlePlayLink : appStoreLink)
    }

    const handleUpdateLater = () => {
        navigation.navigate('SwitcherScreen')
    }

    const sameMajorChanging = () => {
        config.lastBuild.toString()[0] === version[0]
    }

    return config === null ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Spinner />
        </View>
    ) : (
        <View style={styles.wrapper}>
            <Text style={styles.title}>Доступно новое обновление</Text>
            <View style={{ flexDirection: 'row', width: 250, textAlign: 'left' }}>
                <Image style={styles.icon} source={Warning} />
                <Text style={styles.description}>
                    Необходимо обновить приложение для дальнейшей работы
                </Text>
            </View>
            <Text style={styles.contrastText}>Версия: {config.lastBuild}</Text>
            <Text style={styles.contrastText}>Основные изменения:</Text>
            <ScrollView style={styles.scroll} scrollEventThrottle={16}>
                <Text>{config.lastBuildDescription}</Text>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <DefaultButton
                    style={{ marginTop: 15 }}
                    textStyle={styles.textButton}
                    onPress={handleUpdateApp}
                    text="Обновить приложение"
                />
                {sameMajorChanging() && (
                    <DefaultButton
                        wrapperStyle={styles.defaultWrapper}
                        textStyle={[styles.textButton, { color: '#747E90' }]}
                        onPress={handleUpdateLater}
                        text="Обновить позже"
                    />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#F1EFF0',
    },
    buttonContainer: {
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: '#C0C0C0',
        marginTop: 8,
        marginBottom: 36,
        marginHorizontal: 20,
    },
    textButton: {
        fontFamily: Fonts.DisplayCompactRegular,
        fontSize: 16,
    },
    title: {
        padding: 16,
        color: '#000',
        fontFamily: Fonts.DisplayBold,
        fontSize: 20,
        fontWeight: '900',
        lineHeight: 26,
    },
    description: {
        color: '#747E90',
        fontFamily: Fonts.DisplayLight,
        fontSize: 14,
        textAlign: 'left',
    },
    contrastText: {
        paddingLeft: 16,
        color: '#000',
        fontSize: 14,
        lineHeight: 26,
    },
    icon: {
        width: 30,
        height: 30,
        margin: 16,
        marginTop: 4,
    },
    scroll: {
        paddingHorizontal: 16,
    },
    defaultWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#747E90',
        backgroundColor: '#F1EFF0',
        borderRadius: 3,
        fontSize: 16,
    },
})

export default connect(null, { fetchConfig: shared.actions.fetchConfig })(UpdateAppScreen)
