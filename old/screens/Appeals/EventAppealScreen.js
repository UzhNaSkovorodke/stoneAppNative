import React, { useEffect, useState } from "react";
import { Image, LogBox, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";

import Clip from "../../../assets/oldImg/Clip.png";
import shared from "../../../store/index";
import DefaultButton from "../../components/buttons/DefaultButton";
import ResidenceButton from "../../components/buttons/ResidenceButton";
import CommentLabel from "../../components/custom/CommentLabel";
import SplitLine from "../../components/custom/SplitLine";
import commonStyles from "../../styles/CommonStyles";
import { Fonts } from "../../utils/Fonts";
import reportError from "../../utils/ReportError";
import { replaceSymbols } from "../../utils/Utils";
import RNFetchBlob from "rn-fetch-blob";
import DocumentPicker from "react-native-document-picker";

const styles = StyleSheet.create({
  comment: {
    width: "100%",
    height: 200,
    paddingTop: 16, // работает только так!
    paddingBottom: 16,
    marginTop: 16,
    backgroundColor: "#F7F7F9",
    borderRadius: 3,
    paddingHorizontal: 16,
    textAlignVertical: "top",
  },
  buttonText: {
    fontSize: 14,
  },
  addFile: {
    color: "#111111",
    fontFamily: Fonts.DisplayLight,
    fontSize: 14,
  },
  filesContainer: {
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "#747E90",
    borderRadius: 3,
  },
  exitButtonContainer: {
    width: 12,
    height: 12,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-around",
    marginLeft: 45,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 1,
  },
  exitButtonStyle: {
    width: 6,
    height: 6,
    tintColor: "#FFFFFF",
  },
  imageWrapping: {
    width: "100%",
    height: 35,
    marginTop: 5,
    resizeMode: "contain",
  },
  textWrapping: {
    color: "#FFFFFF",
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
    backgroundColor: "transparent",
  },
  clipFileWrapper: {
    width: "100%",
    alignItems: "flex-end",
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
    color: "#111111",
    fontFamily: Fonts.TextRegular,
    fontSize: 16,
  },
});

const MANAGEMENT_COMPANY_APPEAL_TYPE_ID = 3;

const EventManagementCompanyAppealScreen = ({
                                              projects,
                                              route,
                                              navigation,
                                              sendPass,
                                              setError,
                                              setSuccess,
                                            }) => {
  const supportedProjects = projects.filter(({ projectId }) =>
    route.params.projectsId.includes(projectId),
  );
  const projectList = supportedProjects || [];

  const [data, setData] = useState(null);

  useEffect(() => {
  }, [data]);

  const readFileAsBase64 = async (uri) => {
    RNFetchBlob.fs
      .readFile(uri, "base64")
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        allowMultiSelection: true,

      });
      await readFileAsBase64(doc[0].uri);
    } catch (err) {

      if (DocumentPicker.isCancel(err))
        console.log("User cancelled the upload", err);
      else
        console.log(err);
    }
  };
  const [selectedProject, setSelectedProject] = useState(
    supportedProjects?.[0] || {},
  );
  const [appealTypeId] = useState(route.params.typeID);
  const [comment, setComment] = useState("");
  const [isDisableSend, setIsDisableSend] = useState(false);
  const [isShowLoader, setIsShowLoader] = useState(false);

  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);


  const getData = () => {
    if (data.length < 1) {
      return null;
    }

    const columns = getColumns();
    const arr = [...data];
    let counter = Math.abs(columns - (data.length % columns));

    if (counter === columns) {
      counter = 0;
    }

    for (let i = 0; i < counter; i++) {
      arr.push({ key: -1 });
    }
    return arr;
  };

  const onClickedSendButton = async () => {
    if (comment === "") {
      setError([
        {
          message:
            "Пожалуйста, заполните все обязательные поля и проверьте корректность введенных данных.",
        },
      ]);
    } else {
      setIsDisableSend(true);
      const attachedFile = await getFilesLinksForSend(data);
      setIsShowLoader(true);
      sendPass({
        eventTypeId: MANAGEMENT_COMPANY_APPEAL_TYPE_ID,
        projectId: selectedProject.projectId,
        appealTypeId,
        text: comment,
        attachedFile,
      })
        .then((resp) => {
          console.log(resp.payload.data.createEventRequest);
          setSuccess([
            {
              message: getMessageByAppealType(appealTypeId),
            },
          ]);
          setIsDisableSend(false);
          setIsShowLoader(false);
          navigation.goBack();
        })
        .catch(error => {
          console.log(error);
          reportError(
            error,
            "EventManagementCompanyAppealScreen/onClickedSendButton/sendPass",
          );
          setIsDisableSend(false);
          setIsShowLoader(false);
        });
    }
  };

  const getMessageByAppealType = typeID => {
    switch (typeID) {
      case 2:
        return "Обращение успешно создано. Спасибо, что обратились в управляющую компанию. Мы обязательно рассмотрим ваше обращение в ближайшее время.";
      case 5:
      case 6:
        return "Благодарим Вас за обращение в Отдел постпродажного сопровождения клиентов! Мы будем рады оказать Вам содействие и предоставим ответ в ближайшее время.";
      default:
        return "Обращение в УК успешно отправлено. Наши специалисты рассмотрят его в ближайшее время.";
    }
  };

  const getFilesLinksForSend = async (data) => {
    const result = [];
    result.push({
      fileName: "photo",
      fileContent: data,
    });
    return result;
  };


  const onCheckResidence = ({ id }) => {
    const selectedProject = projectList.find(
      project => project.projectId === id,
    );
    setSelectedProject(selectedProject);
    return {
      selectedProject,
      roomList: selectedProject?.rooms,
    };
  };

  return (
    <ScrollView
      scrollEventThrottle={16}
      ref={ref => {
        this.scrollView = ref;
      }}>
      <View style={[commonStyles.container, { paddingTop: 16 }]}>

        <CommentLabel text="Выберите проект" required />
        <ResidenceButton
          style={styles.residenceButton}
          textStyle={{ fontSize: 16, fontFamily: Fonts.TextLight }}
          onPress={() =>
            navigation.navigate("ItemSelectionScreen", {
              title: "Выбор проекта",
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
          onChangeText={text => setComment(replaceSymbols(text, true))}
          autoCapitalize="sentences"
          multiline
        />

        <View style={styles.clipFileWrapper}>
          <TouchableOpacity onPress={selectDoc}>
            <View style={{ flexDirection: "row" }}>
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
  );
};

export default connect(({ projects }) => ({ projects: projects.list }), {
  sendPass: shared.actions.sendPass,
  setError: shared.actions.error,
  setSuccess: shared.actions.success,
})(EventManagementCompanyAppealScreen);
