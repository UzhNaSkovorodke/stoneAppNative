import React from 'react'
import { FlatList, SectionList, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import AnimatedBottomSheet from '../components/custom/AnimatedBottomSheet'
import FilterAdditionalBills from '../components/custom/FilterAdditionalBills'
import PaymentComponent from '../components/custom/PaymentComponent'
import Spinner from '../components/custom/Spinner'

import shared from '../../store/index'
import { Fonts } from '../utils/Fonts'
import reportError from '../utils/ReportError'
import moment from 'moment'

const colorText1Styles = '#747E90'
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#F7F7F9',
    },
    cellTitle: {
        marginBottom: 10,
        color: '#111111',
        fontFamily: Fonts.DisplayCompactSemiBold,
        fontSize: 16,
    },
    cellDate: {
        marginBottom: 23,
        color: colorText1Styles,
        fontFamily: Fonts.DisplayCompactLight,
        fontSize: 10,
    },
    cellTotal: {
        color: colorText1Styles,
        fontFamily: Fonts.TextLight,
        fontSize: 14,
    },
    monthTitle: {
        marginTop: 32,
        marginBottom: 16,
        color: colorText1Styles,
        fontFamily: Fonts.DisplayLight,
        fontSize: 12,
        marginHorizontal: 8,
        textTransform: 'capitalize',
    },
    filter: {
        width: 20.6,
        height: 20.4,
        marginEnd: 20,
        tintColor: '#111111',
    },
    applyFilter: {
        width: 240,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colorText1Styles,
        borderRadius: 25,
    },
    emptyTextStyle: {
        marginTop: 13,
        color: '#111111',
        fontSize: 16,
        fontFamily: Fonts.PFEncoreSansPro,
        lineHeight: 24,
        marginLeft: 23,
        marginBottom: 16,
    },
    shadow: {
        width: 240,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        shadowColor: '#B7B7B7',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    filterWrapper: {
        position: 'absolute',
        bottom: 32,
        width: '100%',
        alignItems: 'center',
    },
    emptyPaymentsWrapper: {
        flex: 1,
        backgroundColor: '#F7F7F9',
    },
    filterButton: {
        borderRadius: 25,
    },
    filterTextButton: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    sectionList: {
        flex: 1,
        paddingHorizontal: 8,
    },
    footerView: {
        height: 70,
    },
    spinloader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7F7F9',
    },
    utilityFlatList: {
        marginTop: 15,
    },
})

class PaymentsScreen extends React.Component {
    sectionList = React.createRef()

    constructor(props) {
        super(props)
        const { params } = props.route
        const projects = params && params.projectId ? [{ id: params.projectId, roomId: [] }] : []
        this.updateBills = this.updateBills.bind(this)

        const defaultFilter = {
            statusId: 2,
            startAt: moment().subtract(1, 'month').startOf('month').toISOString(),
            endAt: moment().endOf('month').endOf().toISOString(),
            projects,
            page: 0,
            size: 10,
        }

        this.state = {
            data: [],
            utilityBillData: [],
            filter: defaultFilter,
            isOpenedBottomSheet: false,
            isLoading: true,
            selectedItem: null,
        }

        props.route.params = {
            ...params,
            filter: defaultFilter,
        }
    }

    componentDidMount() {
        // TODO: Костыль для обновления данных
        const { navigation } = this.props
        this.updateBills()
        this.focusListenerUnsubscribe = navigation.addListener('focus', () => {
            this.setState({ isOpenedBottomSheet: false })
        })
    }

    componentWillUnmount() {
        this.focusListenerUnsubscribe()
    }

    onEndReached = () => {
        const { filter, data } = this.state
        const { setSuccess } = this.props

        if (data.length < 10) {
            return
        }

        if (data.length % filter.size !== 0) {
            setSuccess([{ message: 'Мы загрузили все счета.' }])
        } else {
            this.updateBills(data.length / filter.size)
        }
    }

    onTableViewCellClick(item) {
        this.setState({ isOpenedBottomSheet: true, selectedItem: item })
    }

    onPdfButtonClick(billId, receiptNumber) {
        const { fetchBill, navigation, setError } = this.props

        fetchBill({ billId })
            .then((response) => {
                this.setState({ isOpenedBottomSheet: false })
                const { fileLink } = response.payload.data.getBill
                navigation.navigate('PdfViewScreen', {
                    fileLink,
                    title: `Счет №${receiptNumber}`,
                })
            })
            .catch((error) => {
                reportError(error, 'Payments/onPdfButtonClick/fetchBill')
                setError([{ message: 'Извините, произошла ошибка.' }])
            })
    }

