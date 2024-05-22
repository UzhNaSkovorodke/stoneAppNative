import React from 'react'
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import SplitLine from './SplitLine'

import InWorkIcon from '../../../assets/oldImg/InWork.png'
import PaidIcon from '../../../assets/oldImg/Paid.png'
import PrepaymentMadeIcon from '../../../assets/oldImg/PrepaymentMade.png'
import { Fonts } from '../../utils/Fonts'
import moment from 'moment'

export default function AppealsComponent({
    date,
    eventStatusName,
    onPress,
    eventStatusCode,
    eventTypeName,
}) {
    let sourceImage

    switch (eventStatusCode) {
        case 'IN_PROCESSING':
            sourceImage = PrepaymentMadeIcon
            break

        case 'CLOSED':
            sourceImage = PaidIcon
            break

        case 'IN_WORK':
            sourceImage = InWorkIcon
            break

        default:
    }

    return (
        <View style={styles.cell}>
            <TouchableHighlight underlayColor="#E8E8E8" onPress={onPress} style={styles.wrapper}>
                <>
                    <Text style={styles.date}>{moment(date).format('DD.MM.YYYY')}</Text>
                    <Text style={styles.label}>{eventTypeName}</Text>

                    <SplitLine style={styles.splitLine} />

                    <View style={styles.statusWrapper}>
                        <Text style={styles.statusLabel}>Статус</Text>
                        <View style={styles.statusContainer}>
                            <Text style={styles.text}>{eventStatusName}</Text>
                            <Image style={styles.statusIcon} source={sourceImage} />
                        </View>
                    </View>
                </>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    cell: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#B7B7B7',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    text: {
        marginRight: 16,
        color: '#8E97A8',
        fontFamily: Fonts.TextRegular,
        fontSize: 14,
    },
    wrapper: {
        paddingTop: 24,
        paddingBottom: 13,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 16,
    },
    statusWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        color: '#111111',
        fontFamily: Fonts.DisplayCompactSemiBold,
        fontSize: 16,
    },
    category: {
        color: '#8E97A8',
        fontFamily: Fonts.DisplayCompactLight,
        fontSize: 12,
    },
    date: {
        marginBottom: 7,
        color: '#8E97A8',
        fontFamily: Fonts.DisplayCompactLight,
        fontSize: 12,
    },
    statusLabel: {
        marginLeft: 2,
        color: '#8E97A8',
        fontFamily: Fonts.TextRegular,
        fontSize: 14,
    },
    statusIcon: {
        width: 32,
        height: 32,
    },
    splitLine: {
        borderBottomColor: '#F5F5F7',
        marginTop: 8,
        marginBottom: 9,
    },
})
