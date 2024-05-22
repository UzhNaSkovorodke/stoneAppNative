import React, { useState } from 'react'
import {
    Dimensions,
    FlatList,
    Image,
    LogBox,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { connect } from 'react-redux'

import Clip from '../../../assets/oldImg/Clip.png'
//import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
//import RNFS from 'react-native-fs'
//import ImagePicker from 'react-native-image-picker'
//import ReactNativePickerModule from 'react-native-picker-module'
import shared from '../../../store/index'
import DefaultButton from '../../components/buttons/DefaultButton'
import ResidenceButton from '../../components/buttons/ResidenceButton'
import CommentLabel from '../../components/custom/CommentLabel'
import SplitLine from '../../components/custom/SplitLine'
import commonStyles from '../../styles/CommonStyles'
import { Fonts } from '../../utils/Fonts'
import reportError from '../../utils/ReportError'
import { replaceSymbols } from '../../utils/Utils'

const styles = StyleSheet.create({
    comment: {
        width: '100%',
        height: 200,
        paddingTop: 16, // работает только так!
        paddingBottom: 16,
        marginTop: 16,
        backgroundColor: '#F7F7F9',
        borderRadius: 3,
        paddingHorizontal: 16,
        textAlignVertical: 'top',
    },
    buttonText: {
        fontSize: 14,
    },
    addFile: {
        color: '#111111',
        fontFamily: Fonts.DisplayLight,
        fontSize: 14,
    },
    filesContainer: {
        alignItems: 'center',
        marginBottom: 5,
        backgroundColor: '#747E90',
        borderRadius: 3,
    },
    exitButtonContainer: {
        width: 12,
        height: 12,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginLeft: 45,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 1,
    },
    exitButtonStyle: {
        width: 6,
        height: 6,
        tintColor: '#FFFFFF',
    },
    imageWrapping: {
        width: '100%',
        height: 35,
        marginTop: 5,
        resizeMode: 'contain',
    },
    textWrapping: {
        color: '#FFFFFF',
        fontSize: 8,
    },
    viewWrapping: {
        padding: 5,
        paddingTop: 3,
    },
    valetParkingButton: {
        width: 121,
        marginTop: 10,
        marginBottom: 5,
    },
    addFileIcon: {
        width: 12,
        height: 12,
        marginTop: 3,
        marginRight: 10,
    },
    conciergeButton: {
        width: 103,
        marginTop: 10,
        marginRight: 15,
    },
    managerButton: {
        width: 110,
        marginTop: 10,
        marginRight: 15,
    },
    //TODO переписать imageContainer
    imageContainer: {
        width: 80,
        height: 68,
        backgroundColor: 'transparent',
    },
    clipFileWrapper: {
        width: '100%',
        alignItems: 'flex-end',
        marginTop: 15,
    },
    residenceButton: {
        marginTop: 8,
    },
    splitLine: {
        marginTop: 20,
        marginBottom: 20,
    },
    label: {
        color: '#111111',
        fontFamily: Fonts.TextRegular,
        fontSize: 16,
    },
})

const MANAGEMENT_COMPANY_APPEAL_TYPE_ID = 3

const EventManagementCompanyAppealScreen = ({
    projects,
    route,
    navigation,
    sendPass,
    setError,
    setSuccess,
}) => {
    const supportedProjects = projects.filter(({ projectId }) =>
        route.params.projectsId.includes(projectId)
    )
    const projectList = supportedProjects || []

    const [data, setData] = useState([])
    const [needUpdate, setNeedUpdate] = useState(false)
    const [selectedProject, setSelectedProject] = useState(supportedProjects?.[0] || {})
    const [appealTypeId] = useState(route.params.typeID)
    const [comment, setComment] = useState('')
    const [isDisableSend, setIsDisableSend] = useState(false)
    const [isShowLoader, setIsShowLoader] = useState(false)

    LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])

    const removeData = (id) => {
        setData((prevData) =>
            prevData.filter((value) => {
                return value.key !== id
            })
        )
        setNeedUpdate(!needUpdate)
    }

    const checkContains = (fileUri) =>
        data.reduce((sum, current) => (current.fileUri === fileUri ? sum + 1 : sum), 0) > 0

    const getColumns = () => Math.trunc(Dimensions.get('window').width / 80) - 1

    const getData = () => {
        if (data.length < 1) {
            return null
        }

        const columns = getColumns()
        const arr = [...data]
        let counter = Math.abs(columns - (data.length % columns))

        if (counter === columns) {
            counter = 0
        }

        for (let i = 0; i < counter; i++) {
            arr.push({ key: -1 })
        }
        return arr
    }

    const onClickedSendButton = async () => {
        if (comment === '') {
            setError([
                {
                    message:
                        'Пожалуйста, заполните все обязательные поля и проверьте корректность введенных данных.',
                },
            ])
        } else {
            setIsDisableSend(true)
            const attachedFile = await getFilesLinksForSend(data)
            setIsShowLoader(true)
            sendPass({
                eventTypeId: MANAGEMENT_COMPANY_APPEAL_TYPE_ID,
                projectId: selectedProject.projectId,
                appealTypeId,
                text: comment,
                attachedFile,
            })
                .then(() => {
                    setSuccess([
                        {
                            message: getMessageByAppealType(appealTypeId),
                        },
                    ])
                    setIsDisableSend(false)
                    setIsShowLoader(false)
                    navigation.goBack()
                })
                .catch((error) => {
                    reportError(
                        error,
                        'EventManagementCompanyAppealScreen/onClickedSendButton/sendPass'
                    )
                    setIsDisableSend(false)
                    setIsShowLoader(false)
                })
        }
    }

    const getMessageByAppealType = (typeID) => {
        switch (typeID) {
            case 2:
                return 'Обращение успешно создано. Спасибо, что обратились в управляющую компанию. Мы обязательно рассмотрим ваше обращение в ближайшее время.'
            case 5:
            case 6:
                return 'Благодарим Вас за обращение в Отдел постпродажного сопровождения клиентов! Мы будем рады оказать Вам содействие и предоставим ответ в ближайшее время.'
            default:
                return 'Обращение в УК успешно отправлено. Наши специалисты рассмотрят его в ближайшее время.'
        }
    }

    const getFilesLinksForSend = async (data) => {
        const result = []
        for (let i = 0; i < data.length; i++) {
            let base64File
            try {
                //base64File = await RNFS.readFile(`${data[i].fileUri}`, 'base64')
            } catch {
                // base64File = await RNFS.readFile(
                //     `${data[i].fileUri.slice(0, data[i].fileUri.lastIndexOf('/'))}/${data[i].fileName}`,
                //     'base64'
                // )
            }
            result.push({
                fileName: data[i].fileName ? data[i].fileName : 'photo',
                fileContent: base64File,
            })
        }
        return result
    }

    const onClipPress = () => {
        if (data.length >= 15) {
            setError([
                {
                    message: 'Общее количество прикрепленных файлов не должно превышать 15.',
                },
            ])
            return
        }
        //pickerRef.show()
    }

    const openDocumentPicker = () => {
        // DocumentPicker.show(
        //     {
        //         filetype: [DocumentPickerUtil.allFiles()],
        //     },
        //     (error, res) => {
        //         if (error || res.uri === null) {
        //             return
        //         }
        //
        //         if (checkContains(res.uri)) {
        //             setError([{ message: 'Данный файл уже загружен.' }])
        //             return
        //         }
        //         if (res.fileSize > 10000000) {
        //             setError([{ message: 'Размер файла не должен превышать 10 МБ.' }])
        //             return
        //         }
        //
        //         let dataNew = {}
        //
        //         const expansion = res.fileName
        //             .slice(res.fileName.length - 4, res.fileName.length)
        //             .toLowerCase()
        //
        //         if (
        //             expansion === '.png' ||
        //             expansion === '.jpg' ||
        //             expansion === '.jpeg' ||
        //             expansion === 'heic'
        //         ) {
        //             dataNew = {
        //                 fileUri: res.uri,
        //                 fileName: res.fileName,
        //                 isImage: true,
        //                 key: data.length + 1,
        //             }
        //         } else if (expansion === '.pdf') {
        //             dataNew = {
        //                 fileUri: res.uri,
        //                 fileName: res.fileName,
        //                 isPdf: true,
        //                 key: data.length + 1,
        //             }
        //         } else if (expansion !== '.exe') {
        //             dataNew = {
        //                 fileUri: res.uri,
        //                 fileName: res.fileName,
        //                 isExe: false,
        //                 key: data.length + 1,
        //             }
        //         } else {
        //             return
        //         }
        //
        //         setData((prevData) => [...prevData, dataNew])
        //         setNeedUpdate(!needUpdate)
        //     }
        // )
    }

    const openPhotoPicker = () => {
        const options = {
            title: 'Выберите изображение',
            cancelButtonTitle: 'Отмена',
            takePhotoButtonTitle: 'Сделать снимок',
            chooseFromLibraryButtonTitle: 'Выбрать из библиотеки',
            permissionDenied: {
                title: 'Доступ запрещен',
                text: 'Чтобы иметь возможность делать снимки с помощью камеры и выбирать изображения из вашей библиотеки дайте доступ.',
                reTryTitle: 'Дать доступ',
                okTitle: 'Пропустить',
            },
            storageOptions: {
                path: 'images',
            },
        }
        // ImagePicker.showImagePicker(options, (res) => {
        //     if (res.error && res.error === 'Photo library permissions not granted') {
        //         setError([
        //             {
        //                 message:
        //                     'Доступ к фото запрещен. Дать доступ можно в настройках приложения.',
        //             },
        //         ])
        //     }
        //
        //     if (res.error && res.error === 'Camera permissions not granted') {
        //         setError([
        //             {
        //                 message:
        //                     'Доступ к камере запрещен. Дать доступ можно в настройках приложения.',
        //             },
        //         ])
        //     }
        //
        //     if (res.didCancel || res.error || res.uri === null) {
        //         return
        //     }
        //
        //     if (checkContains(res.uri)) {
        //         setError([{ message: 'Данный файл уже загружен.' }])
        //         return
        //     }
        //     if (res.fileSize > 10000000) {
        //         setError([{ message: 'Размер файла не должен превышать 10 МБ.' }])
        //         return
        //     }
        //
        //     setData((prevData) => [
        //         ...prevData,
        //         {
        //             fileUri: res.uri,
        //             fileName: res.fileName,
        //             isImage: true,
        //             key: prevData.length + 1,
        //         },
        //     ])
        //     setNeedUpdate(!needUpdate)
        // })
    }

    const onCheckResidence = ({ id }) => {
        const selectedProject = projectList.find((project) => project.projectId === id)
        setSelectedProject(selectedProject)
        return {
            selectedProject,
            roomList: selectedProject?.rooms,
        }
    }

    return (
        <ScrollView
            scrollEventThrottle={16}
            ref={(ref) => {
                this.scrollView = ref
            }}>
            <View style={[commonStyles.container, { paddingTop: 16 }]}>
                {/*<ReactNativePickerModule*/}
                {/*    pickerRef={(e) => {}}*/}
                {/*    title="Какой файл вы хотите прикрепить"*/}
                {/*    confirmButton="Выбрать"*/}
                {/*    cancelButton="Отмена"*/}
                {/*    items={['Фото', 'Документ']}*/}
                {/*    onValueChange={(value, index) =>*/}
                {/*        setTimeout(*/}
                {/*            () => (index === 0 ? openPhotoPicker() : openDocumentPicker()),*/}
                {/*            700*/}
                {/*        )*/}
                {/*    }*/}
                {/*/>*/}
                <CommentLabel text="Выберите проект" required />
                <ResidenceButton
                    style={styles.residenceButton}
                    textStyle={{ fontSize: 16, fontFamily: Fonts.TextLight }}
                    onPress={() =>
                        navigation.navigate('ItemSelectionScreen', {
                            title: 'Выбор проекта',
                            onItemSelected: onCheckResidence,
                            selectedId: selectedProject.projectId,
                            itemList: projectList.map(({ projectName, projectId }) => ({
                                text: projectName,
                                id: projectId,
                            })),
                        })
                    }
                    text={selectedProject.projectName}
                    isArrowVisible={projectList.length > 1}
                />

                <SplitLine style={styles.splitLine} />

                <CommentLabel
                    style={styles.label}
                    viewStyle={{ marginTop: 0 }}
                    text="Причина обращения"
                    required
                />

                <TextInput
                    style={styles.comment}
                    selectionColor="#747E90"
                    onChangeText={(text) => setComment(replaceSymbols(text, true))}
                    autoCapitalize="sentences"
                    multiline
                />

                <View style={styles.clipFileWrapper}>
                    <TouchableOpacity onPress={onClipPress}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image style={styles.addFileIcon} source={Clip} />
                            <Text style={styles.addFile}>Прикрепить файл</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <DefaultButton
                    disabled={isDisableSend}
                    onPress={onClickedSendButton}
                    textStyle={styles.buttonText}
                    text="Отправить"
                    isShowLoader={isShowLoader}
                />
            </View>
        </ScrollView>
    )
}

export default connect(({ projects }) => ({ projects: projects.list }), {
    sendPass: shared.actions.sendPass,
    setError: shared.actions.error,
    setSuccess: shared.actions.success,
})(EventManagementCompanyAppealScreen)
