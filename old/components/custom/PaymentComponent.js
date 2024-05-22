import React from 'react'
import { Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'

import SplitLine from './SplitLine'

import CleaningIcon from '../../../assets/oldImg/Cleaning.png'
import DryCleaningIcon from '../../../assets/oldImg/Drycleaning.png'
import ExclamationMark from '../../../assets/oldImg/ExclamationMark.png'
import PaidIcon from '../../../assets/oldImg/Paid.png'
import ParkingIcon from '../../../assets/oldImg/Parking.png'
import PrepaymentMadeIcon from '../../../assets/oldImg/PrepaymentMade.png'
import ReceiptIcon from '../../../assets/oldImg/Receipt.png'
import ReceiptBlueIcon from '../../../assets/oldImg/ReceiptBlue.png'
import TechnicalServicesIcon from '../../../assets/oldImg/TechnicalServices.png'
import UtilitiesIcon from '../../../assets/oldImg/Utilities.png'
import WaitingPaymentIcon from '../../../assets/oldImg/WaitingPayment.png'
import WaitingPaymentInvertedIcon from '../../../assets/oldImg/WaitingPaymentInverted.png'
import { Fonts } from '../../utils/Fonts'
import { normalizePrice } from '../../utils/Utils'
import { SwipeRow } from 'react-native-swipe-list-view'

const styles = StyleSheet.create({
    text: {
        marginRight: 16,
        color: '#8E97A8',
        fontFamily: Fonts.TextRegular,
        fontSize: 14,
    },
    cell: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        marginHorizontal: 8,
        shadowColor: '#B7B7B7',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    wrapper: {
        paddingTop: 24,
        paddingBottom: 13,
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        paddingHorizontal: 16,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paymentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginBottom: 3,
        color: '#111111',
        fontFamily: Fonts.DisplayCompactSemiBold,
        fontSize: 16,
    },
    category: {
        color: '#8E97A8',
        fontFamily: Fonts.DisplayCompactLight,
        fontSize: 12,
    },
    price: {
        marginBottom: 3,
        color: '#111111',
        fontFamily: Fonts.DisplayCompactSemiBold,
        fontSize: 16,
        textAlign: 'right',
    },
    date: {
        color: '#8E97A8',
        fontFamily: Fonts.DisplayCompactLight,
        fontSize: 12,
        textAlign: 'right',
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
    splitline: {
        borderBottomColor: '#F5F5F7',
        marginTop: 22,
        marginBottom: 9,
    },
    cleaningIcon: {
        width: 24.39,
        height: 24,
        marginRight: 21.6,
        marginLeft: 0,
    },
    drycleaningIcon: {
        width: 32,
        height: 22.38,
        marginRight: 14,
        marginLeft: 0,
    },
    fastPaymentIcon: {
        width: 3,
        height: 19,
    },
    technicalServicesIcon: {
        width: 24,
        height: 24,
        marginRight: 18,
        marginLeft: 4,
    },
    parkingIcon: {
        width: 32,
        height: 14.67,
        marginRight: 14,
        marginLeft: 0,
    },
    utilitiesIcon: {
        width: 26.34,
        height: 26.34,
        marginRight: 16.6,
        marginLeft: 4,
    },
    utilitiesBlackIcon: {
        width: 26.34,
        height: 26.34,
        marginRight: 16.6,
        marginLeft: 4,
        tintColor: '#000',
    },
    swipeContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        backgroundColor: '#66C464',
        borderRadius: 3,
    },
    itemSwipeContainer: {
        height: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        paddingTop: 28,
        paddingBottom: 17,
        backgroundColor: '#66C464',
        borderRadius: 3,
        paddingHorizontal: 29,
    },
    circleSwipeContainer: {
        width: 32,
        height: 32,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 17,
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
    },
    circleSwipeText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    },
    defaultIcon: {
        width: 46,
        height: 30,
    },
    receiptIcon: {
        width: 20,
        height: 32,
        resizeMode: 'cover',
    },
    receiptButton: {
        width: 45,
    },
    titleContainer: {
        flex: 1,
        paddingRight: 6,
    },
    paymentContainer: {
        flex: 0,
    },
})

export default class extends React.Component {
    getUtilityBillsParams = () => ({
        categoryIcon: UtilitiesIcon,
        categoryIconStyle: styles.utilitiesIcon,
        statusText: 'Оплатить',
        statusIcon: WaitingPaymentInvertedIcon,
    })

