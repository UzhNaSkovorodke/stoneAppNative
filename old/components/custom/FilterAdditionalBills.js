import React, { useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import SplitLine from './SplitLine'

import Arrow from '../../../assets/oldImg/Arrow.png'
import FilterIcon from '../../../assets/oldImg/FilterIcon.png'
import Vector from '../../../assets/oldImg/Vector.png'
import { Fonts } from '../../utils/Fonts'
import CalendarButton from '../buttons/CalendarButton'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 8,
    },
    delimiter: {
        marginTop: 8,
        marginBottom: 0,
    },
    filterContainer: {
        height: 56,
        width: '100%',
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 26,
        marginTop: 24,
    },
    filterIcon: {
        marginLeft: -8,
        marginTop: 2,
        width: 19,
        height: 20,
    },
    arrowIcon: {
        width: 8,
        height: 13,
    },
    arrowIconTransform: {
        width: 8,
        height: 13,
        transform: [{ rotate: '180deg' }],
    },
    additionalServices: {
        marginLeft: 19,
        lineHeight: 24,
        fontSize: 16,
        color: '#000000',
        fontWeight: '300',
        fontFamily: Fonts.PFEncoreSansPro,
    },
    openFilter: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    status: {
        fontSize: 18,
        lineHeight: 22,
        fontWeight: '300',
        marginRight: 10,
        fontFamily: Fonts.PFEncoreSansPro,
    },
    title: {
        marginTop: 28,
        marginBottom: 4,
        color: '#BBBBBB',
        fontSize: 12,
        fontWeight: '300',
        lineHeight: 15,
        fontFamily: Fonts.PFEncoreSansPro,
    },
    vector: {
        marginTop: 32,
        width: 7,
        height: 5,
        marginLeft: 2,
    },
    buttons: {
        width: '100%',
        marginBottom: 29,
        marginLeft: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    shadowBoxStyle: {
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        marginRight: 16,
    },
    applyFilter: {
        width: 132,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#747E90',
        borderRadius: 3,
    },
    cancelFilter: {
        marginRight: 48,
        width: 132,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#DDDDDD',
        borderWidth: 1,
        borderRadius: 3,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontFamily: Fonts.DisplayRegular,
        fontSize: 14,
        lineHeight: 16,
        fontWeight: '300',
    },
    cancelButtonText: {
        color: '#707070',
        fontFamily: Fonts.PFEncoreSansPro,
        fontSize: 13,
        lineHeight: 15,
        fontWeight: '300',
    },
    filterButton: {
        borderRadius: 25,
    },
})

const defaultFilter = {
    statusId: 2,
    startAt: moment().subtract(1, 'month').startOf('month').toISOString(),
    endAt: moment().endOf('month').endOf().toISOString(),
    isProjects: [],
    page: 0,
    size: 10,
}

const filterTypes = {
    notPayed: 'Не оплачено',
    payed: 'Оплачено',
    all: 'Все',
}

const FilterAdditionalBills = ({ filter, projectsData, updateFilter }) => {
    const [isOpenFilter, setOpenFilter] = useState(false)
    const navigation = useNavigation()
    const [isProjects, setProjects] = useState(filter.projects)

    const activeFilters = () => {
        if (filter.statusId === 1) {
            return filterTypes.payed
        }
        if (filter.statusId === 2) {
            return filterTypes.notPayed
        }
        return filterTypes.all
    }

    const [isCurrentFilterType, setCurrentFilterType] = useState(activeFilters())

    const getStatusIdValue = (item) => {
        if (item === filterTypes.all) {
            filter.statusId = undefined
            return
        }

        if (item === filterTypes.notPayed) {
            filter.statusId = 2
            return
        }
        filter.statusId = 1
    }

    const resetFilter = () => {
        filter.statusId = defaultFilter.statusId
        filter.startAt = defaultFilter.startAt
        filter.endAt = defaultFilter.endAt
        setProjects([])
        setCurrentFilterType(activeFilters())
    }

    const onSetDate = ({ startAt, endAt }) => {
        if (!startAt || !endAt) {
            return
        }

        const fDate = new Date(Date.parse(startAt))
        const lDate = new Date(Date.parse(endAt))

        lDate.setHours(23)
        lDate.setMinutes(59)

        filter.startAt = fDate.toISOString()
        filter.endAt = lDate.toISOString()
    }

    return (
        <View style={styles.wrapper}>
            <SplitLine style={styles.delimiter} />
            <TouchableOpacity
                onPress={() => setOpenFilter(!isOpenFilter)}
                style={styles.filterContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={FilterIcon} style={styles.filterIcon} />
                    <Text style={styles.additionalServices}>Дополнительные услуги</Text>
                </View>
                <Image
                    source={Arrow}
                    style={isOpenFilter ? styles.arrowIconTransform : styles.arrowIcon}
                />
            </TouchableOpacity>
            <View style={[styles.openFilter, !isOpenFilter && { display: 'none' }]}>
                <ScrollView style={{ paddingHorizontal: 16 }} scrollEventThrottle={16}>
                    <Text style={styles.title}>Статус</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {Object.values(filterTypes).map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        getStatusIdValue(item)
                                        setCurrentFilterType(item)
                                    }}>
                                    <Text
                                        style={[
                                            styles.status,
                                            {
                                                color:
                                                    isCurrentFilterType === item
                                                        ? '#000000'
                                                        : '#BBBBBB',
                                            },
                                        ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.title}>Дата</Text>
                        <Image source={Vector} style={styles.vector} />
                    </View>
                    <CalendarButton
                        style={{ alignItems: 'flex-start', marginBottom: 28 }}
                        currentMode={`${moment(filter.startAt).format(
                            'DD.MM.YYYY'
                        )}-${moment(filter.endAt).format('DD.MM.YYYY')}`}
                        onPress={() => {
                            navigation.navigate('CalendarScreen', {
                                onSetDate,
                            })
                        }}
                    />
                </ScrollView>
                <View style={styles.buttons}>
                    <View style={styles.shadowBoxStyle}>
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={() => updateFilter(0, { ...filter, isProjects })}>
                            <View style={styles.applyFilter}>
                                <Text style={styles.submitButtonText}>Применить</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.shadowBoxStyle}>
                        <TouchableOpacity style={styles.filterButton} onPress={resetFilter}>
                            <View style={styles.cancelFilter}>
                                <Text style={styles.cancelButtonText}>Очистить</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default FilterAdditionalBills
