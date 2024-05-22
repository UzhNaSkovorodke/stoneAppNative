import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
// import ReactNativePickerModule from 'react-native-picker-module';
import {connect} from 'react-redux';

import ImageContainer from './ImageContainer';
import ModalRoot, {openAgreementModal} from './RootModalsComponent';
import SpinLoader from './Spinner';
import SplitLine from './SplitLine';

import ClipIcon from '../../../assets/oldImg/Clip.png';
import SendIcon from '../../../assets/oldImg/Send.png';
// import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import shared from '../../../store/index.js';
import reportError from '../../utils/ReportError';
import {downloadFile} from '../../utils/Utils';
import moment from 'moment';

const styles = StyleSheet.create({
  profileImage: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#747E90',
    borderRadius: 40,
  },
  textProfileImage: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  messageTextContainer: {
    flexDirection: 'column',
    paddingTop: 14,
    paddingRight: 11,
    paddingBottom: 7,
    paddingLeft: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 5,
  },
  messageText: {
    color: '#111111',
    fontSize: 14,
  },
  messageDate: {
    alignSelf: 'flex-end',
    color: '#8E97A8',
    fontSize: 10,
  },
  messageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  messagesTitle: {
    marginBottom: 20,
    color: '#8E97A8',
    fontSize: 12,
  },
  messageUserName: {
    marginBottom: 11,
    color: '#111111',
    fontSize: 14,
  },
  mainMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  messageContainerWrapper: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 5,
    marginLeft: 15,
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: '#111111',
    transform: [{rotate: '45deg'}],
  },
  spinloader: {
    width: 20,
    height: 20,
    tintColor: '#111111',
  },
  sendButton: {
    width: 40,
    height: 40,
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 6,
    marginBottom: -4,
  },
  clipIcon: {
    width: 16,
    height: 16,
  },
  splitLine: {
    marginTop: 24,
  },
  closedWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  clipButton: {
    top: Platform.OS === 'ios' ? 0 : 10,
    width: 40,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -8,
    marginLeft: -8,
  },
  space: {
    width: 80,
    height: 68,
    alignSelf: 'center',
  },
  commentWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#8E97A8',
  },
  input: {
    top: Platform.OS === 'ios' ? -4 : 0,
    left: 2,
    width: '100%',
  },
  disabledSendButton: {
    opacity: 0,
  },
});

class Chat extends Component {
  constructor(props) {
    super(props);
    const {messages} = this.props;
    this.state = {
      data: [],
      needUpdate: false,
      text: '',
      messages: messages || [],
      isShowLoader: false,
    };
    this.maxLength = 2000;
  }

  checkContains = fileUri =>
    this.state.data.reduce(
      (sum, current) => (current.fileUri === fileUri ? sum + 1 : sum),
      0,
    ) > 0;

  removeData = id => {
    const {data, needUpdate} = this.state;
    data.find((value, index) => {
      if (value.key === id) {
        data.splice(index, 1);
        return true;
      }
      return false;
    });
    this.setState({needUpdate: !needUpdate, data});
  };

  getFilesLinksForSend = async data => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      let base64File;
      try {
        base64File = await RNFS.readFile(`${data[i].fileUri}`, 'base64');
      } catch {
        // Так нужно для Ios файлов с русским названием
        base64File = await RNFS.readFile(
          `${data[i].fileUri.slice(0, data[i].fileUri.lastIndexOf('/'))}/${
            data[i].fileName
          }`,
          'base64',
        );
      }

