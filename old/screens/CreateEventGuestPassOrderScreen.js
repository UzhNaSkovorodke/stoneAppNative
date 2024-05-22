import React from 'react'
import {
    Animated,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native'
import { connect } from 'react-redux'

import Close from '../../assets/oldImg/Exit.png'

import CalendarButton from '../components/buttons/CalendarButton'
import DefaultButton from '../components/buttons/DefaultButton'
import ResidenceButton from '../components/buttons/ResidenceButton'
import RoundButton from '../components/buttons/RoundButton'
import CheckBox from '../components/custom/CheckBox'
import CommentLabel from '../components/custom/CommentLabel'
import SplitLine from '../components/custom/SplitLine'
import TextField from '../components/custom/TextField'

import shared from '../../store/index'
import commonStyles from '../styles/CommonStyles'
import { Fonts } from '../utils/Fonts'
import reportError from '../utils/ReportError'
import { replaceSymbols } from '../utils/Utils'
import moment from 'moment'
// import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modalbox'

const styles = StyleSheet.create({
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
    deleteGuest: {
        width: 10,
        height: 10,
        tintColor: '#111111',
    },
    plus: {
        marginBottom: 3,
        color: '#111111',
        fontFamily: Fonts.TextRegular,
        fontSize: 20,
    },
    addGuestText: {
        marginRight: 16,
        color: '#111111',
        fontFamily: Fonts.TextRegular,
        fontSize: 16,
    },
    addGuestView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 45.5,
        paddingBottom: 40,
    },
    deleteGuestButton: {
        position: 'absolute',
        width: 18,
        height: 18,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginTop: 10,
    },
    cancelText: {
        marginLeft: 20,
        color: '#111111',
    },
    splitLine1: {
        marginTop: 24,
        marginBottom: 20,
    },
    splitLine2: {
        marginTop: 28,
        marginBottom: 0,
    },
    onCarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonSend: {
        marginBottom: 12,
    },
})

class CreateEventGuestPassOrderScreen extends React.Component {
    constructor(props) {
        super(props)
        this.currentTime = new Date()
        this.choiceTime = false

        this.state = {
            isOnCar: false,
            comment: '',
            date: new Date() + 1000,
            projectList: props?.projects || [],
            selectedProject: props?.projects[0] || {},
            guestCount: 1,
            fadeAnim: new Animated.Value(10),
            checkAnimation: new Animated.Value(1),
            guests: [],
            carData: {
                plateNumber: '',
                parkingPlaceTypeId: 1,
            },
            isShowLoader: false,
        }
    }

    isGuestParking = () => {
        return (
            this.state.selectedProject.projectName === 'Art Residence' ||
            this.state.selectedProject.projectName === 'Manhattan'
        )
    }

    animateCheckBoxLayout = () => {
        const { checkAnimation } = this.state
        Animated.timing(checkAnimation, {
            toValue: Dimensions.get('window').width > 371 ? 235 : 310,
            delay: 100,
            duration: 600,
            useNativeDriver: false,
        }).start()
    }

    startAnimation = () => {
        const { fadeAnim } = this.state
        Animated.timing(fadeAnim, {
            toValue: 260,
            delay: 100,
            duration: 600,
            useNativeDriver: false,
        }).start()
    }

    handleCheckBox = () => {
        const { isOnCar } = this.state
        this.setState(
            { isOnCar: !isOnCar, checkAnimation: new Animated.Value(1) },
            this.animateCheckBoxLayout
        )
    }

    onDeleteGuest = (index) => {
        const { guests, guestCount } = this.state
        guests.splice(index, 1)
        this.setState({ guests, guestCount: guestCount - 1 })
    }

    onTimeButtonPressed = () => {
        const { timeDialog } = this.refs
        timeDialog.open()
    }

    saveGuests = (value, index, keyName) => {
        const { guests } = this.state
        guests[index][keyName] = value !== undefined ? replaceSymbols(value) : ''
        this.setState({ guests })
    }

    saveDataAboutCar = (value, keyName) => {
        const { carData } = this.state
        carData[keyName] = replaceSymbols(value) || ''
        this.setState({ carData })
    }