    handleUtilityBillsClick = ({ roomId, appartmentName }) => {
        const { navigation } = this.props
        navigation.navigate('PaymentStatementScreen', {
            roomId,
            roomName: appartmentName,
        })
    }

    handleMakePaymentClick =
        (item) =>
        ({ id, amount }) => {
            const { navigation } = this.props

            if (item.isUtilityItem) {
                navigation.navigate('BillPaymentScreen', {
                    room: {
                        roomId: id,
                        total: amount,
                    },
                })
                return
            }
            navigation.navigate('BillPaymentScreen', { billId: id })
        }

    keyExtractor = (item) => item.id.toString()

    getPaymentValue = (debt) => (debt <= 0 ? 1 : Math.abs(debt))

    getAvailableProjects = () => {
        const { fundsFlowProjectId } = this.props.route.params
        const { projects } = this.props
        if (!(typeof fundsFlowProjectId === 'number')) {
            return projects
        }

        return [projects.find(({ projectId }) => projectId === fundsFlowProjectId)]
    }

    getPaymentInfo = (item) => {
        if (!item) {
            return {}
        }

        const key = Date.now()

        if (item.isUtilityItem) {
            return {
                key,
                serviceName: 'Задолженность по л/c',
                serviceCode: 'UTILITY_BILLS',
                billId: item.roomId,
                residence: item.appartmentName,
                price: this.getPaymentValue(item.debt),
            }
        }

        return {
            key,
            paymentReceiptLink: item.paymentReceiptLink,
            serviceName: item.billCategory.name,
            serviceCode: item.billCategory.code,
            isPaymentPaid: item.status.statusId === 1,
            billId: item.billId,
            receiptNumber: item.receiptNumber,
            statusName: item.status && item.status.statusName,
            residence: item.project?.title,
            price: item.total,
        }
    }

    fetchRooms = async (rooms = [], projectName = '') => {
        try {
            const { fetchRoom } = this.props

            const roomsResponse = await Promise.all(
                rooms.map(({ roomId }) => fetchRoom({ roomId }))
            )

            return roomsResponse.map(({ payload }) => {
                const { debt, room, roomId } = payload.data.getInformationOnRoom
                return {
                    debt,
                    roomId,
                    roomName: room,
                    appartmentName: `${projectName} ${room}`,
                    isUtilityItem: true,
                }
            })
        } catch (error) {
            console.error(error)
            return []
        }
    }

    fetchUtilityBills = async () => {
        const projects = this.getAvailableProjects()
        try {
            const utilityBillData = (
                await Promise.all(
                    projects.map(({ projectName, rooms }) => this.fetchRooms(rooms, projectName))
                )
            ).reduce((acc, arr) => [...acc, ...arr], [])

            this.setState({ utilityBillData })
        } catch (error) {
            reportError(error, 'Payments/updateBills/fetchBills/utility')
        }
    }

    fetchAdditionalBills = (filter, isUpdate = false) => {
        const { data } = this.state
        const { fetchBills } = this.props

        fetchBills(filter)
            .then((response) => {
                const responseData = response.payload.data.getBills
                this.setState(
                    isUpdate
                        ? { data: responseData.bills }
                        : { data: data.concat(responseData.bills) }
                )
            })
            .catch((error) => {
                reportError(error, 'Payments/updateBills/fetchBills')
            })
            .finally(() => {
                this.setState({ isLoading: false })
            })
    }

    updateBills(currentPage = 0, updatingFilter) {
        const {
            route: { params },
        } = this.props
        const page = Number(currentPage.toFixed(0))

        // filter не успевает записаться - костыль
        let filter = params && params.filter ? params.filter : this.state.filter
        if (updatingFilter) {
            filter = updatingFilter
        }

        filter.page = page
        filter.categoryId = [2, 3, 4, 5]
        if (page === 0) {
            this.setState({ isLoading: true })
        }

        // Получение только коммунальные платежи
        if (page === 0) {
            this.fetchUtilityBills()
                .then(() => {
                    this.fetchAdditionalBills(filter, true)
                })
                .catch((error) => {
                    console.error(error)
                })
        } else {
            this.fetchAdditionalBills(filter)
        }
    }

