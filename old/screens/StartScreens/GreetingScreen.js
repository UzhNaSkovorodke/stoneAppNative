import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import StoneHedge from '../../../assets/oldImg/StoneHedge.png'
import shared from '../../../store/index'
import Spinner from '../../components/custom/Spinner'
import { Fonts } from '../../utils/Fonts'
import reportError from '../../utils/ReportError'
import { useFocusEffect } from '@react-navigation/native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
        marginBottom: 140,
    },
    helloText: {
        marginTop: 53.7,
        marginBottom: 16,
        color: '#747E90',
        fontFamily: Fonts.TextLight,
        fontSize: 26,
    },
    fioText: {
        marginBottom: 33,
        color: '#747E90',
        fontFamily: Fonts.TextLight,
        fontSize: 16,
    },
    image: {
        width: '100%',
        resizeMode: 'contain',
        tintColor: '#222221',
    },
})

const GreetingScreen = ({
    route,
    navigation,
    fetchProjects,
    getNotifications,
    fetchAppealTypes,
    fetchEventTypes,
    fetchFundsFlowTypes,
}) => {
    const loadAllDict = () => {
        Promise.all([
            fetchProjects(),
            getNotifications({ page: 0, showAll: false }),
            fetchAppealTypes(),
            fetchEventTypes(),
            fetchFundsFlowTypes(),
        ])
            .then(() => {
                navigation.navigate('TabNavigator', { screen: 'HomeScreen' })
            })
            .catch((error) => {
                reportError(error, 'GreetingScreen')
                navigation.goBack()
            })
    }

    useFocusEffect(
        React.useCallback(() => {
            loadAllDict()
        }, [])
    )

    const getTimeTitle = () => {
        const hours = new Date().getHours()

        switch (true) {
            case hours >= 6 && hours < 12:
                return 'Доброе утро,'
            case hours >= 12 && hours < 18:
                return 'Добрый день,'
            case hours >= 18 && hours < 24:
                return 'Добрый вечер,'
            case hours >= 0 && hours < 6:
                return 'Доброй ночи,'
            default:
                return ''
        }
    }

    const { fio } = route.params

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={StoneHedge} />
            <Text style={styles.helloText}>{getTimeTitle()}</Text>
            <Text style={styles.fioText}>{fio}</Text>
            <Spinner />
        </View>
    )
}

export default connect(null, {
    fetchProjects: shared.actions.fetchProjects,
    getNotifications: shared.actions.fetchNotifications,
    fetchAppealTypes: shared.actions.fetchAppealTypes,
    fetchEventTypes: shared.actions.fetchEventTypes,
    fetchFundsFlowTypes: shared.actions.fetchFundsFlowTypes,
    setError: shared.actions.error,
})(GreetingScreen)
