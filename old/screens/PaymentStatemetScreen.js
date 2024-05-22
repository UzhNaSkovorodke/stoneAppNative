import React, { useCallback, useEffect, useState } from 'react'
import { Image, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import NegativePaymentIcon from '../../assets/oldImg/NegativePayment.png'
import PositivePaymentIcon from '../../assets/oldImg/PositivePayment.png'

import Spinner from '../components/custom/Spinner'

import shared from '../../store/index'
import { Fonts } from '../utils/Fonts'
import reportError from '../utils/ReportError'
import { normalizePrice } from '../utils/Utils'
import moment from 'moment'

const colorText1Styles = '#747E90'
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#F7F7F9',
    },
    cell: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        marginHorizontal: 8,
        shadowColor: '#B7B7B7',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    paymentCellContainer: {
        height: 63,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 16,
        paddingHorizontal: 16,
    },
    paymentImageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentCellImage: {
        width: 26,
        height: 26,
        marginRight: 16,
    },
    paymentCellTitle: {
        fontFamily: Fonts.DisplayRegular,
        fontSize: 16,
    },
    paymentCellTotal: {
        fontSize: 16,
    },
    monthTitle: {
        marginTop: 8,
        marginBottom: 8,
        color: colorText1Styles,
        fontFamily: Fonts.DisplayLight,
        fontSize: 12,
        marginHorizontal: 8,
        textTransform: 'capitalize',
    },
    emptyTextStyle: {
        alignSelf: 'center',
        marginTop: 20,
        color: '#111111',
        fontSize: 15,
    },
    emptyPaymentsWrapper: {
        flex: 1,
        backgroundColor: '#F7F7F9',
    },
    sectionList: {
        flex: 1,
        paddingHorizontal: 8,
    },
    footerView: {
        height: 70,
    },
    spinLoader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7F7F9',
    },
})

const getDefaultFilter = (roomId) => ({
    roomId,
    pageNumber: 0,
    pageSize: 10,
})

const ENROLMENT_TYPE = 1
const PAYMENT_TYPE = 2

const FLOW_TYPE_ICONS = {
    [ENROLMENT_TYPE]: PositivePaymentIcon,
    [PAYMENT_TYPE]: NegativePaymentIcon,
}

const PaymentStatementScreen = ({
    route: {
        params: { roomId, roomName },
    },
    navigation,
    flowTypeNames,
    fetchPayments,
    setSuccess,
}) => {
    const [payments, setPayments] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [filter, setFilter] = useState(getDefaultFilter(roomId))

    const sectionList = React.createRef()

    const loadPayments = useCallback(
        (paymentFilter) => {
            fetchPayments(paymentFilter)
                .then((response) => {
                    const responseData = response.payload.data.getFundsFlow
                    setPayments((payments) =>
                        !payments.length && !responseData.flow.length
                            ? null
                            : payments.concat(responseData.flow)
                    )
                })
                .finally(() => setLoading(false))
                .catch((error) => reportError(error, 'PaymentStatement/updatePayments'))
        },
        [fetchPayments]
    )

    useEffect(() => {
        loadPayments(filter)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.pageNumber, loadPayments])

    const updatePayments = useCallback((currentPage = 0) => {
        const pageNumber = Number(currentPage.toFixed(0))
        setFilter((currentFilter) => ({ ...currentFilter, pageNumber }))
        if (pageNumber === 0) {
            setLoading(true)
        }
    }, [])

    useEffect(() => {
        updatePayments()
    }, [])

    const handlePaymentClick = ({ fileLink, flowType }) => {
        const pdfTitle = flowType === ENROLMENT_TYPE ? `Квитанция ${roomName}` : `Чек ${roomName}`
        navigation.navigate('PdfViewScreen', { fileLink, title: pdfTitle })
    }

    if (isLoading) {
        return (
            <View style={styles.spinLoader}>
                <Spinner />
            </View>
        )
    }

    if (!payments) {
        return (
            <View style={styles.emptyPaymentsWrapper}>
                <Text style={styles.emptyTextStyle}>Квитанции отсутствуют.</Text>
            </View>
        )
    }

    const groupedByMonth = payments?.reduce((result, value) => {
        const index = result.findIndex(({ title }) => moment(title).isSame(value.date, 'month'))
        if (index === -1) {
            return result.concat({
                title: value.date,
                data: [value],
            })
        }
        result[index].data.push(value)
        return result
    }, [])

    const renderItem = ({ item }) => (
        <View style={styles.cell}>
            <TouchableOpacity
                disabled={item.fileLink == null}
                onPress={() => handlePaymentClick(item)}>
                <View style={styles.paymentCellContainer}>
                    <View style={styles.paymentImageContainer}>
                        <Image
                            style={styles.paymentCellImage}
                            source={FLOW_TYPE_ICONS[item.flowType]}
                        />
                        <Text style={styles.paymentCellTitle}>{flowTypeNames[item.flowType]}</Text>
                    </View>
                    <Text>
                        {`${item.flowType === PAYMENT_TYPE ? '-' : ''}${normalizePrice(
                            Math.abs(item.total)
                        )} руб.`}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )

    const onEndReached = () => {
        if (payments.length < filter.pageSize || isLoading) {
            return
        }
        if (payments.length % filter.pageSize !== 0) {
            setSuccess([{ message: 'Мы загрузили все счета.' }])
        } else {
            updatePayments(payments.length / filter.pageSize)
        }
    }

    return (
        <View style={styles.wrapper}>
            <SectionList
                ref={sectionList}
                stickySectionHeadersEnabled={false}
                style={styles.sectionList}
                sections={groupedByMonth}
                renderItem={renderItem}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.monthTitle}>
                        {moment(section.title).format('MMMM, YYYY')}
                    </Text>
                )}
                ListFooterComponent={() => <View style={styles.footerView} />}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.3}
            />
        </View>
    )
}

export default connect(
    ({ projects, dicts }) => ({
        projects: projects.list,
        flowTypeNames: dicts.fundsFlowTypes.reduce(
            (acc, { id, name }) => ({ ...acc, [id]: name }),
            {}
        ),
    }),
    {
        fetchPayments: shared.actions.fetchFundsFlow,
        setError: shared.actions.error,
        setSuccess: shared.actions.success,
    }
)(PaymentStatementScreen)
