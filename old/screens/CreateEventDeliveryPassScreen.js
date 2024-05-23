import moment from "moment";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";
import Modal from "react-native-modalbox";
import { connect } from "react-redux";
import shared from "../../store/index";


import commonStyles from "../styles/CommonStyles";
import reportError from "../utils/ReportError";
import { getTime } from "../utils/Utils";
import ResidenceButton from "../components/buttons/ResidenceButton";
import CommentLabel from "../components/custom/CommentLabel";
import SplitLine from "../components/custom/SplitLine";
import CalendarButton from "../components/buttons/CalendarButton";
import TimeButton from "../components/buttons/TimeButton";
import RoundButton from "../components/buttons/RoundButton";
import TextField from "../components/custom/TextField";
import DefaultButton from "../components/buttons/DefaultButton";

const styles = StyleSheet.create({
  buttonPressed: {
    color: "#747E90",
    fontSize: 14,
  },
  buttonNotPressed: {
    fontSize: 14,
  },
  comment: {
    width: "100%",
    height: 150,
    paddingTop: 16, // работает только так!
    paddingBottom: 16,
    marginTop: 10,
    backgroundColor: "#F7F7F9",
    borderRadius: 3,
    paddingHorizontal: 16,
    textAlignVertical: "top",
  },
  dataContainer: {
    width: "100%",
    height: 250,
  },
  modalWindow: {
    width: "100%",
    height: 250,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  modalMainView: {
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  topModalView: {
    width: "100%",
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    shadowColor: "#111111",
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
    color: "#747E90",
  },
  cancelLabel: {
    marginLeft: 20,
    color: "#111111",
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
});

class DeliveryPassScreen extends React.Component {
  constructor(props) {
    super(props);
    this.currentTime = new Date();
    this.choiceTime = false;

    this.state = {
      deliveryTypeId: 1,
      date: getTime().toDate(),
      projectList: props?.projects || [],
      selectedProject: props?.projects[0] || {},
      comment: "",
      guests: [],
      carData: {
        plateNumber: "",
        model: "",
      },
      isShowLoader: false,
    };
  }

  checkCarData = ({ carData, deliveryTypeId }) =>
    deliveryTypeId === 1 ||
    (deliveryTypeId !== 1 &&
      carData.plateNumber !== undefined &&
      carData.plateNumber !== "");

  onClickedSendButton = () => {
    const { selectedProject, date, comment, guests, carData, deliveryTypeId } =
      this.state;
    const { setError, sendPass, navigation, setSuccess } = this.props;
    if (!this.checkCarData({ carData, deliveryTypeId })) {
      setError([
        {
          message:
            "Пожалуйста, заполните все обязательные поля и проверьте корректность введенных данных.",
        },
      ]);
    } else if (date < new Date()) {
      setError([{ message: "Пожалуйста, установите правильное время." }]);
    } else {
      this.setState({ isShowLoader: true });
      date?.setUTCHours(this.currentTime.getUTCHours());
      date?.setUTCMinutes(this.currentTime.getUTCMinutes());
      date?.setUTCSeconds(this.currentTime.getUTCSeconds());
      date?.setUTCMilliseconds(this.currentTime.getUTCMilliseconds());
      
      sendPass({
        eventTypeId: 4,
        projectId: selectedProject.projectId,
        dateTime: date.toISOString(),
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
                "Заказ успешно отправлен. Наши специалисты рассмотрят его в ближайшее время.",
            },
          ]);
          navigation.goBack();
        })
        .finally(() => this.setState({ isShowLoader: false }))
        .catch(() => {
          reportError(error =>
            reportError(
              error,
              "DeliveryPassScreen/onClickedSendButton/sendPass",
            ),
          );
        });
    }
  };

  onTimeButtonPressed = () => this.refs.timeDialog.open();

  saveGuests = (value, keyName) => {
    const { guests } = this.state;
    if (guests[0] === undefined) {
      guests[0] = Object();
    }
    guests[0][keyName] = value || "";
    this.setState({ guests });
  };

  saveDataAboutCar = (value, keyName) => {
    const { carData } = this.state;
    carData[keyName] = value || "";
    this.setState({ carData });
  };

  onSetDate = dateStringFromPicker => {
    const dateFromPicker = new Date(dateStringFromPicker);
    const { date } = this.state;
    date.setFullYear(dateFromPicker.getFullYear());
    date.setMonth(dateFromPicker.getMonth());
    date.setDate(dateFromPicker.getDate());
    this.setState({ date });
  };

  onCheckResidence = ({ id }) => {
    this.setState(({ projectList }) => {
      const selectedProject = projectList.find(
        project => project.projectId === id,
      );
      return {
        selectedProject,
        roomList: selectedProject?.rooms,
        selectedRoom: selectedProject?.rooms[0],
      };
    });
  };

  getDate = date => {
    const currentDate = moment(date);
    currentDate.subtract(currentDate.get("minutes") % 5, "m");
    return currentDate.toDate();
  };

  renderCarInfo = () => {
    const { deliveryTypeId } = this.state;
    return deliveryTypeId === 1 ? null : (
      <>
        <TextField
          label="Номер автомобиля"
          onChangeText={text => this.saveDataAboutCar(text, "plateNumber")}
          required
        />

        <TextField
          label="Марка автомобиля"
          onChangeText={text => this.saveDataAboutCar(text, "model")}
        />
      </>
    );
  };

  getMappedRoomItems = ({ room, roomId }) => ({ text: room, id: roomId });

  getMappedProjects = ({ projectName, projectId }) => ({
    text: projectName,
    id: projectId,
  });

  render() {
    const { date, selectedProject, projectList, deliveryTypeId, isShowLoader } =
      this.state;
    const { navigation } = this.props;

    return (
      <View>
        <ScrollView
          ref={ref => {
            this.scrollView = ref;
          }}>
          <View style={[commonStyles.container, { paddingTop: 16 }]}>
            <CommentLabel text="Выберите проект" required />
            <ResidenceButton
              onPress={() =>
                navigation.navigate("ItemSelectionScreen", {
                  title: "Выбор проекта",
                  onItemSelected: this.onCheckResidence,
                  selectedId: selectedProject.projectId,
                  itemList: projectList.map(this.getMappedProjects),
                })
              }
              text={selectedProject.projectName}
              isArrowVisible={projectList.length > 1}
            />

            <SplitLine style={styles.splitLine1} />

            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                <CommentLabel text="Дата" required />
                <CalendarButton
                  onPress={() => {
                    navigation.navigate("CheckDateScreen", {
                      onSetDate: this.onSetDate,
                    });
                  }}
                  currentMode={moment(date).format("DD.MM.YYYY")}
                />
              </View>
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                <CommentLabel text="Время" required />
                <TimeButton
                  onPress={this.onTimeButtonPressed}
                  time={
                    this.choiceTime === false
                      ? getTime().format("HH:mm")
                      : `${date.getHours()}:${
                        (date.getMinutes() < 10 ? "0" : "") +
                        (date.getMinutes() - (date.getMinutes() % 5))
                      }`
                  }
                />
              </View>
            </View>

            <View style={{ width: "100%" }}>
              <SplitLine style={styles.splitLine2} />
              <CommentLabel text="Тип доставки" required />
              <View style={{ flexDirection: "row" }}>
                <RoundButton
                  style={styles.onFootButton}
                  isSelected={deliveryTypeId === 1}
                  onPress={() => this.setState({ deliveryTypeId: 1 })}
                  text="Пешком"
                />
                <RoundButton
                  style={styles.onCarButton}
                  isSelected={deliveryTypeId === 2}
                  onPress={() => this.setState({ deliveryTypeId: 2 })}
                  text="На автомобиле"
                />
              </View>
            </View>

            <SplitLine style={styles.splitLine3} />

            <TextField
              label="Телефон"
              masked
              keyboardType="phone-pad"
              onChangeText={mask => this.saveGuests(mask, "phoneNumber")}
            />

            <TextField
              label="Имя"
              onChangeText={text => this.saveGuests(text, "name")}
            />

            <TextField
              label="Фамилия"
              onChangeText={text => this.saveGuests(text, "surname")}
            />

            <TextField
              label="Отчество"
              onChangeText={text => this.saveGuests(text, "patronymic")}
            />
            {this.renderCarInfo()}
            <CommentLabel
              style={{ marginTop: 30 }}
              text="Укажите дополнительный комментарий"
            />
            <TextInput
              style={styles.comment}
              selectionColor="#747E90"
              onFocus={() => this.scrollView.scrollToEnd({ animated: true })}
              onChangeText={text => {
                const comment = text.replace(/(\r\n|\n|\r)/gm, "\\n");
                this.setState({ comment });
              }}
              autoCapitalize="sentences"
              multiline
            />

            <DefaultButton
              onPress={() => this.onClickedSendButton()}
              text="Отправить"
              isShowLoader={isShowLoader}
            />
          </View>
        </ScrollView>
        <Modal
          style={styles.modalWindow}
          position="bottom"
          ref="timeDialog"
          swipeArea={0}>
          <View style={styles.modalMainView}>
            <View style={styles.topModalView}>
              <TouchableOpacity
                onPress={() => {
                  const { timeDialog } = this.refs;
                  timeDialog.close();
                }}>
                <Text style={styles.cancelLabel}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const { timeDialog } = this.refs;
                  const currentDate = date;
                  currentDate.setHours(this.currentTime.getHours());
                  currentDate.setMinutes(this.currentTime.getMinutes());
                  this.setState({ date: currentDate });
                  timeDialog.close();
                }}>
                <Text style={styles.acceptLabel}>Применить</Text>
              </TouchableOpacity>
            </View>
            <DatePicker
              minuteInterval={5}
              mode="time"
              date={this.getDate()}
              onDateChange={changedTime => {
                this.currentTime = changedTime;
                this.choiceTime = true;
              }}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

export default connect(({ projects }) => ({ projects: projects.list }), {
  sendPass: shared.actions.sendPass,
  setError: shared.actions.error,
  setSuccess: shared.actions.success,
})(DeliveryPassScreen);
