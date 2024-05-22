import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import shared from '../../../store/index'
import DefaultButton from '../../components/buttons/DefaultButton'
import Chat from '../../components/custom/Chat'
import CommentLabel from '../../components/custom/CommentLabel'
import ModalRoot from '../../components/custom/RootModalsComponent/index'
import Spinner from '../../components/custom/Spinner'
import SplitLine from '../../components/custom/SplitLine'
import { Fonts } from '../../utils/Fonts'
import { APPEAL_STATE_TYPES } from '../../utils/Utils'
import moment from 'moment'

const styles = StyleSheet.create({
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
        marginTop: 10,
        color: '#111111',
        fontFamily: Fonts.TextLight,
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
        width: 110,
        marginTop: 10,
        marginRight: 15,
    },
    commentContainer: {
        height: 200,
        padding: 16,
        marginTop: 10,
        marginBottom: 26,
        backgroundColor: '#F7F7F9',
    },
    splitLine: {
        marginTop: 24,
        marginBottom: 26,
    },
    underLine: {
        marginTop: 5,
        marginBottom: 26,
    },
    spinnerWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButton: {
        fontFamily: Fonts.DisplayCompactRegular,
        fontSize: 16,
    },
})

class MyEventChangeProfileAppealScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            isLoading: true,
            relevanceLoading: false,
        }
    }

    componentDidMount() {
        this.loadAppeal().finally(() => this.setState({ isLoading: false }))
    }

    loadAppeal = () => {
        const { route, fetchEditProfileAppeal } = this.props
        const { eventId } = route.params

        return fetchEditProfileAppeal({ eventId }).then((response) =>
            this.setState({ data: response.payload.data.getEvent })
        )
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
            <View style={{ flex: 1 }}>
                <ModalRoot.ModalRootContext.Consumer>
                    {(context) => {
                        this.modalRootContext = context
                    }}
                </ModalRoot.ModalRootContext.Consumer>
                <ScrollView
                    ref={(ref) => {
                        this.scrollView = ref
                    }}>
                    <View style={{ padding: 16 }}>
                        <Text style={styles.label}>{data.eventTypeName}</Text>
                        <Text style={styles.date}>
                            {moment(data.createdAt).format('DD.MM.YYYY')}
                        </Text>

                        {data.statusName && (
                            <>
                                <CommentLabel text="Статус" />
                                <Text style={styles.text}>{data.statusName}</Text>
                                <SplitLine style={styles.underLine} />
                            </>
                        )}

                        {data.fio && (
                            <>
                                <CommentLabel text="ФИО" />
                                <Text style={styles.text}>{data.fio}</Text>
                                <SplitLine style={styles.underLine} />
                            </>
                        )}

                        {data.phone && (
                            <>
                                <CommentLabel text="Телефон" />
                                <Text style={styles.text}>{data.phone}</Text>
                                <SplitLine style={styles.underLine} />
                            </>
                        )}

                        {data.email && (
                            <>
                                <CommentLabel text="Электронная почта" />
                                <Text style={styles.text}>{data.email || ''}</Text>
                                <SplitLine style={styles.underLine} />
                            </>
                        )}

                        <Chat
                            messages={data.comment}
                            eventId={eventId}
                            serviceName={data.appealTypeName}
                            moveToEnd={this.moveToEnd}
                            appealState={data.statusName}
                            isHasComment={data.additionalComment && data.additionalComment.text}
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
    fetchEditProfileAppeal: shared.actions.fetchEditProfileAppeal,
    editAppealRelevance: shared.actions.editAppealRelevance,
})(MyEventChangeProfileAppealScreen)
