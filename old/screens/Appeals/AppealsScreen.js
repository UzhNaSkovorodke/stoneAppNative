import React from 'react'
import { SectionList, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import shared from '../../../store/index'
import AppealsComponent from '../../components/custom/AppealsComponent'
import Spinner from '../../components/custom/Spinner'
import { Fonts } from '../../utils/Fonts'
import reportError from '../../utils/ReportError'
import moment from 'moment'

const APPEAL_IN_PROCESSING = 1
const APPEAL_IN_WORK = 2

class AppealsScreen extends React.Component {
    constructor(props) {
        super(props)

        // Фильтр по умолчанию
        const defaultFilter = {
            page: 0,
            size: 10,
            eventTypeId: [],
            statusCode: [APPEAL_IN_PROCESSING, APPEAL_IN_WORK],
            startAt: moment().startOf('month').subtract(1, 'month').toISOString(),
            endAt: moment().endOf('month').toISOString(),
            appealTypeId: [],
        }

        this.state = {
            filter: defaultFilter,
            data: [],
            isLoading: true,
        }
    }

    componentDidMount() {
        const { navigation } = this.props
        this.focusListenerUnsubscribe = navigation.addListener('focus', () => {
            this.setState({ data: [] }, () => this.updateAppealList())
        })
    }

    componentWillUnmount() {
        this.focusListenerUnsubscribe()
    }

    onTableViewCellClick(item) {
        const { eventId, eventTypeId } = item
        const { navigation } = this.props
        switch (eventTypeId) {
            case 1:
                navigation.navigate('MyEventsGuestPassOrderScreen', { eventId })
                break
            case 2:
            case 4:
                navigation.navigate('MyEventsTaxiPassOrderScreen', {
                    eventId,
                    eventTypeId,
                })
                break
            case 3:
                navigation.navigate('MyEventManagementCompanyAppealScreen', {
                    eventId,
                })
                break
            case 5:
                navigation.navigate('MyEventChangeProfileAppealScreen', { eventId })
                break
            case 6:
                navigation.navigate('MyEventsGuestPassOrderScreen', { eventId })
                break
            case 7:
                navigation.navigate('MyEventsGuestPassOrderScreen', { eventId })
                break
            default:
                break
        }
    }

    keyExtractor = (item) => item.eventId.toString()

    onEndReached = () => {
        const { filter, data } = this.state
        const { setSuccess } = this.props

        if (data.length < 10) {
            return
        }

        if (data.length % filter.size !== 0) {
            setSuccess([{ message: 'Мы загрузили все обращения.' }])
            return
        }
        this.updateAppealList(data.length / filter.size)
    }

    updateAppealList(currentPage = 0) {
        const { filter, data } = this.state
        const { setSuccess, fetchAppealList, navigation } = this.props
        const page = Number(currentPage.toFixed(0))

        filter.page = page

        navigation.setParams({ filter })

        if (page === 0) {
            this.setState({ isLoading: true })
        }

        fetchAppealList(filter)
            .then((response) => {
                const responseData = response.payload.data.getEvents
                this.setState({ data: data.concat(responseData.events) }, () => {
                    if (!this.state.data.length) {
                        setSuccess([{ message: 'Обращения отсутствуют.' }])
                    }
                })
            })
            .finally(() => this.setState({ isLoading: false }))
            .catch((error) => reportError(error, 'Appeals/updateAppealList/fetchAppealList'))
    }

    renderItem = ({ item }) => {
        const { createdAt, eventStatusCode, eventStatusName, eventTypeName } = item

        return (
            <AppealsComponent
                onPress={() => this.onTableViewCellClick(item)}
                date={createdAt}
                eventTypeName={eventTypeName}
                eventStatusName={eventStatusName}
                eventStatusCode={eventStatusCode}
            />
        )
    }

    render() {
        const { filter, data, isLoading } = this.state
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

        if (isLoading) {
            return (
                <View style={styles.spinnerWrapper}>
                    <Spinner />
                </View>
            )
        }

        if (!this.state.data.length) {
            return (
                <View style={styles.emptyWrapper}>
                    <Text style={styles.emptyDataText}>Обращения отсутствуют.</Text>
                </View>
            )
        }

        return (
            <SectionList
                stickySectionHeadersEnabled={false}
                style={styles.sectionList}
                contentContainerStyle={styles.contentContainerStyle}
                renderItem={this.renderItem}
                renderSectionHeader={() => (
                    <Text style={styles.monthTitle}>
                        {`${moment(filter.startAt).format('DD MMMM, YYYY')} - ${moment(
                            filter.endAt
                        ).format('DD MMMM, YYYY')}`}
                    </Text>
                )}
                sections={groupedByMonth}
                keyExtractor={(item, index) => item + index}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.3}
            />
        )
    }
}

export default connect(null, {
    fetchAppealList: shared.actions.fetchAppealList,
    setError: shared.actions.error,
    setSuccess: shared.actions.success,
})(AppealsScreen)

const styles = StyleSheet.create({
    statusContainer: {
        width: 124,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomEndRadius: 3,
        borderTopEndRadius: 3,
        paddingHorizontal: 18,
    },
    monthTitle: {
        marginTop: 16,
        marginBottom: 16,
        color: '#747E90',
        fontFamily: Fonts.DisplayLight,
        fontSize: 12,
        textTransform: 'capitalize',
    },
    spinnerWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7F7F9',
    },
    sectionList: {
        backgroundColor: '#F7F7F9',
    },
    contentContainerStyle: {
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    emptyWrapper: {
        flex: 1,
        backgroundColor: '#F7F7F9',
    },
    emptyDataText: {
        alignSelf: 'center',
        marginTop: 20,
        color: '#111111',
        fontSize: 15,
    },
})