      result.push({
        fileName: data[i].fileName,
        fileContent: base64File,
      });
    }
    return result;
  };

  onClipPress = () => {
    const {data} = this.state;
    const {setError} = this.props;
    if (data.length >= 15) {
      setError([
        {
          message:
            'Общее количество прикрепленных файлов не должно превышать 15.',
        },
      ]);
      return;
    }
    this.pickerRef.show();
  };

  getColumns = () => Math.trunc(Dimensions.get('window').width / 80) - 1;

  getData = data => {
    if (data.length < 1) {
      return null;
    }

    const columns = this.getColumns();
    const arr = data.slice(0);
    let counter = Math.abs(columns - (data.length % columns));

    if (counter === columns) {
      counter = 0;
    }

    for (let i = 0; i < counter; i++) {
      arr.push({key: -1});
    }
    return arr;
  };

  getMessageAttachmentClickHandler = selectedFile => () => {
    openAgreementModal(this.modalRootContext, {
      message: Platform.OS === 'ios' ? 'Поделиться файлом?' : 'Сохранить файл?',
      onAcceptClicked: () => this.downloadFile(selectedFile),
    });
  };

  onPressSendMessageButton = async () => {
    const {sendComment, eventId} = this.props;
    const {text, data} = this.state;
    const sendText = text;
    const attachedFile = await this.getFilesLinksForSend(data);
    this.setState({text: '', data: []});
    this.setState({isShowLoader: true});
    sendComment({
      eventId,
      text: sendText.replace(/(\r\n|\n|\r)/gm, '\\n'),
      files: attachedFile,
    })
      .then(response => response.payload.data.postComment)
      .then(messages => {
        this.setState({messages}, () => {
          setTimeout(this.props.moveToEnd, 10);
        });
        this.setState({isShowLoader: false});
      })
      .catch(error => {
        reportError(error, 'Chat/onPressSendMessageButton');
        this.setState({text: sendText, isShowLoader: false});
      });
  };

  checkTextIncludes = (target, ...pattern) =>
    pattern.some(word => target.toLowerCase().endsWith(word));

  getFileType = fileName => {
    if (!fileName) {
      return undefined;
    }

    if (this.checkTextIncludes(fileName, '.png', '.jpg', '.jpeg', '.heic')) {
      return 'image';
    }
    if (this.checkTextIncludes(fileName, '.pdf')) {
      return 'pdf';
    }
    if (!this.checkTextIncludes('.exe')) {
      return 'other';
    }
    return 'exe';
  };

  downloadFile = selectedFile => {
    downloadFile(selectedFile).catch(err => console.error(err));
  };

  getUserInitial = val =>
    val
      ? val
          .replace(/[^a-zA-Zа-яА-Я]/g, '')
          .charAt(0)
          .toUpperCase()
      : '';

  openDocumentPicker() {
    const {data, needUpdate} = this.state;
    const {setError} = this.props;

    // DocumentPicker.show(
    //     {
    //         filetype: [DocumentPickerUtil.allFiles()],
    //     },
    //     (error, res) => {
    //         if (error || res.uri === null) {
    //             return
    //         }
    //
    //         if (this.checkContains(res.uri)) {
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
    //         const fileType = this.getFileType(res.fileName)
    //
    //         if (fileType === 'image') {
    //             dataNew = {
    //                 fileUri: res.uri,
    //                 fileName: res.fileName,
    //                 isImage: true,
    //                 key: data.length + 1,
    //             }
    //         } else if (fileType === 'pdf') {
    //             dataNew = {
    //                 fileUri: res.uri,
    //                 fileName: res.fileName,
    //                 isPdf: true,
    //                 key: data.length + 1,
    //             }
    //         } else if (fileType !== '.exe') {
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
    //         data.push(dataNew)
    //         this.setState(data)
    //         this.setState({ needUpdate: !needUpdate })
    //     }
    // )
  }

  openPhotoPicker() {
    const {data, needUpdate} = this.state;
    const {setError} = this.props;

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
    };
    ImagePicker.showImagePicker(options, res => {
      if (res.error && res.error === 'Photo library permissions not granted') {
        setError([
          {
            message:
              'Доступ к фото запрещен. Дать доступ можно в настройках приложения.',
          },
        ]);
      }

      if (res.error && res.error === 'Camera not available on simulator') {
        setError([
          {
            message:
              'Доступ к камере запрещен. Дать доступ можно в настройках приложения.',
          },
        ]);
      }

      if (res.didCancel || res.error || res.uri === null) {
        return;
      }

      if (this.checkContains(res.uri)) {
        setError([{message: 'Данный файл уже загружен.'}]);
        return;
      }
      if (res.fileSize > 10000000) {
        setError([{message: 'Размер файла не должен превышать 10 МБ.'}]);
        return;
      }

      data.push({
        fileUri: res.uri,
        fileName: res.fileName,
        isImage: true,
        key: data.length + 1,
      });

      this.setState(data);
      this.setState({needUpdate: !needUpdate});
    });
  }

  renderImageInitials = ({userName, userPatronymic}) => (
    <View style={[styles.profileImage]}>
      <Text style={styles.textProfileImage}>
        {`${this.getUserInitial(userName)}${this.getUserInitial(
          userPatronymic,
        )}`}
      </Text>
    </View>
  );

  renderMessageTextContainer = ({message, date}) => (
    <View style={styles.messageTextContainer}>
      <Text style={styles.messageText}>{message}</Text>
      <Text style={styles.messageDate}>{date}</Text>
    </View>
  );

  renderMessageAttachments = ({file}) => {
    if (!file) {
      return undefined;
    }

    return (
      <FlatList
        data={this.getData(file)}
        numColumns={this.getColumns()}
        renderItem={({item: {fileName, fileLink, key}}) => {
          const fileType = this.getFileType(fileName);
          return key !== -1 ? (
            <ImageContainer
              onClick={
                fileType !== 'image' &&
                this.getMessageAttachmentClickHandler({fileName, fileLink})
              }
              containerStyle={{
                marginTop: 5,
                marginBottom: 0,
              }}
              idComponent={{
                fileName,
                fileUri: fileLink,
                isImage: fileType === 'image',
                isPdf: fileType === 'pdf',
                isExe: fileType === 'exe',
              }}
            />
          ) : (
            <View style={styles.space} />
          ); // Фикс для грида
        }}
      />
    );
  };

  renderMessages = () => {
    const {messages} = this.state;
    let {serviceName} = this.props;
    serviceName = serviceName !== undefined ? serviceName : 'Консъерж';

    return (
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          const userName = item.userName !== '' ? item.userName : serviceName;
          return (
            <View style={{flexDirection: 'column'}}>
              <View style={styles.mainMessageContainer}>
                <View style={styles.messageTitleContainer}>
                  {item.avatar ? (
                    <Image
                      style={styles.profileImage}
                      source={{uri: `https:${item.avatar}`}}
                    />
                  ) : (
                    this.renderImageInitials({
                      userName,
                      userPatronymic: item.userPatronymic,
                    })
                  )}
                </View>
                <View style={styles.messageContainerWrapper}>
                  <View>
                    <Text style={styles.messageUserName}>{userName}</Text>
                    {this.renderMessageTextContainer({
                      message: item.text.replace(/<(?:.|\s)*?>/g, '\n'),
                      date: moment(item.createdAt).format('DD.MM.YYYY в HH:mm'),
                    })}
                  </View>
                  {this.renderMessageAttachments(item)}
                </View>
              </View>
            </View>
          );
        }}
      />
    );
  };

  render() {
    const {appealState} = this.props;
    const {needUpdate, messages, text, data, isShowLoader} = this.state;
    return (
      <View style={{flex: 1}}>
        {/*<ReactNativePickerModule*/}
        {/*    pickerRef={(e) => {*/}
        {/*        this.pickerRef = e*/}
        {/*    }}*/}
        {/*    title="Какой файл вы хотите прикрепить"*/}
        {/*    confirmButton="Выбрать"*/}
        {/*    cancelButton="Отмена"*/}
        {/*    items={['Фото', 'Документ']}*/}
        {/*    onValueChange={(value, index) =>*/}
        {/*        setTimeout(*/}
        {/*            () =>*/}
        {/*                index === 0 ? this.openPhotoPicker() : this.openDocumentPicker(),*/}
        {/*            700*/}
        {/*        )*/}
        {/*    }*/}
        {/*/>*/}
        <ModalRoot.ModalRootContext.Consumer>
          {context => {
            this.modalRootContext = context;
          }}
        </ModalRoot.ModalRootContext.Consumer>
        {messages.length > 0 && (
          <View>
            <Text style={styles.messagesTitle}>Комментарии</Text>
            {this.renderMessages()}
          </View>
        )}

        {data.length > 0 && this.props.isHasComment && (
          <SplitLine style={styles.splitLine} />
        )}

        <FlatList
          extraData={needUpdate}
          data={this.getData(data)}
          numColumns={this.getColumns()}
          renderItem={({item}) =>
            item.key > -1 ? (
              <ImageContainer
                onRemoveItem={this.removeData}
                idComponent={item}
              />
            ) : (
              <View style={styles.space} />
            )
          }
        />

        {appealState === 'Закрыто' ? (
          <View style={{marginBottom: 45}} />
        ) : (
          <View style={styles.closedWrapper}>
            <TouchableOpacity
              style={styles.clipButton}
              onPress={this.onClipPress}>
              <Image style={styles.clipIcon} source={ClipIcon} />
            </TouchableOpacity>
            <View style={styles.commentWrapper}>
              <View style={{flex: 9}}>
                <TextInput
                  style={styles.input}
                  multiline
                  onChangeText={changedText =>
                    this.setState({text: changedText})
                  }
                  onFocus={() => setTimeout(this.props.moveToEnd, 200)}
                  placeholder="Напишите комментарий"
                  placeholderTextColor="#8E97A8"
                  maxLength={this.maxLength}
                  value={text}
                />
              </View>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={this.onPressSendMessageButton}
                disabled={text.length === 0}>
                {isShowLoader ? (
                  <SpinLoader style={styles.spinloader} />
                ) : (
                  <Image
                    style={[
                      styles.sendIcon,
                      text.length === 0 && styles.disabledSendButton,
                    ]}
                    source={SendIcon}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default connect(null, {
  setError: shared.actions.error,
  sendComment: shared.actions.sendComment,
})(Chat);
