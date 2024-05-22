import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import ModalRoot, { openAgreementModal } from '../components/custom/RootModalsComponent'
import Spinner from '../components/custom/Spinner'

import shared from '../../store/index'
import { Fonts } from '../utils/Fonts'
import reportError from '../utils/ReportError'
import { downloadFile } from '../utils/Utils'
import PDF from 'react-native-pdf'

const styles = StyleSheet.create({
    downloadButtonWrapper: {
        width: 240,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#747E90',
        borderRadius: 25,
    },
    downloadButtonText: {
        color: '#FFFFFF',
        fontFamily: Fonts.DisplayCompactRegular,
        fontSize: 14,
    },
    shadowBoxButton: {
        position: 'absolute',
        zIndex: 10,
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
    downloadButton: {
        borderRadius: 25,
    },
    scrollView: {
        padding: 16,
    },
    pdf: {
        flex: 1,
        paddingBottom: 64,
        backgroundColor: 'transparent',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

class PdfViewScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            file: null,
        }
    }

    componentDidMount() {
        const { route, navigation, setError } = this.props
        const { fileLink } = route.params

        if (fileLink === null) {
            navigation.goBack()
            return
        }

        fetch(String(fileLink).startsWith('https:') ? fileLink : `https:${fileLink}`)
            .then((response) => response.blob())
            .then((blob) => {
                const fileReader = new FileReader()
                fileReader.onload = (file) => {
                    this.setState({ file })
                }
                fileReader.readAsDataURL(blob)
            })
            .catch((error) => {
                reportError(error, 'PDFView/componentDidMount')
                setError([{ message: 'Извините, невозможно открыть данный файл.' }])
                navigation.goBack()
            })
    }

    downloadFile = () => {
        const { fileLink, title } = this.props.route.params

        openAgreementModal(this.modalRootContext, {
            message: 'Сохранить файл?',
            onAcceptClicked: () => downloadFile({ fileLink, fileName: title }).catch(console.error),
        })
    }

    render() {
        const { route, navigation, setError } = this.props
        const { isDownload = true } = route.params
        const { file } = this.state

        if (!file) {
            return (
                <View style={styles.center}>
                    <Spinner />
                </View>
            )
        }

        const base64 = file.target.result.replace('application/octet-stream', 'application/pdf')

        return (
            <>
                <ModalRoot.ModalRootContext.Consumer>
                    {(context) => {
                        this.modalRootContext = context
                    }}
                </ModalRoot.ModalRootContext.Consumer>
                <PDF
                    style={styles.pdf}
                    source={{ uri: base64, cache: false }}
                    onError={(error) => {
                        reportError(error, 'PDFView/PDFViewRender')
                        setError([{ message: 'Извините, произошла ошибка загрузки файла.' }])
                        navigation.goBack()
                    }}
                />
                {isDownload && (
                    <View style={styles.shadowBoxButton}>
                        <TouchableOpacity style={styles.downloadButton} onPress={this.downloadFile}>
                            <View style={styles.downloadButtonWrapper}>
                                <Text style={styles.downloadButtonText}>Скачать PDF</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </>
        )
    }
}

export default connect(null, {
    setError: shared.actions.error,
})(PdfViewScreen)
