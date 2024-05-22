import React, { useEffect, useRef, useState } from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import EditableLabel from './EditablePaymentLabel'
import SplitLine from './SplitLine'

import CleaningIcon from '../../../assets/oldImg/Cleaning.png'
import DryCleaningIcon from '../../../assets/oldImg/Drycleaning.png'
import ParkingIcon from '../../../assets/oldImg/Parking.png'
import PdfDocIcon from '../../../assets/oldImg/PdfDoc.png'
import ReceiptBlueIcon from '../../../assets/oldImg/ReceiptBlue.png'
import TechnicalServicesIcon from '../../../assets/oldImg/TechnicalServices.png'
import UtilitiesIcon from '../../../assets/oldImg/Utilities.png'
import uri from '../../constants/Uri'
import { Fonts } from '../../utils/Fonts'
import DefaultButton from '../buttons/DefaultButton'
import Props from 'prop-types'
import Modal from 'react-native-modalbox'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const styles = StyleSheet.create({
    headerTitle: {
        marginBottom: 3,
        color: '#111',
        fontFamily: 'SFCompactDisplay-SemiBold',
        fontSize: 16,
    },
    headerDescription: {
        color: '#8E97A8',
        fontFamily: 'SFCompactDisplay-Light',
        fontSize: 12,
    },
    headerTextContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 18,
    },
    headerContainer: {
        zIndex: 100,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 27,
        color: '#747E90',
        fontFamily: 'SFUIText-Light',
        fontSize: 14,
    },
    contentContainer: {
        width: '100%',
    },
    itemContentContainer: {
        justifyContent: 'flex-start',
    },
    informationBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
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
    itemTextInformation: {
        color: '#111',
        fontFamily: 'SFUIText-Light',
        fontSize: 16,
        marginLeft: 19,
    },
    modal: {
        width: '100%',
        height: 'auto',
        bottom: 0,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingHorizontal: 16,
    },
    bottomSplitLine: {
        marginTop: 18,
        marginBottom: 16,
    },
    topSplitLine: {
        marginTop: 23,
        marginBottom: 9,
    },
    defaultButton: {
        marginTop: 0,
        marginBottom: 16,
    },
    textStyleDefaultButton: {
        fontSize: 14,
    },
    swiperLine: {
        position: 'absolute',
        width: 40,
        height: 2,
        alignSelf: 'center',
        marginTop: 9,
        backgroundColor: '#C4C7CF',
        borderRadius: 3,
    },
    pdfName: {
        marginLeft: 10,
        color: '#111111',
        fontFamily: 'SFUIText-Light',
        fontSize: 16,
    },
    pdfIcon: {
        width: 32,
        height: 32,
    },
    pdfWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cleaningIcon: {
        width: 24.39,
        height: 24,
    },
    dryCleaningIcon: {
        width: 32,
        height: 22.38,
    },
    technicalServicesIcon: {
        width: 24,
        height: 24,
    },
    parkingIcon: {
        width: 32,
        height: 14.67,
    },
    utilitiesIcon: {
        width: 26.34,
        height: 26.34,
        tintColor: '#111',
    },
    pdfContainer: {
        marginBottom: 20,
    },
    paymentsSystems: {
        width: 265,
        height: 45,
        marginTop: 8,
    },
    buttonPaymentsRules: {
        marginTop: 37,
        marginBottom: 8,
    },
    buttonText: {
        color: '#747E90',
        fontFamily: Fonts.DisplayLight,
        fontSize: 14,
        lineHeight: 16,
    },
    informationIconStyle: {
        width: 32,
        height: 32,
    },
})

