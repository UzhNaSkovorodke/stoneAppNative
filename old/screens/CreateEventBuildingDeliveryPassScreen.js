import React from 'react'
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { connect } from 'react-redux'

import CalendarButton from '../components/buttons/CalendarButton'
import DefaultButton from '../components/buttons/DefaultButton'
import ResidenceButton from '../components/buttons/ResidenceButton'
import CheckBox from '../components/custom/CheckBox'
import CommentLabel from '../components/custom/CommentLabel'
import SplitLine from '../components/custom/SplitLine'
import TextField from '../components/custom/TextField'

import shared from '../../store/index'
import commonStyles from '../styles/CommonStyles'
import reportError from '../utils/ReportError'
import { getTime, replaceSymbols } from '../utils/Utils'
import moment from 'moment'
import Modal from 'react-native-modalbox'

const styles = StyleSheet.create({
    buttonPressed: {
        color: '#747E90',
        fontSize: 14,
    },
    buttonNotPressed: {
        fontSize: 14,
    },
    comment: {
        width: '100%',
        height: 150,
        paddingTop: 16, // работает только так!
        paddingBottom: 16,
        marginTop: 10,
        backgroundColor: '#F7F7F9',
        borderRadius: 3,
        paddingHorizontal: 16,
        textAlignVertical: 'top',
    },
    dataContainer: {
        width: '100%',
        height: 250,
    },
    modalWindow: {
        width: '100%',
        height: 250,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    modalMainView: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF',
    },
    topModalView: {
        width: '100%',
        height: 38,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        shadowColor: '#111111',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    splitLine: {
        marginTop: 20,
        marginBottom: 20,
    },
    applyText: {
        marginRight: 20,
        color: '#747E90',
    },
    cancelText: {
        marginLeft: 20,
        color: '#111111',
    },
    splitLine2: {
        marginTop: 24,
        marginBottom: -3,
    },
    agreeUkWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        display: 'flex',
    },
})

class CreateEventBuildingDeliveryPassScreen extends React.Component {
    constructor(props) {
        super(props)
        this.currentTime = new Date()
        this.choiceTime = false

        this.state = {
            isAgreeUk: false,
            date: new Date() + 1000,
            projectList: props?.projects || [],
            selectedProject: props?.projects[0] || {},
            comment: '',
            guests: [],
            carData: {
                plateNumber: '',
                model: '',
            },
            isShowLoader: false,
        }
    }

    checkCarData = ({ carData }) => carData.plateNumber !== undefined && carData.plateNumber !== ''

    animateCheckBoxLayout = () => {
        const { checkAnimation } = this.state
        Animated.timing(checkAnimation, {
            toValue: Dimensions.get('window').width > 371 ? 235 : 310,
            delay: 100,
            duration: 600,
            useNativeDriver: false,
        }).start()
    }

    handleCheckBox = () => {
        const { isAgreeUk } = this.state
        this.setState(
            { isAgreeUk: !isAgreeUk, checkAnimation: new Animated.Value(1) },
            this.animateCheckBoxLayout
        )
    }

    onCheckResidence = ({ id }) => {
        this.setState(({ projectList }) => {
            const selectedProject = projectList.find((project) => project.projectId === id)
            return {
                selectedProject,
                roomList: selectedProject?.rooms,
                selectedRoom: selectedProject?.rooms[0],
            }
        })
    }

