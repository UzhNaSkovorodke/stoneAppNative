import React, { useState, useEffect } from 'react'
import { Image, SectionList, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import Document from '../../assets/oldImg/Document.png'

import SplitLine from '../components/custom/SplitLine'

import shared from '../../store/index'
import { Fonts } from '../utils/Fonts'
import { useNavigation } from '@react-navigation/native'

const styles = StyleSheet.create({
    sectionList: {
        backgroundColor: '#F7F7F9',
        paddingHorizontal: 10,
    },
    cell: {
        minHeight: 55,
        marginTop: 8,
        marginBottom: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        marginHorizontal: 6,
        shadowColor: '#8E97A8',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    cellTitle: {
        flex: 1,
        marginLeft: 16,
        color: '#111111',
        fontFamily: Fonts.DisplayCompactRegular,
        fontSize: 14,
    },
    header: {
        marginTop: 8,
        marginBottom: 8,
        color: '#747E90',
        fontFamily: Fonts.DisplayLight,
        fontSize: 12,
        marginHorizontal: 6,
    },
    image: {
        width: 17.3,
        height: 24,
        marginVertical: 5,
        tintColor: '#747E90',
    },
    document: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
    },
    button: {
        flex: 1,
        borderRadius: 3,
    },
    emptyServicesText: {
        color: '#747E90',
        fontFamily: Fonts.DisplayLight,
        fontSize: 12,
        textAlign: 'center',
    },
    emptyServicesContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
})

function AdditionalServicesScreen({ fetchServices, route }) {
    const [data, setData] = useState(null)

    const navigation = useNavigation()

    useEffect(() => {
        const projectId = route.params.projectId
        const resultObject = {}
        const result = []

        fetchServices({ projectId })
            .then((response) => {
                const { services } = response.payload.data.getServices
                services.forEach((value) => {
                    if (Object.prototype.hasOwnProperty.call(resultObject, value.sectionName)) {
                        resultObject[value.sectionName].push(value)
                    } else {
                        resultObject[value.sectionName] = [value]
                    }
                })
                Object.entries(resultObject).forEach(([key, value]) => {
                    result.push({ title: key, data: value })
                })
                setData(result)
            })
            .catch((e) => console.log(e))
    }, [])

    const viewDocument = ({ fileLink, fileName }) => {
        navigation.navigate('PdfViewScreen', {
            fileLink,
            title: fileName,
            isDownload: false,
        })
    }

    const renderItem = ({ item }) => (
        <View style={styles.cell}>
            <TouchableHighlight style={styles.button} onPress={() => viewDocument(item)}>
                <View style={styles.document}>
                    <Image style={styles.image} source={Document} />
                    <Text style={styles.cellTitle} numberOfLines={2}>
                        {item.fileName.replace(/\.[^/.]+$/, '')}
                    </Text>
                </View>
            </TouchableHighlight>
        </View>
    )

    if (data?.length === 0 && data) {
        return (
            <View style={styles.emptyServicesContainer}>
                <Text style={styles.emptyServicesText}>
                    В настоящий момент данные по разделу «Дополнительные услуги» находятся в
                    разработке и скоро буду добавлены
                </Text>
            </View>
        )
    }

    if (data) {
        return (
            <SectionList
                stickySectionHeadersEnabled={false}
                style={styles.sectionList}
                sections={data}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                )}
                keyExtractor={(item, index) => item + index}
                renderSectionFooter={() => <SplitLine />}
            />
        )
    } else return null
}

export default connect(null, {
    fetchServices: shared.actions.fetchServices,
})(AdditionalServicesScreen)
