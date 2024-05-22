import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import BuildPass from '../../assets/oldImg/Building.png'
import DeliveryPass from '../../assets/oldImg/DeliveryImage.png'
import GuestPass from '../../assets/oldImg/GuestImage.png'
import LargeSizePass from '../../assets/oldImg/LargeSize.png'
import TaxiPass from '../../assets/oldImg/TaxiImage.png'

import ClickBtn from '../components/custom/ClickBtn'

import { Fonts } from '../utils/Fonts'

const APPEAL_TYPES = {
    GUEST: 1,
    TAXI: 2,
    DELIVERY: 4,
    LARGE: 6,
    BUILDING: 7,
}

const SelectPassOrderScreen = ({ navigation, eventTypes, projects }) => {
    const navigateToScreen = (screenName) => () => {
        navigation.navigate(screenName)
    }

    const appealButtonsProps = [
        {
            image: DeliveryPass,
            text: 'Доставка',
            onClick: navigateToScreen('CreateEventDeliveryPassScreen'),
            style: styles.deliveryPass,
            appealType: APPEAL_TYPES.DELIVERY,
        },
        {
            image: TaxiPass,
            text: 'Такси',
            onClick: navigateToScreen('CreateEventTaxiPassOrderScreen'),
            style: styles.taxiPass,
            appealType: APPEAL_TYPES.TAXI,
        },
        {
            image: GuestPass,
            text: 'Гость',
            onClick: navigateToScreen('CreateEventGuestPassOrderScreen'),
            style: styles.guestPass,
            appealType: APPEAL_TYPES.GUEST,
        },
        {
            image: BuildPass,
            text: 'Доставка стройматериалов',
            onClick: navigateToScreen('CreateEventBuildingDeliveryPassScreen'),
            style: styles.buildingPass,
            appealType: APPEAL_TYPES.BUILDING,
        },
        {
            image: LargeSizePass,
            text: 'Доставка \n габаритных грузов',
            onClick: navigateToScreen('CreateEventLargeSizeDeliveryPassScreen'),
            style: styles.largeSizePass,
            appealType: APPEAL_TYPES.LARGE,
        },
    ]

    const renderVisibleAppealButtons = (buttonsProps) =>
        buttonsProps.map((props, index) => (
            <ClickBtn
                key={index}
                onPress={() => props.onClick()}
                imgSrc={props.image}
                imgStyle={props.style}
                title={props.text}
            />
        ))

    const appealButtons = renderVisibleAppealButtons(appealButtonsProps)

    if (appealButtons.length === 0) {
        return (
            <View style={styles.emptyTextContainer}>
                <Text style={styles.emptyText}>Заказ пропусков недоступен для ваших проектов</Text>
            </View>
        )
    }

    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>Выберите категорию для заказа пропуска</Text>
            <View style={styles.buttonsContainer}>{appealButtons}</View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F7F7F9',
    },
    label: {
        maxWidth: 260,
        marginBottom: 39,
        color: '#111111',
        fontFamily: Fonts.DisplayBold,
        fontSize: 18,
    },
    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    deliveryPass: {
        width: 49.48,
        height: 40,
    },
    taxiPass: {
        width: 60,
        height: 41,
    },
    guestPass: {
        width: 48,
        height: 40,
    },
    buildingPass: {
        width: 48,
        height: 40,
    },
    largeSizePass: {
        width: 60,
        height: 41,
    },
    emptyText: {
        color: '#747E90',
        fontFamily: Fonts.DisplayLight,
        fontSize: 12,
        textAlign: 'center',
    },
    emptyTextContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shadowButton: {
        shadowColor: '#dedede',
        elevation: 5,
        shadowOpacity: 0.25,
        flexBasis: '48%',
        marginBottom: 16,
        borderRadius: 3,
        backgroundColor: '#ffffff',
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
    },
})

export default connect(({ dicts, projects }) => ({
    eventTypes: dicts.eventType,
    projects: projects.list,
}))(SelectPassOrderScreen)
