import React, { useEffect, useRef, useState } from 'react'
import {
    Image,
    Platform,
    SectionList,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native'
import { connect } from 'react-redux'

import DocumentsIcon from '../../assets/oldImg/Document.png'
import DownloadIcon from '../../assets/oldImg/DownloadIcon.png'

import ModalRoot, { openAgreementModal } from '../components/custom/RootModalsComponent'
import SplitLine from '../components/custom/SplitLine'

import shared from '../../store/index'
import { Fonts } from '../utils/Fonts'
import reportError from '../utils/ReportError'
import { downloadFile } from '../utils/Utils'
import { useNavigation } from '@react-navigation/native'

const styles = StyleSheet.create({
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
    icon: {
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
    downloadButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DEE0E5',
        borderRadius: 50,
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

function DocumentsScreen({ fetchDocs, route }) {
    const navigation = useNavigation()

    const [data, setData] = useState(null)
    const modalRef = useRef(null)

    useEffect(() => {
        const resultObject = {}
        const result = []
        fetchDocs({ projectId: route.params.projectId })
            .then((response) => {
                const { documents } = response.payload.data.getDocumentsOnProjectId
                documents.forEach((value) => {
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
            .catch((error) => reportError(error, 'Documents/componentDidMount/fetchDocs'))
    }, [])

    const showModal = () => {
        modalRef.current.open()
    }

    const viewDocument = ({ fileLink, fileName }) => {
        if (fileName.slice(-3) === 'pdf') {
            navigation.navigate('PdfViewScreen', { fileLink, title: fileName })
        }
    }

    const downloadFileHandler = (selectedFile) => {
        downloadFile(selectedFile).catch((err) => console.error(err))
    }

    const handleDownloadButtonClick = (selectedFile) => {
        openAgreementModal(modalRef.current, {
            message: Platform.OS === 'ios' ? 'Поделиться файлом?' : 'Сохранить файл?',
            onAcceptClicked: () => downloadFileHandler(selectedFile),
        })
    }

    const renderItem = ({ item }) => (
        <View style={styles.cell}>
            <TouchableHighlight
                style={{ flex: 1, borderRadius: 3 }}
                onPress={() => viewDocument(item)}>
                <View style={styles.document}>
                    <Image style={styles.icon} source={DocumentsIcon} />
                    <Text style={styles.cellTitle} numberOfLines={2}>
                        {item.fileName.replace(/\.[^/.]+$/, '')}
                    </Text>
                    <TouchableOpacity
                        onPress={() => handleDownloadButtonClick(item)}
                        style={styles.downloadButton}>
                        <Image style={{ height: 32, width: 32 }} source={DownloadIcon} />
                    </TouchableOpacity>
                </View>
            </TouchableHighlight>
        </View>
    )

    if (data) {
        return data?.length === 0 ? (
            <View style={styles.emptyServicesContainer}>
                <Text style={styles.emptyServicesText}>
                    В настоящий момент данные по разделу «Документы» находятся в разработке и скоро
                    буду добавлены
                </Text>
            </View>
        ) : (
            <>
                <SectionList
                    stickySectionHeadersEnabled={false}
                    style={{ backgroundColor: '#F7F7F9', paddingHorizontal: 10 }}
                    sections={data}
                    renderItem={renderItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.header}>{title}</Text>
                    )}
                    keyExtractor={(item, index) => item + index}
                    renderSectionFooter={() => <SplitLine />}
                />
                <ModalRoot.ModalRootContext.Consumer>
                    {(context) => {
                        modalRef.current = context
                    }}
                </ModalRoot.ModalRootContext.Consumer>
            </>
        )
    } else return null
}

export default connect(null, { fetchDocs: shared.actions.fetchDocs })(DocumentsScreen)
