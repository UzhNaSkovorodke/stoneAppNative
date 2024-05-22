import React from 'react'
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import CheckBox from '../../components/custom/CheckBox'
import SplitLine from '../../components/custom/SplitLine'
import { saveOrDeleteElementInArray } from '../../utils/Array'
import { Fonts } from '../../utils/Fonts'
import { SafeAreaView } from 'react-native-safe-area-context'

const styles = StyleSheet.create({
    title: {
        marginTop: 8,
        marginBottom: 7,
        color: '#747E90',
        fontFamily: Fonts.DisplayLight,
        fontSize: 12,
    },
    applyFilter: {
        width: 240,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#747E90',
        borderRadius: 25,
    },
    filterButtonText: {
        color: '#FFFFFF',
        fontFamily: Fonts.DisplayCompactRegular,
        fontSize: 14,
    },
    inWorkCheckBox: {
        flex: 1,
        marginLeft: 53,
    },
    shadowBoxButtonFilter: {
        position: 'absolute',
        bottom: 32,
        width: 240,
        height: 50,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        shadowColor: '#8E97A8',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    closedCheckBox: {
        flex: 1,
        marginTop: 5,
    },
    splitLine: {
        marginTop: 20,
    },
    filterButton: {
        borderRadius: 25,
    },
    scrollView: {
        padding: 16,
    },
    calendarButton: {
        alignItems: 'flex-start',
        marginBottom: 130,
    },
})

class AppealsFilterScreen extends React.Component {
    constructor(props) {
        super(props)
        const { filter } = props.route.params
        this.state = {
            filter,
        }
    }

    onSetDate = ({ startAt, endAt }) => {
        const { filter } = this.state
        const fDate = new Date(Date.parse(startAt))
        const lDate = new Date(Date.parse(endAt))

        lDate.setHours(23)
        lDate.setMinutes(59)

        filter.startAt = fDate.toISOString()
        filter.endAt = lDate.toISOString()
        this.setState({ filter })
    }

    onNavigate = () => {
        const { navigation } = this.props
        const { filter } = this.state

        navigation.navigate('AppealsScreen', { filter: { ...filter, page: 0 } })
    }

    renderManagementCompanyAppeals = ({ el, index }) => {
        const { filter } = this.state
        return (
            <CheckBox
                key={index}
                label={el.name}
                value={filter.appealTypeId.includes(el.id)}
                onValueChange={() => {
                    saveOrDeleteElementInArray(filter.appealTypeId, el.id)
                    filter.appealTypeId.length
                        ? !filter.eventTypeId.includes(3) && filter.eventTypeId.push(3)
                        : filter.eventTypeId.splice(filter.appealTypeId.indexOf(el), 3)
                    this.setState({ filter })
                }}
            />
        )
    }

    componentDidMount() {}

    render() {
        const { appealTypes } = this.props
        const { filter } = this.state
        const { startAt, endAt } = filter
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={styles.scrollView}>
                    <View>
                        <Text style={styles.title}>Тип: пропуск</Text>
                        <CheckBox
                            label="Пропуск для гостя"
                            value={filter.eventTypeId.includes(1)}
                            onValueChange={() => {
                                saveOrDeleteElementInArray(filter.eventTypeId, 1)
                                this.setState({ filter })
                            }}
                        />
                        <CheckBox
                            label="Пропуск для такси"
                            value={filter.eventTypeId.includes(2)}
                            onValueChange={() => {
                                saveOrDeleteElementInArray(filter.eventTypeId, 2)
                                this.setState({ filter })
                            }}
                        />
                        <CheckBox
                            label="Пропуск для доставки"
                            value={filter.eventTypeId.includes(4)}
                            onValueChange={() => {
                                saveOrDeleteElementInArray(filter.eventTypeId, 4)
                                this.setState({ filter })
                            }}
                        />
                    </View>
                    <View style={{ marginTop: 21 }}>
                        <Text style={styles.title}>Тип: заявка в УК</Text>
                        {appealTypes.map((el, index) =>
                            this.renderManagementCompanyAppeals({ el, index })
                        )}
                    </View>

                    <SplitLine style={styles.splitLine} />

                    <Text style={styles.title}>Статус</Text>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <CheckBox
                                    label="В обработке"
                                    value={filter.statusCode.includes(1)}
                                    onValueChange={() => {
                                        saveOrDeleteElementInArray(filter.statusCode, 1)
                                        this.setState({ filter })
                                    }}
                                />
                            </View>
                            <View style={styles.inWorkCheckBox}>
                                <CheckBox
                                    label="В работе"
                                    value={filter.statusCode.includes(2)}
                                    onValueChange={() => {
                                        saveOrDeleteElementInArray(filter.statusCode, 2)
                                        this.setState({ filter })
                                    }}
                                />
                            </View>
                        </View>
                        <View style={styles.closedCheckBox}>
                            <CheckBox
                                label="Завершено"
                                value={filter.statusCode.includes(3)}
                                onValueChange={() => {
                                    saveOrDeleteElementInArray(filter.statusCode, 3)
                                    this.setState({ filter })
                                }}
                            />
                        </View>
                    </View>

                    <SplitLine style={styles.splitLine} />

                    <Text style={styles.title}>Дата</Text>
                </ScrollView>

                <View style={styles.shadowBoxButtonFilter}>
                    <TouchableOpacity style={styles.filterButton} onPress={this.onNavigate}>
                        <View style={styles.applyFilter}>
                            <Text style={styles.filterButtonText}>Применить фильтр</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default connect(({ dicts }) => ({
    appealTypes: dicts.appealTypes,
    dicts,
}))(AppealsFilterScreen)