    renderGuests = () => {
        const { fadeAnim, guestCount, guests } = this.state
        const data = []

        for (let index = 0; index < guestCount; index++) {
            if (guests[index] === undefined) {
                guests[index] = Object()
            }
            data.push(
                <Animated.View
                    style={
                        guestCount > 1 && index === guestCount - 1
                            ? {
                                  useNativeDriver: false,

                                  height: fadeAnim,
                                  width: '100%',
                                  overflow: 'hidden',
                              }
                            : styles.dataContainer
                    }
                    key={index}>
                    <View
                        style={
                            Platform.OS === 'ios'
                                ? { alignItems: 'flex-end', zIndex: 1 }
                                : { alignItems: 'flex-end' }
                        }>
                        <TouchableOpacity
                            style={styles.deleteGuestButton}
                            onPress={() => this.onDeleteGuest(index)}>
                            <Image style={styles.deleteGuest} source={index !== 0 ? Close : null} />
                        </TouchableOpacity>
                    </View>

                    <TextField
                        label="Телефон"
                        masked
                        keyboardType="phone-pad"
                        onChangeText={(mask) => this.saveGuests(mask, index, 'phoneNumber')}
                    />

                    <TextField
                        label="Имя"
                        value={guests[index].name !== undefined ? guests[index].name : ''}
                        onChangeText={(text) => this.saveGuests(text, index, 'name')}
                        required
                    />

                    <TextField
                        label="Фамилия"
                        value={guests[index].surname !== undefined ? guests[index].surname : ''}
                        onChangeText={(text) => this.saveGuests(text, index, 'surname')}
                    />

                    <TextField
                        label="Отчество"
                        value={
                            guests[index].patronymic !== undefined ? guests[index].patronymic : ''
                        }
                        onChangeText={(text) => this.saveGuests(text, index, 'patronymic')}
                    />
                </Animated.View>
            )
        }
        return data
    }

    onAddGuest = () => {
        const { guestCount } = this.state
        if (guestCount > 4) {
            return
        }

        this.setState({
            guestCount: guestCount + 1,
            fadeAnim: new Animated.Value(10),
        })
    }

    onSetDate = (dateStringFromPicker) => {
        const dateFromPicker = new Date(dateStringFromPicker)
        const { date } = this.state
        date.setFullYear(dateFromPicker.getFullYear())
        date.setMonth(dateFromPicker.getMonth())
        date.setDate(dateFromPicker.getDate())
        this.setState({ date })
    }

    onCheckResidence = ({ id }) => {
        const reselectedProject = this.state.projectList.find((project) => project.projectId === id)
        if (reselectedProject.projectName === 'Tribeca Apartments') {
            this.setState({ isOnCar: false })
        }

        if (
            reselectedProject.projectName !== 'Manhattan' ||
            reselectedProject.projectName !== 'Art Residence'
        ) {
            this.setState({ carData: { plateNumber: '', parkingPlaceTypeId: 1 } })
        }

        this.setState(({ projectList }) => {
            const selectedProject = projectList.find((project) => project.projectId === id)
            return {
                selectedProject,
                roomList: selectedProject?.rooms,
                selectedRoom: selectedProject?.rooms[0],
            }
        })
    }

    checkNameContainsInGuests = (guests) => {
        const { guestCount } = this.state

        for (let i = 0; i < guestCount; i++) {
            if (guests[i] === undefined || guests[i].name === undefined || guests[i].name === '') {
                return false
            }
        }
        return true
    }

    checkCarData = (carData, isOnCar) =>
        isOnCar ? carData.plateNumber !== undefined && carData.plateNumber !== '' : true

    getMappedRoomItems = ({ room, roomId }) => ({ text: room, id: roomId })

    getMappedProjects = ({ projectName, projectId }) => ({
        text: projectName,
        id: projectId,
    })

