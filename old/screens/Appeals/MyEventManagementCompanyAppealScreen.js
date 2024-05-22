import React from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import shared from '../../../store/index'
import DefaultButton from '../../components/buttons/DefaultButton'
import RoundButton from '../../components/buttons/RoundButton'
import Chat from '../../components/custom/Chat'
import CommentLabel from '../../components/custom/CommentLabel'
import ImageContainer from '../../components/custom/ImageContainer'
import ModalRoot from '../../components/custom/RootModalsComponent/index'
import Spinner from '../../components/custom/Spinner'
import SplitLine from '../../components/custom/SplitLine'
import { Fonts } from '../../utils/Fonts'
import { APPEAL_STATE_TYPES } from '../../utils/Utils'
import moment from 'moment'

const styles = StyleSheet.create({
    defaultWrapper: {
        flex: 1,
    },
    label: {
        marginBottom: 24,
        color: '#111111',
        fontFamily: Fonts.DisplayCompactSemiBold,
        fontSize: 16,
    },
    description: {
        marginTop: 13,
        color: '#111111',
        fontSize: 16,
    },
    text: {
        marginBottom: 5,
        color: 'grey',
        fontSize: 12,
    },
    comment: {
        color: '#111111',
        fontFamily: Fonts.TextLight,
        fontSize: 14,
    },
    date: {
        marginBottom: 24,
        color: '#BBBBBB',
        fontFamily: Fonts.DisplayLight,
        fontSize: 13,
    },
    managerButton: {
        marginTop: 10,
        marginRight: 15,
    },
    commentContainer: {
        padding: 16,
        marginTop: 10,
        marginBottom: 26,
        backgroundColor: '#F7F7F9',
    },
    splitLine: {
        marginTop: 24,
        marginBottom: 26,
    },
    splitLine2: {
        marginTop: 20,
        marginBottom: 34,
    },
    spinnerWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    simpleWrapper: {
        width: 80,
        height: 68,
        backgroundColor: 'transparent',
    },
    scrollViewContainer: {
        flex: 1,
        padding: 16,
    },
    textButton: {
        fontFamily: Fonts.DisplayCompactRegular,
        fontSize: 16,
    },
})

class MyEventManagementCompanyAppealScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            isLoading: true,
            relevanceLoading: false,
        }
    }

    componentDidMount() {
        this.loadAppeal().finally(() =>
            this.setState((state) => ({
                ...state,
                isLoading: false,
            }))
        )
    }

    getColumns = () => Math.trunc(Dimensions.get('window').width / 80) - 1

    getData = () => {
        const { data } = this.state

        if (data.attachedFile.length < 1) {
            return null
        }

        const columns = this.getColumns()

        const arr = data.attachedFile.slice(0)

        let counter = Math.abs(columns - (data.attachedFile.length % columns))

        if (counter === columns) {
            counter = 0
        }

        for (let i = 0; i < counter; i++) {
            arr.push({ key: -1 })
        }

        return arr
    }

    loadAppeal = () => {
        const { eventId } = this.props.route.params
        return this.props.fetchServiceCompanyAppeal({ eventId }).then((response) => {
            this.setState({ data: response.payload.data.getEvent })
        })
    }

    relevanceButtonClick = () => {
        ModalRoot.openAgreementModal(this.modalRootContext, {
            message: 'Завершить обращение?',
            onAcceptClicked: this.handleEditAppealRelevance,
        })
    }

    handleEditAppealRelevance = () => {
        const { eventId } = this.props.route.params
        this.setState((state) => ({ ...state, relevanceLoading: true }))
        this.props
            .editAppealRelevance({
                eventId,
                status: APPEAL_STATE_TYPES.APPEAL_CLOSED,
            })
            .then(() => this.loadAppeal())
            .then(() => this.moveToStart())
            .finally(() => this.setState((state) => ({ ...state, relevanceLoading: false })))
    }

    moveToStart = () => {
        this.scrollView.scrollTo({ y: 0, x: 0, animated: true })
    }

    moveToEnd = () => {
        this.scrollView.scrollToEnd({ animated: true })
    }

    checkTextIncludes = (target, ...pattern) =>
        pattern.some((word) => target.toLowerCase().endsWith(word))

    getFileType = (fileName) => {
        if (!fileName) {
            return undefined
        }

        if (this.checkTextIncludes(fileName, '.png', '.jpg', '.jpeg', '.heic')) {
            return 'image'
        }
        if (this.checkTextIncludes(fileName, '.pdf')) {
            return 'pdf'
        }
        if (!this.checkTextIncludes('.exe')) {
            return 'other'
        }
        return 'exe'
    }

    renderClipedFiles() {
        const { data } = this.state

        if (data.attachedFile.length < 1) {
            return null
        }

        return (
            <>
                <CommentLabel text="Прикрепленные файлы" />
                {this.getData().map((elem, index) => {
                    const fileType = this.getFileType(elem.name)
                    const component =
                        elem.name !== undefined
                            ? {
                                  fileName: elem.name,
                                  fileUri: elem.fileLink,
                                  isImage: fileType === 'image',
                                  isPdf: fileType === 'pdf',
                                  isExe: fileType === 'exe',
                              }
                            : null
                    return !elem.key && component ? (
                        <ImageContainer key={index} idComponent={component} />
                    ) : (
                        <View style={styles.simpleWrapper} key={index} />
                    )
                })}
                <SplitLine style={styles.splitLine2} />
            </>
        )
    }

    render() {
        const { isLoading, data, relevanceLoading } = this.state
        const { eventId } = this.props.route.params

        if (isLoading) {
            return (
                <View style={styles.spinnerWrapper}>
                    <Spinner />
                </View>
            )
        }

        return (
            <View style={styles.defaultWrapper}>
                <ModalRoot.ModalRootContext.Consumer>
                    {(context) => {
                        this.modalRootContext = context
                    }}
                </ModalRoot.ModalRootContext.Consumer>
                <ScrollView
                    ref={(ref) => {
                        this.scrollView = ref
                    }}>
                    <View style={styles.scrollViewContainer}>
                        <Text style={styles.label}>{data.eventTypeName}</Text>
                        <Text style={styles.date}>
                            {moment(data.createdAt).format('DD.MM.YYYY')}
                        </Text>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.defaultWrapper}>
                                <CommentLabel text="Проект" />
                                <Text style={styles.description}>{data.projectName}</Text>
                            </View>
                            <View style={styles.defaultWrapper}>
                                <CommentLabel text="Статус" />
                                <Text style={styles.description}>{data.statusName}</Text>
                            </View>
                        </View>

                        <SplitLine style={styles.splitLine} />

                        <CommentLabel text="Категория" />
                        <RoundButton
                            style={styles.managerButton}
                            isSelected
                            text={data.appealTypeName}
                        />

                        <SplitLine style={styles.splitLine} />

                        {data.additionalComment && data.additionalComment.text && (
                            <>
                                <CommentLabel text="Причина обращения" />
                                <View style={styles.commentContainer}>
                                    <Text style={styles.comment}>
                                        {data.additionalComment.text.replace(/<(?:.|\s)*?>/g, '\n')}
                                    </Text>
                                </View>
                            </>
                        )}

                        {this.renderClipedFiles()}

                        <Chat
                            messages={data.comment}
                            eventId={eventId}
                            serviceName={data.appealTypeName}
                            moveToEnd={this.moveToEnd}
                            appealState={data.statusName}
                        />

                        {data.statusName !== 'Закрыто' && (
                            <DefaultButton
                                textStyle={styles.textButton}
                                style={{ marginTop: 40, marginBottom: 24 }}
                                onPress={this.relevanceButtonClick}
                                text="Обращение не актуально"
                                isShowLoader={relevanceLoading}
                            />
                        )}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default connect(null, {
    fetchServiceCompanyAppeal: shared.actions.fetchServiceCompanyAppeal,
    editAppealRelevance: shared.actions.editAppealRelevance,
})(MyEventManagementCompanyAppealScreen)