    onClickedSendButton = () => {
        const { selectedProject, date, comment, guests, carData } = this.state
        const { setError, sendPass, navigation, setSuccess } = this.props

        if (!this.checkCarData({ carData })) {
            setError([
                {
                    message:
                        'Пожалуйста, заполните все обязательные поля и проверьте корректность введенных данных.',
                },
            ])
        } else if (date < new Date()) {
            setError([{ message: 'Пожалуйста, установите правильное время.' }])
        } else {
            this.setState({ isShowLoader: true })
            sendPass({
                eventTypeId: 7,
                projectId: selectedProject.projectId,
                dateTime: date.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }),
                arrivalTypeId: 2, // deliveryTypeId
                byCar: true,
                guests,
                text: comment,
                car: carData,
            })
                .then(() => {
                    setSuccess([
                        {
                            message:
                                'Заказ успешно отправлен. Наши специалисты рассмотрят его в ближайшее время.',
                        },
                    ])
                    this.setState({ isShowLoader: false })
                    navigation.goBack()
                })
                .catch((error) => {
                    reportError(error, 'TaxiPassOrder/onClickedSendButton/sendPass')
                    this.setState({ isShowLoader: false })
                })
        }
    }

    onTimeButtonPressed = () => this.refs.timeDialog.open()

    saveGuests = (value, keyName) => {
        const { guests } = this.state
        if (guests[0] === undefined) {
            guests[0] = Object()
        }
        guests[0][keyName] = replaceSymbols(value) || ''
        this.setState({ guests })
    }

    saveDataAboutCar = (value, keyName) => {
        const { carData } = this.state
        carData[keyName] = replaceSymbols(value) || ''
        this.setState({ carData })
    }

    onSetDate = (dateStringFromPicker) => {
        const dateFromPicker = new Date(dateStringFromPicker)
        const { date } = this.state
        date.setFullYear(dateFromPicker.getFullYear())
        date.setMonth(dateFromPicker.getMonth())
        date.setDate(dateFromPicker.getDate())
        this.setState({ date })
    }

    getDate = (date) => {
        const currentDate = moment(date)
        currentDate.subtract(currentDate.get('minutes') % 5, 'm')
        return currentDate.toDate()
    }

    renderCarInfo = () => (
        <>
            <TextField
                label="Номер автомобиля"
                onChangeText={(text) => this.saveDataAboutCar(text, 'plateNumber')}
                required
            />

            <TextField
                label="Марка автомобиля"
                onChangeText={(text) => this.saveDataAboutCar(text, 'model')}
            />
        </>
    )

    getMappedRoomItems = ({ room, roomId }) => ({ text: room, id: roomId })

    getMappedProjects = ({ projectName, projectId }) => ({
        text: projectName,
        id: projectId,
    })

    render() {
        const { date, selectedProject, projectList, isShowLoader, isAgreeUk } = this.state
        const { navigation } = this.props

        return (
            <View>
                <ScrollView
                    ref={(ref) => {
                        this.scrollView = ref
                    }}>
                    <View style={[commonStyles.container, { paddingTop: 16 }]}>
                        <CommentLabel text="Выберите проект" required />
                        <ResidenceButton
                            onPress={() =>
                                navigation.navigate('ItemSelectionScreen', {
                                    title: 'Выбор проекта',
                                    onItemSelected: this.onCheckResidence,
                                    selectedId: selectedProject.projectId,
                                    itemList: projectList.map(this.getMappedProjects),
                                })
                            }
                            text={selectedProject.projectName}
                            isArrowVisible={projectList.length > 1}
                        />

                        <SplitLine style={styles.splitLine} />

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                <CommentLabel text="Дата" required />
                                <CalendarButton
                                    onPress={() => {
                                        navigation.navigate('CheckDateScreen', {
                                            onSetDate: this.onSetDate,
                                        })
                                    }}
                                    currentMode={moment(date).format('DD.MM.YYYY')}
                                />
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                <CommentLabel text="Время" required />
                                {/*<TimeButton*/}
                                {/*    onPress={this.onTimeButtonPressed}*/}
                                {/*    time={*/}
                                {/*        this.choiceTime === false*/}
                                {/*            ? getTime().format('HH:mm')*/}
                                {/*            : `${date.getHours()}:${*/}
                                {/*                  (date.getMinutes() < 10 ? '0' : '') +*/}
                                {/*                  (date.getMinutes() - (date.getMinutes() % 5))*/}
                                {/*              }`*/}
                                {/*    }*/}
                                {/*/>*/}
                            </View>
                        </View>

                        <SplitLine style={styles.splitLine2} />

                        <TextField
                            label="Телефон"
                            masked
                            keyboardType="phone-pad"
                            onChangeText={(mask) => this.saveGuests(mask, 'phoneNumber')}
                        />

                        <TextField
                            label="Имя"
                            onChangeText={(text) => this.saveGuests(text, 'name')}
                        />

                        <TextField
                            label="Фамилия"
                            onChangeText={(text) => this.saveGuests(text, 'surname')}
                        />

                        <TextField
                            label="Отчество"
                            onChangeText={(text) => this.saveGuests(text, 'patronymic')}
                        />
                        {this.renderCarInfo()}
                        <View style={styles.agreeUkWrapper}>
                            <CheckBox
                                label="Проект согласован с УК"
                                value={isAgreeUk}
                                onValueChange={() => this.handleCheckBox()}
                            />
                            <Text style={{ color: 'red', fontSize: this.props.posTop }}>*</Text>
                        </View>

                        <CommentLabel
                            style={{ marginTop: 30 }}
                            text="Укажите дополнительный комментарий"
                        />
                        <TextInput
                            style={styles.comment}
                            selectionColor="#747E90"
                            onFocus={() => this.scrollView.scrollToEnd({ animated: true })}
                            onChangeText={(text) => {
                                const comment = replaceSymbols(text, true)
                                this.setState({ comment })
                            }}
                            autoCapitalize="sentences"
                            multiline
                        />

                        <DefaultButton
                            onPress={() => this.onClickedSendButton()}
                            disabled={!isAgreeUk}
                            text="Отправить"
                            isShowLoader={isShowLoader}
                        />
                    </View>
                </ScrollView>
                <Modal position="bottom" style={styles.modalWindow} swipeArea={0} ref="timeDialog">
                    <View style={styles.modalMainView}>
                        <View style={styles.topModalView}>
                            <TouchableOpacity
                                onPress={() => {
                                    const { timeDialog } = this.refs
                                    timeDialog.close()
                                }}>
                                <Text style={styles.cancelText}>Отмена</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    const { timeDialog } = this.refs
                                    const currentDate = date
                                    currentDate.setHours(this.currentTime.getHours())
                                    currentDate.setMinutes(this.currentTime.getMinutes())
                                    this.setState({ date: currentDate })
                                    timeDialog.close()
                                }}>
                                <Text style={styles.applyText}>Применить</Text>
                            </TouchableOpacity>
                        </View>
                        {/*<DatePicker*/}
                        {/*    minuteInterval={5}*/}
                        {/*    mode="time"*/}
                        {/*    date={this.getDate(date)}*/}
                        {/*    onDateChange={(changedTime) => {*/}
                        {/*        this.currentTime = changedTime*/}
                        {/*        this.choiceTime = true*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </View>
                </Modal>
            </View>
        )
    }
}

export default connect(({ projects }) => ({ projects: projects.list }), {
    sendPass: shared.actions.sendPass,
    setError: shared.actions.error,
    setSuccess: shared.actions.success,
})(CreateEventBuildingDeliveryPassScreen)