const AnimatedBottomSheet = ({
    isOpen,
    paymentInfo,
    onClosed,
    onPdfButtonClick,
    onMakePaymentPress,
    navigation,
}) => {
    const bottomSheetRef = useRef()
    const [isProgress] = useState(false)
    const [isAmountEditable, setIsAmountEditable] = useState(false)
    const [amount, setAmount] = useState(paymentInfo.price)
    const [isCheckValue, setCheckValue] = useState(true)

    useEffect(() => {
        setAmount(paymentInfo.price)
    }, [paymentInfo])

    let categoryIcon = {}
    let categoryIconStyle = {}

    const { serviceCode } = paymentInfo
    const isUtilityItem = serviceCode === 'UTILITY_BILLS'

    switch (serviceCode) {
        case 'UTILITY_BILLS':
            categoryIcon = UtilitiesIcon
            categoryIconStyle = styles.utilitiesIcon
            break
        case 'CLEANING':
            categoryIcon = CleaningIcon
            categoryIconStyle = styles.cleaningIcon
            break
        case 'DRY_CLEANING':
            categoryIcon = DryCleaningIcon
            categoryIconStyle = styles.dryCleaningIcon
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

    useEffect(() => {
        if (isOpen) {
            bottomSheetRef.current.open()
        } else {
            bottomSheetRef.current.close()
        }
    }, [isOpen])

    const handleModalClose = () => {
        setAmount(undefined)
        if (onClosed) {
            onClosed()
        }
    }

    const handleRejectAmountChange = () => {
        setIsAmountEditable(false)
    }

    const handleAcceptAmountChange = (newAmountValue) => {
        setAmount(newAmountValue)
        setIsAmountEditable(false)
    }

    const handleAcceptPaymentClick = () => {
        onMakePaymentPress({
            id: paymentInfo.billId,
            amount,
        })
        bottomSheetRef.current.close()
    }

    const handleAmountClick = () => {
        setIsAmountEditable(true)
    }

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Image source={categoryIcon} style={categoryIconStyle} />
            <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>{paymentInfo.residence || ''}</Text>
                <Text style={styles.headerDescription}>{paymentInfo.serviceName || ''}</Text>
            </View>
        </View>
    )

    const renderContent = () => (
        <View style={styles.contentContainer}>
            <View style={styles.itemContentContainer}>
                <EditableLabel
                    minValue={1}
                    maxValue={500000}
                    amount={amount}
                    editable={isUtilityItem}
                    onClick={handleAmountClick}
                    onReject={handleRejectAmountChange}
                    onAccept={handleAcceptAmountChange}
                    setCheckValue={setCheckValue}
                />
            </View>
            {!isUtilityItem && (
                <View style={styles.itemContentContainer}>
                    <Text style={styles.itemTextTitle}>Статус</Text>
                    <Text style={styles.itemTextDescription}>{paymentInfo.statusName || ''}</Text>
                    <Text style={styles.itemTextTitle}>Квитанция</Text>
                    <TouchableOpacity
                        style={styles.informationBlock}
                        onPress={() =>
                            onPdfButtonClick(paymentInfo.billId, paymentInfo.receiptNumber)
                        }>
                        <Image source={ReceiptBlueIcon} style={styles.informationIconStyle} />
                        <Text style={styles.itemTextInformation}>Квитанция</Text>
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity
                style={styles.buttonPaymentsRules}
                onPress={() =>
                    navigation.navigate('PdfViewScreen', {
                        fileLink: uri.paymentRulesFileLink,
                        title: 'Правила оплаты',
                    })
                }>
                <Text style={styles.buttonText}>Правила оплаты</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('PdfViewScreen', {
                        fileLink: uri.returnPolicyFileLink,
                        title: 'Правила оплаты',
                    })
                }>
                <Text style={styles.buttonText}>Правила возврата</Text>
            </TouchableOpacity>
        </View>
    )

    const { bottom } = useSafeAreaInsets()

    return (
        <Modal
            style={[styles.modal, { paddingBottom: bottom }]}
            {...(Platform.OS === 'ios' && { coverScreen: true })}
            backdropOpacity={0.4}
            swipeThreshold={1}
            onClosed={handleModalClose}
            position="bottom"
            ref={bottomSheetRef}>
            <View style={styles.swiperLine} />
            {renderHeader()}
            <SplitLine style={styles.topSplitLine} />
            {renderContent()}
            <SplitLine style={styles.bottomSplitLine} />
            {paymentInfo?.isPaymentPaid ? (
                paymentInfo.paymentReceiptLink && (
                    <View style={styles.pdfContainer}>
                        <Text style={styles.itemTextTitle}>Квитанция</Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('PdfViewScreen', {
                                    fileLink: paymentInfo.paymentReceiptLink,
                                    title: `Квитанция №${paymentInfo.billId}`,
                                })
                            }>
                            <View style={styles.pdfWrapper}>
                                <Image style={styles.pdfIcon} source={PdfDocIcon} />
                                <Text
                                    style={
                                        styles.pdfName
                                    }>{`Квитанция №${paymentInfo.receiptNumber}.pdf`}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            ) : (
                <DefaultButton
                    disabled={isAmountEditable || !isCheckValue}
                    style={styles.defaultButton}
                    textStyle={styles.textStyleDefaultButton}
                    onPress={handleAcceptPaymentClick}
                    isShowLoader={isProgress}
                    text="Внести оплату"
                />
            )}
        </Modal>
    )
}

AnimatedBottomSheet.propTypes = {
    isOpen: Props.bool.isRequired,
    onMakePaymentPress: Props.func.isRequired,
    onPdfButtonClick: Props.func.isRequired,
    onClosed: Props.func.isRequired,
    paymentInfo: Props.shape({
        paymentReceiptLink: Props.string,
        serviceName: Props.string,
        serviceCode: Props.string,
        isPaymentPaid: Props.bool,
        billId: Props.number.isRequired,
        receiptNumber: Props.string,
        residence: Props.string.isRequired,
        price: Props.node,
        statusName: Props.string,
    }).isRequired,
}

export default AnimatedBottomSheet