    renderItem = ({ item }) => (
        <PaymentComponent
            onSwiped={() =>
                this.props.navigation.navigate('BillPaymentScreen', {
                    billId: item.billId,
                })
            }
            swipeGestureBegan={() =>
                this.sectionList.current.setNativeProps({ scrollEnabled: false })
            }
            onReceiptClick={() => this.onPdfButtonClick(item.billId, item.receiptNumber)}
            onRowClose={() => this.sectionList.current.setNativeProps({ scrollEnabled: true })}
            onPress={() => this.setState({ isOpenedBottomSheet: true, selectedItem: item })}
            billId={item.billId}
            projectTitle={item.project.title}
            receiptNumber={item.receiptNumber}
            date={item.date}
            statusId={item.status.statusId}
            total={item.total}
            category={item.billCategory}
        />
    )

    renderUtilityItem = ({ item }) => (
        <PaymentComponent
            isUtilityItem
            swipeGestureBegan={() =>
                this.sectionList.current.setNativeProps({ scrollEnabled: false })
            }
            onRowClose={() => this.sectionList.current.setNativeProps({ scrollEnabled: true })}
            onReceiptClick={() => this.handleUtilityBillsClick(item)}
            onSwiped={() =>
                this.props.navigation.navigate('BillPaymentScreen', {
                    billId: item.billId,
                })
            }
            onPress={() => this.setState({ isOpenedBottomSheet: true, selectedItem: item })}
            projectTitle={item.appartmentName}
            total={item.debt}
        />
    )

    renderBottomSheet = () => {
        const { selectedItem, isOpenedBottomSheet } = this.state
        const { navigation } = this.props

        if (!selectedItem) {
            return <></>
        }

        return (
            <AnimatedBottomSheet
                navigation={navigation}
                isOpen={isOpenedBottomSheet}
                onPdfButtonClick={() =>
                    this.onPdfButtonClick(selectedItem?.billId, selectedItem?.receiptNumber)
                }
                onMakePaymentPress={this.handleMakePaymentClick(selectedItem)}
                onClosed={() => {
                    this.setState({ isOpenedBottomSheet: false })
                }}
                paymentInfo={this.getPaymentInfo(selectedItem)}
            />
        )
    }

    render() {
        const { data, isLoading, utilityBillData } = this.state

        if (isLoading) {
            return (
                <View style={styles.spinloader}>
                    <Spinner />
                </View>
            )
        }

        const groupedByMonth = data.reduce((result, value) => {
            const index = result.findIndex((el) => moment(el.title).isSame(value.date, 'month'))
            if (index === -1) {
                return result.concat({
                    title: value.date,
                    data: [value],
                })
            }
            result[index].data.push(value)
            return result
        }, [])

        return (
            <View style={styles.wrapper}>
                <SectionList
                    ref={this.sectionList}
                    stickySectionHeadersEnabled={false}
                    style={styles.sectionList}
                    renderItem={this.renderItem}
                    renderSectionHeader={({ section }) => (
                        <Text style={styles.monthTitle}>
                            {moment(section.title).format('MMMM, YYYY')}
                        </Text>
                    )}
                    ListFooterComponent={() => (
                        <View style={styles.footerView}>
                            {data.length === 0 ? (
                                <Text style={[styles.emptyTextStyle, { marginVertical: 24 }]}>
                                    По выбранным параметрам ничего не найдено
                                </Text>
                            ) : null}
                        </View>
                    )}
                    sections={groupedByMonth}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.3}
                    ListHeaderComponent={
                        <View>
                            {utilityBillData.length === 0 ? (
                                <View style={styles.emptyPaymentsWrapper}>
                                    <Text style={styles.emptyTextStyle}>
                                        Лицевые счета не найдены
                                    </Text>
                                    <FilterAdditionalBills
                                        filter={this.state.filter}
                                        projectsData={this.props.projects}
                                        updateFilter={this.updateBills}
                                    />
                                </View>
                            ) : (
                                <View>
                                    <FlatList
                                        style={styles.utilityFlatList}
                                        data={utilityBillData}
                                        keyExtractor={(_, index) => index.toString()}
                                        renderItem={this.renderUtilityItem}
                                    />
                                    <FilterAdditionalBills
                                        filter={this.state.filter}
                                        projectsData={this.props.projects}
                                        updateFilter={this.updateBills}
                                    />
                                </View>
                            )}
                        </View>
                    }
                />
                {this.renderBottomSheet()}
            </View>
        )
    }
}
export default connect(({ projects }) => ({ projects: projects.list }), {
    fetchRoom: shared.actions.fetchRoom,
    fetchBills: shared.actions.fetchBills,
    fetchBill: shared.actions.fetchBill,
    setError: shared.actions.error,
    setSuccess: shared.actions.success,
})(PaymentsScreen)