    onClickedSendButton = () => {
        const { isOnCar, selectedProject, date, guests, carData, comment } = this.state
        const { setError, sendPass, navigation, setSuccess } = this.props

        if (!this.checkNameContainsInGuests(guests) || !this.checkCarData(carData, isOnCar)) {
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
                eventTypeId: 1,
                projectId: selectedProject.projectId,
                dateTime: date.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }),
                arrivalTypeId: isOnCar ? 2 : 1,
                byCar: isOnCar,
                guests,
                text: comment,
                car: isOnCar ? carData : null,
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
                    reportError(error, 'GuestPassOrder/onClickedSendButton/sendPass')
                    this.setState({ isShowLoader: false })
                })
        }
    }

    getDate = (date) => {
        const currentDate = moment(date)
        currentDate.subtract(currentDate.get('minutes') % 5, 'm')
        return currentDate.toDate()
    }

    render() {
        let onCarView
        const {
            isOnCar,
            date,
            selectedProject,
            carData,
            checkAnimation,
            projectList,
            isShowLoader,
        } = this.state
        const { navigation } = this.props

        if (isOnCar) {
            onCarView = (
                <Animated.View
                    style={{
                        marginTop: 0,
                        width: '100%',
                        height: checkAnimation,
                        useNativeDriver: false,
                    }}>
                    <View style={{ width: '100%' }}>
                        <TextField
                            label="Номер автомобиля"
                            onChangeText={(text) => this.saveDataAboutCar(text, 'plateNumber')}
                            required
                        />

                        <TextField
                            label="Марка автомобиля"
                            onChangeText={(text) => this.saveDataAboutCar(text, 'model')}
                        />

                        {/* Костыль */}
                        <View style={{ height: 30 }} />

                        <CommentLabel
                            text="Парковочное место"
                            required
                            viewStyle={{ marginBottom: 10 }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                            }}>
                            <RoundButton
                                style={{ width: 165, marginRight: 20, marginTop: 0 }}
                                onPress={() => {
                                    carData.parkingPlaceTypeId = 1
                                    this.setState({ carData })
                                }}
                                isSelected={carData.parkingPlaceTypeId === 1}
                                text="Собственное место"
                            />
                            {this.isGuestParking() && (
                                <RoundButton
                                    style={{
                                        width: 155,
                                        marginTop: Dimensions.get('window').width > 371 ? 0 : 30,
                                    }}
                                    onPress={() => {
                                        carData.parkingPlaceTypeId = 2
                                        this.setState({ carData })
                                    }}
                                    isSelected={carData.parkingPlaceTypeId === 2}
                                    text="Гостевая парковка"
                                />
                            )}
                        </View>
                    </View>
                </Animated.View>
            )
        }
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

                        <SplitLine style={styles.splitLine1} />

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                <CommentLabel text="Дата" required />
                                <CalendarButton
                                    currentMode={moment(date).format('DD.MM.YYYY')}
                                    onPress={() => {
                                        navigation.navigate('CheckDateScreen', {
                                            onSetDate: this.onSetDate,
                                        })
                                    }}
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
                        {this.renderGuests()}
                        {this.startAnimation()}
                        <TouchableHighlight onPress={this.onAddGuest} underlayColor="transparent">
                            <View style={styles.addGuestView}>
                                <Text style={styles.addGuestText}>Добавить гостя</Text>
                                <Text style={styles.plus}>+</Text>
                            </View>
                        </TouchableHighlight>

                        <SplitLine style={{ marginTop: 0 }} />

                        {selectedProject.projectName !== 'Tribeca Apartments' && (
                            <View style={styles.onCarWrapper}>
                                <CheckBox
                                    label="На автомобиле"
                                    value={isOnCar}
                                    onValueChange={() => this.handleCheckBox()}
                                />
                            </View>
                        )}

                        {onCarView}

                        <View style={{ backgroundColor: '#FFFFFF', width: '100%' }}>
                            <CommentLabel
                                style={{ marginTop: 20 }}
                                text="Укажите дополнительный комментарий"
                            />
                            <TextInput
                                style={styles.comment}
                                selectionColor="#747E90"
                                onChangeText={(text) => {
                                    const comment = replaceSymbols(text, true)
                                    this.setState({ comment })
                                }}
                                onFocus={() => this.scrollView.scrollToEnd({ animated: true })}
                                autoCapitalize="sentences"
                                multiline
                            />

                            <DefaultButton
                                onPress={this.onClickedSendButton}
                                style={styles.buttonSend}
                                text="Отправить"
                                isShowLoader={isShowLoader}
                            />
                        </View>
                    </View>
                </ScrollView>

                <Modal style={styles.modalWindow} position="bottom" ref="timeDialog" swipeArea={0}>
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
                                <Text style={{ color: '#747E90', marginRight: 20 }}>Применить</Text>
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
})(CreateEventGuestPassOrderScreen)