    getAdditionalBillsParams = ({ category, statusId }) => {
        let statusText = ''
        let statusIcon = {}
        let categoryIcon = {}
        let categoryIconStyle = styles.defaultIcon

        switch (category.code) {
            case 'CLEANING':
                categoryIcon = CleaningIcon
                categoryIconStyle = styles.cleaningIcon
                break
            case 'DRY_CLEANING':
                categoryIcon = DryCleaningIcon
                categoryIconStyle = styles.drycleaningIcon
                break
            case 'TECHNICAL_SERVICES':
                categoryIcon = TechnicalServicesIcon
                categoryIconStyle = styles.technicalServicesIcon
                break
            case 'PARKING':
                categoryIcon = ParkingIcon
                categoryIconStyle = styles.parkingIcon
                break

            default:
                break
        }

        switch (statusId) {
            case 1:
                statusText = 'Оплачено'
                statusIcon = PaidIcon
                break
            case 2:
                statusText = 'Оплатить'
                statusIcon = WaitingPaymentIcon
                break
            case 3:
                statusText = 'Внесена предоплата'
                statusIcon = PrepaymentMadeIcon
                break
            default:
                break
        }

        return {
            categoryIcon,
            categoryIconStyle,
            statusText,
            statusIcon,
        }
    }

    render() {
        const {
            statusId,
            total,
            category,
            onPress,
            onSwiped,
            projectTitle,
            isUtilityItem,
            swipeGestureBegan,
            onRowClose,
            onReceiptClick,
        } = this.props

        const { categoryIcon, categoryIconStyle, statusText, statusIcon } = isUtilityItem
            ? this.getUtilityBillsParams()
            : this.getAdditionalBillsParams({ category, statusId })

        const categoryName = isUtilityItem ? 'Задолженность по л/с' : category.name

        return (
            <View style={styles.cell}>
                <View>
                    <SwipeRow
                        disableRightSwipe
                        disableLeftSwipe={statusId !== 2}
                        rightOpenValue={0.1}
                        friction={9}
                        forceCloseToRightThreshold={1}
                        swipeToOpenPercent={30}
                        swipeGestureBegan={swipeGestureBegan}
                        onRowOpen={onSwiped}
                        onRowClose={onRowClose}>
                        <View style={styles.swipeContainer}>
                            <View style={styles.itemSwipeContainer}>
                                <View style={styles.circleSwipeContainer}>
                                    <Image
                                        style={styles.fastPaymentIcon}
                                        source={ExclamationMark}
                                    />
                                </View>
                                <Text style={styles.circleSwipeText}>{'Мгновенная\nоплата'}</Text>
                            </View>
                        </View>
                        <TouchableHighlight
                            underlayColor="#D7D7D7"
                            onPress={onPress}
                            style={[
                                styles.wrapper,
                                isUtilityItem && { backgroundColor: '#747E90' },
                            ]}>
                            <>
                                <View style={styles.paymentWrapper}>
                                    <Image style={categoryIconStyle} source={categoryIcon} />
                                    <View style={styles.container}>
                                        <View style={styles.titleContainer}>
                                            <Text
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                                style={[
                                                    styles.label,
                                                    isUtilityItem && { color: '#FFFFFF' },
                                                ]}>
                                                {projectTitle}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.category,
                                                    isUtilityItem && { color: '#C4C7CF' },
                                                ]}>
                                                {categoryName}
                                            </Text>
                                        </View>
                                        <View style={styles.paymentContainer}>
                                            <Text
                                                style={[
                                                    styles.price,
                                                    isUtilityItem && { color: '#FFFFFF' },
                                                ]}>
                                                {`${normalizePrice(total)} руб.`}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <SplitLine
                                    style={[
                                        styles.splitline,
                                        isUtilityItem && { borderBottomColor: '#F5F5F770' },
                                    ]}
                                />

                                <View style={styles.statusWrapper}>
                                    <TouchableOpacity
                                        onPress={onReceiptClick}
                                        style={styles.receiptButton}>
                                        <Image
                                            style={[styles.receiptIcon]}
                                            source={isUtilityItem ? ReceiptIcon : ReceiptBlueIcon}
                                        />
                                    </TouchableOpacity>
                                    <View style={styles.statusContainer}>
                                        <Text
                                            style={[
                                                styles.text,
                                                isUtilityItem && { color: '#FFFFFF' },
                                            ]}>
                                            {statusText}
                                        </Text>
                                        <Image style={styles.statusIcon} source={statusIcon} />
                                    </View>
                                </View>
                            </>
                        </TouchableHighlight>
                    </SwipeRow>
                </View>
            </View>
        )
    }
}
