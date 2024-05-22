import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import CalendarButton from '../components/buttons/CalendarButton'
import DefaultButton from '../components/buttons/DefaultButton'
import ResidenceButton from '../components/buttons/ResidenceButton'
import RoundButton from '../components/buttons/RoundButton'
import CommentLabel from '../components/custom/CommentLabel'
import SplitLine from '../components/custom/SplitLine'
import TextField from '../components/custom/TextField'

import shared from '../../store/index'
import commonStyles from '../styles/CommonStyles'
import reportError from '../utils/ReportError'
import moment from 'moment'
// import DatePicker from 'react-native-date-picker'
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
    splitLine1: {
        marginTop: 20,
        marginBottom: 20,
    },
    splitLine2: {
        marginTop: 24,
        marginBottom: 20,
    },
    splitLine3: {
        marginTop: 24,
        marginBottom: -3,
    },
    acceptLabel: {
        marginRight: 20,
        color: '#747E90',
    },
    cancelLabel: {
        marginLeft: 20,
        color: '#111111',
    },
    onFootButton: {
        width: 100,
        height: 40,
        marginTop: 10,
        marginRight: 16,
    },
    onCarButton: {
        width: 134,
        height: 40,
        marginTop: 10,
    },
})

const DeliveryPassScreen = ({ projects, sendPass, setError, setSuccess, navigation }) => {
    const [deliveryTypeId, setDeliveryTypeId] = useState(1)
    const [date, setDate] = useState(new Date() + 1000)
    const [selectedProject, setSelectedProject] = useState(projects[0] || {})
    const [comment, setComment] = useState('')
    const [guests, setGuests] = useState([])
    const [carData, setCarData] = useState({ plateNumber: '', model: '' })
    const [isShowLoader, setIsShowLoader] = useState(false)
    const [choiceTime, setChoiceTime] = useState(false)

    const scrollViewRef = useRef(null)
    const timeDialogRef = useRef(null)
    const currentTimeRef = useRef(new Date())

    const checkCarData = ({ carData, deliveryTypeId }) =>
        deliveryTypeId === 1 ||
        (deliveryTypeId !== 1 && carData.plateNumber !== undefined && carData.plateNumber !== '')

    const onClickedSendButton = () => {
        if (!checkCarData({ carData, deliveryTypeId })) {
            setError([
                {
                    message:
                        'Пожалуйста, заполните все обязательные поля и проверьте корректность введенных данных.',
                },
            ])
        } else if (date < new Date()) {
            setError([{ message: 'Пожалуйста, установите правильное время.' }])
        } else {
            setIsShowLoader(true)

            sendPass({
                eventTypeId: 4,
                projectId: selectedProject.projectId,
                dateTime: date.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }),
                arrivalTypeId: deliveryTypeId,
                byCar: deliveryTypeId !== 1,
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
                    navigation.goBack()
                })
                .finally(() => setIsShowLoader(false))
                .catch(() => {
                    reportError((error) =>
                        reportError(error, 'DeliveryPassScreen/onClickedSendButton/sendPass')
                    )
                })
        }
    }

    const onTimeButtonPressed = () => timeDialogRef.current.open()

    const saveGuests = (value, keyName) => {
        setGuests([{ ...guests[0], [keyName]: value }])
    }

    const saveDataAboutCar = (value, keyName) => {
        setCarData({ ...carData, [keyName]: value })
    }

    const onSetDate = (dateStringFromPicker) => {
        const dateFromPicker = new Date(dateStringFromPicker)
        const newDate = new Date(date)
        newDate.setFullYear(dateFromPicker.getFullYear())
        newDate.setMonth(dateFromPicker.getMonth())
        newDate.setDate(dateFromPicker.getDate())
        setDate(newDate)
    }

    const onCheckResidence = ({ id }) => {
        const selectedProject = projects.find((project) => project.projectId === id)
        setSelectedProject(selectedProject)
    }

    const getDate = (date) => {
        const currentDate = moment(date)
        currentDate.subtract(currentDate.get('minutes') % 5, 'm')
        return currentDate.toDate()
    }

    const renderCarInfo = () => {
        return deliveryTypeId === 1 ? null : (
            <>
                <TextField
                    label="Номер автомобиля"
                    onChangeText={(text) => saveDataAboutCar(text, 'plateNumber')}
                    required
                />
                <TextField
                    label="Марка автомобиля"
                    onChangeText={(text) => saveDataAboutCar(text, 'model')}
                />
            </>
        )
    }
    const getMappedProjects = ({ projectName, projectId }) => ({
        text: projectName,
        id: projectId,
    })

    return (
        <View>
            <ScrollView ref={scrollViewRef}>
                <View style={[commonStyles.container, { paddingTop: 16 }]}>
                    <CommentLabel text="Выберите проект" required />
                    <ResidenceButton
                        onPress={() =>
                            navigation.navigate('ItemSelectionScreen', {
                                title: 'Выбор проекта',
                                onItemSelected: onCheckResidence,
                                selectedId: selectedProject.projectId,
                                itemList: projects.map(getMappedProjects),
                            })
                        }
                        text={selectedProject.projectName}
                        isArrowVisible={projects.length > 1}
                    />

                    <SplitLine style={styles.splitLine1} />

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <CommentLabel text="Дата" required />
                            <CalendarButton
                                onPress={() => {
                                    navigation.navigate('CheckDateScreen', {
                                        onSetDate: onSetDate,
                                    })
                                }}
                                currentMode={moment(date).format('DD.MM.YYYY')}
                            />
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <CommentLabel text="Время" required />
                            {/*<TimeButton*/}
                            {/*    onPress={onTimeButtonPressed}*/}
                            {/*    time={*/}
                            {/*        (date.getMinutes() < 10 ? '0' : '') +*/}
                            {/*        (date.getMinutes() - (date.getMinutes() % 5))*/}
                            {/*    }*/}
                            {/*/>*/}
                        </View>
                    </View>

                    <View style={{ width: '100%' }}>
                        <SplitLine style={styles.splitLine2} />
                        <CommentLabel text="Тип доставки" required />
                        <View style={{ flexDirection: 'row' }}>
                            <RoundButton
                                style={styles.onFootButton}
                                isSelected={deliveryTypeId === 1}
                                onPress={() => setDeliveryTypeId(1)}
                                text="Пешком"
                            />
                            <RoundButton
                                style={styles.onCarButton}
                                isSelected={deliveryTypeId === 2}
                                onPress={() => setDeliveryTypeId(2)}
                                text="На автомобиле"
                            />
                        </View>
                    </View>

                    <SplitLine style={styles.splitLine3} />

                    <TextField
                        label="Телефон"
                        masked
                        keyboardType="phone-pad"
                        onChangeText={(mask) => saveGuests(mask, 'phoneNumber')}
                    />

                    <TextField label="Имя" onChangeText={(text) => saveGuests(text, 'name')} />

                    <TextField
                        label="Фамилия"
                        onChangeText={(text) => saveGuests(text, 'surname')}
                    />

                    <TextField
                        label="Отчество"
                        onChangeText={(text) => saveGuests(text, 'patronymic')}
                    />
                    {renderCarInfo()}
                    <CommentLabel
                        style={{ marginTop: 30 }}
                        text="Укажите дополнительный комментарий"
                    />
                    <TextInput
                        style={styles.comment}
                        selectionColor="#747E90"
                        onFocus={() => {
                            // this.scrollView.scrollToEnd({ animated: true })
                        }}
                        onChangeText={(text) => {
                            const comment = text.replace(/(\r\n|\n|\r)/gm, '\\n')
                            setComment(comment)
                        }}
                        autoCapitalize="sentences"
                        multiline
                    />

                    <DefaultButton
                        onPress={() => onClickedSendButton()}
                        text="Отправить"
                        isShowLoader={isShowLoader}
                    />
                </View>
            </ScrollView>
            <Modal style={styles.modalWindow} position="bottom" ref={timeDialogRef} swipeArea={0}>
                <View style={styles.modalMainView}>
                    <View style={styles.topModalView}>
                        <TouchableOpacity
                            onPress={() => {
                                // const { timeDialog } = this.refs
                                // timeDialog.close()
                            }}>
                            <Text style={styles.cancelLabel}>Отмена</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                // const { timeDialog } = this.refs
                                // const currentDate = date
                                // currentDate.setHours(this.currentTime.getHours())
                                // currentDate.setMinutes(this.currentTime.getMinutes())
                                // this.setState({ date: currentDate })
                                // timeDialog.close()
                            }}>
                            <Text style={styles.acceptLabel}>Применить</Text>
                        </TouchableOpacity>
                    </View>
                    {/*<DatePicker*/}
                    {/*    minuteInterval={5}*/}
                    {/*    mode="time"*/}
                    {/*    date={this.getDate()}*/}
                    {/*    onDateChange={(changedTime) => {*/}
                    {/*        this.currentTime = changedTime*/}
                    {/*        this.choiceTime = true*/}
                    {/*    }}*/}
                </View>
            </Modal>
        </View>
    )
}

export default connect(({ projects }) => ({ projects: projects.list }), {
    sendPass: shared.actions.sendPass,
    setError: shared.actions.error,
    setSuccess: shared.actions.success,
})(DeliveryPassScreen)
