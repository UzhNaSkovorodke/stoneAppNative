import React from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {connect} from 'react-redux';

import DeleteImage from '../../../assets/oldImg/DeleteButton.png';
import FaceIdIcon from '../../../assets/oldImg/FaceId.png';
import TouchIdIcon from '../../../assets/oldImg/TouchIdIcon.png';
import shared from '../../../store/index';
import NumButton from '../../components/buttons/NumButton';
import {Fonts} from '../../utils/Fonts';
import TouchId from 'react-native-touch-id';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';

const {width} = Dimensions.get('window');
const buttonSize = width / 5.2;
const spaceTop = width / 25;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  pinStyles: {
    width: 10,
    height: 10,
    borderRadius: 50,
  },
  disabledPin: {
    borderWidth: 1,
    borderColor: '#707070',
  },
  selectedPin: {
    borderColor: '#747E90',
    backgroundColor: '#747E90',
  },
  textDescription: {
    width: '60%',
    marginTop: 20,
    marginBottom: 10,
    color: '#747E90',
    fontFamily: Fonts.TextLight,
    fontSize: 12,
    textAlign: 'center',
  },
  textTitle: {
    color: '#747E90',
    fontFamily: Fonts.TextLight,
    fontSize: 16,
  },
  blueButton: {
    width: buttonSize,
    height: buttonSize,
    borderWidth: 1.3,
    borderColor: '#747E90',
    borderRadius: 50,
    textAlign: 'center',
  },
  blueButtonNumber: {
    marginTop: 3,
    color: '#747E90',
    fontSize: 22,
    textAlign: 'center',
  },
  blueButtonText: {
    marginTop: -3,
    color: '#747E90',
    fontSize: 10,
    textAlign: 'center',
  },
  buttonBlueColumn: {
    flexDirection: 'row',
    marginTop: spaceTop,
  },
  deleteImage: {
    width: buttonSize * 0.8,
    height: buttonSize * 0.8,
    alignSelf: 'center',
    tintColor: '#747E90',
  },
  lostButtonText: {
    alignSelf: 'center',
    color: '#747E90',
    fontSize: buttonSize * 0.25,
  },
  touchIdStyles: {
    width: buttonSize * 0.7,
    height: buttonSize * 0.7,
  },
  faceIdStyles: {
    width: buttonSize * 0.6,
    height: buttonSize * 0.6,
  },
  pins: {
    width: '25%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

class PinCodeScreen extends React.Component {
  optionalConfigObject = {
    title: 'Необходима Авторизация', // Android
    imageColor: '#747E90', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Коснитесь Сенсора', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: '', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };

  constructor(props) {
    super(props);

    this.state = {
      countOfEnteredPins: 0,
      currentAttempt: 0,
      currentPassword: '',
      isFaceId: false,
      isTouchId: false,
      loadedPassword: '',
      maxAttempts: 10,
      modePinCode: '',
      secondPassword: '',
      touchIdAttempts: 0,
    };
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  handleBackButton = () => {
    // BackHandler.exitApp()
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    RNSecureStorage.exists('PinCode').then(isHas => {
      if (isHas) {
        TouchId.isSupported()
          .then(type => {
            if (type === 'TouchID' || type === true) {
              this.setState({isTouchId: true}, () => this.onTouchIdPressed());
            } else if (type === 'FaceID') {
              this.setState({isFaceId: true}, () => this.onTouchIdPressed());
            }
          })
          .catch(e => console.log(e));

        RNSecureStorage.getItem('PinCode').then(res => {
          this.setState({modePinCode: 'enter', loadedPassword: res});
          this.props.navigation.setParams({
            header: 'enter',
          });
        });
      } else {
        this.setState({modePinCode: 'create'});
        this.props.navigation.setParams({
          header: 'create',
        });
      }
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  firstCreatePassword = index => {
    const {countOfEnteredPins, currentPassword} = this.state;

    this.setState(
      {
        countOfEnteredPins: countOfEnteredPins + 1,
        currentPassword: currentPassword + index,
      },
      () =>
        this.state.currentPassword.length === 4 &&
        setTimeout(() => this.setState({countOfEnteredPins: 0}), 50),
    ); // Задержка перед очисткой, Импорт state не менять, т.к. метод асинхронный
  };

  secondCreatePassword = index => {
    const {secondPassword} = this.state;

    this.setState(
      {
        countOfEnteredPins: secondPassword.length + 1,
        secondPassword: secondPassword + index,
      },
      () => this.state.secondPassword.length === 4 && this.validateCreatedPin(),
    ); // Импорт state не менять, т.к. метод асинхронный
  };

  validateCreatedPin = async () => {
    const {currentPassword, secondPassword} = this.state;
    const {setError} = this.props;

    if (secondPassword === currentPassword) {
      RNSecureStorage.setItem('PinCode', currentPassword, {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });
      this.onSuccess();
    } else {
      this.setState({
        currentPassword: '',
        secondPassword: '',
        countOfEnteredPins: 0,
      });
      setError([{message: 'Вы ввели неверный пароль'}]);
    }
  };

  validateEnteredPin = async () => {
    let {currentAttempt} = this.state;
    const {currentPassword, loadedPassword, maxAttempts} = this.state;
    const {setError} = this.props;

    if (currentPassword === loadedPassword) {
      this.onSuccess();
      this.setState({currentPassword: ''});
    } else {
      currentAttempt += 1;

      if (currentAttempt >= maxAttempts) {
        this.onFail();
        return;
      }

      this.setState({currentPassword: '', currentAttempt});
      setError([{message: 'Вы ввели неверный пароль'}]);
    }
  };

  onFail = () => {
    const {navigation} = this.props;

    RNSecureStorage.remove('login');
    RNSecureStorage.remove('password');
    RNSecureStorage.remove('PinCode');

    navigation.navigate('SignInScreen');
  };

  onSuccess = () => {
    const {route, navigation} = this.props;
    const {fio} = route.params;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    navigation.navigate('GreetingScreen', {fio});
  };

  numButtonOnPress = index => {
    const {modePinCode} = this.state;
    if (modePinCode === 'create') {
      this.createPinOnPressButton(index);
    }
    if (modePinCode === 'enter') {
      this.enterPinOnPressButton(index);
    }
  };

  enterPinOnPressButton = index => {
    const {countOfEnteredPins, currentPassword} = this.state;
    this.setState(
      {
        countOfEnteredPins: countOfEnteredPins + 1,
        currentPassword: currentPassword + index,
      },
      () => {
        if (this.state.currentPassword.length !== 4) {
          return;
        }

        setTimeout(() => this.setState({countOfEnteredPins: 0}), 50);
        this.validateEnteredPin();
      },
    );
  };

  createPinOnPressButton = index =>
    this.state.currentPassword.length === 4
      ? this.secondCreatePassword(index)
      : this.firstCreatePassword(index);

  onTouchIdPressed = () => {
    const {isTouchId, isFaceId} = this.state;
    let {touchIdAttempts} = this.state;

    if (isFaceId) {
      TouchId.authenticate('Войти', this.optionalConfigObject)
        .then(() => this.onSuccess())
        .catch(() => {
          touchIdAttempts += 1;
          if (touchIdAttempts >= 3) {
            return;
          }

          this.setState({touchIdAttempts, isFaceId: false});
        });
    } else if (isTouchId) {
      TouchId.authenticate('Войти', this.optionalConfigObject)
        .then(() => this.onSuccess())
        .catch(() => {
          touchIdAttempts += 1;

          if (touchIdAttempts >= 3) {
            return;
          }
          this.setState({touchIdAttempts, isTouchId: false});
        });
    }
  };

  removeButtonOnPress = () => {
    const {currentPassword, secondPassword, countOfEnteredPins} = this.state;

    if (currentPassword.length === 4) {
      const removedStr = secondPassword.slice(0, -1);

      this.setState({
        secondPassword: removedStr !== undefined ? removedStr : '',
      });
    } else {
      const removedStr = currentPassword.slice(0, -1);

      this.setState({
        currentPassword: removedStr !== undefined ? removedStr : '',
      });
    }

    this.setState({
      countOfEnteredPins: countOfEnteredPins ? countOfEnteredPins - 1 : 0,
    });
  };

  renderPasswordCircles = () => {
    const {countOfEnteredPins} = this.state;
    const renderedPins = [];

    for (let i = 0; i < 4; i++) {
      renderedPins.push(
        <View
          style={[
            styles.pinStyles,
            i < countOfEnteredPins ? styles.selectedPin : styles.disabledPin,
          ]}
          key={i}
        />,
      );
    }

    return <View style={styles.pins}>{renderedPins}</View>;
  };

  renderButtons = () => (
    <>
      <View style={[styles.buttonBlueColumn, {marginTop: 0}]}>
        <NumButton numValue="1" wordValue="" onPress={this.numButtonOnPress} />
        <NumButton
          numValue="2"
          wordValue="АБВГ"
          onPress={this.numButtonOnPress}
        />
        <NumButton
          numValue="3"
          wordValue="ДЕЖЗ"
          onPress={this.numButtonOnPress}
        />
      </View>

      <View style={styles.buttonBlueColumn}>
        <NumButton
          numValue="4"
          wordValue="ИЙКЛ"
          onPress={this.numButtonOnPress}
        />
        <NumButton
          numValue="5"
          wordValue="МНОП"
          onPress={this.numButtonOnPress}
        />
        <NumButton
          numValue="6"
          wordValue="РСТУ"
          onPress={this.numButtonOnPress}
        />
      </View>

      <View style={styles.buttonBlueColumn}>
        <NumButton
          numValue="7"
          wordValue="ФХЦЧ"
          onPress={this.numButtonOnPress}
        />
        <NumButton
          numValue="8"
          wordValue="ШЩЪЫ"
          onPress={this.numButtonOnPress}
        />
        <NumButton
          numValue="9"
          wordValue="ЬЭЮЯ"
          onPress={this.numButtonOnPress}
        />
      </View>

      <View style={styles.buttonBlueColumn}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TouchableWithoutFeedback onPress={this.onFail}>
            <Text style={styles.lostButtonText}>Забыли?</Text>
          </TouchableWithoutFeedback>
        </View>
        <NumButton numValue="0" wordValue="" onPress={this.numButtonOnPress} />
        <View style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={this.removeButtonOnPress}>
            <Image
              resizeMode="contain"
              style={styles.deleteImage}
              source={DeleteImage}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </>
  );

  renderHeader = () => {
    const {modePinCode, currentPassword} = this.state;

    return modePinCode === 'enter' ? (
      <>
        <Text style={styles.textTitle}>Введите PIN-код</Text>
        {this.renderPasswordCircles()}
        <Text style={styles.textDescription} numberOfLines={2} />
      </>
    ) : (
      <>
        <Text style={styles.textTitle}>
          {currentPassword.length === 4
            ? 'Повторите пароль'
            : 'Придумайте PIN-код'}
        </Text>
        {this.renderPasswordCircles()}
        <Text style={styles.textDescription} numberOfLines={2}>
          Вы будете вводить его при каждом входе в приложение
        </Text>
      </>
    );
  };

  renderBottom = () => {
    const {modePinCode, isFaceId, isTouchId} = this.state;

    return (
      <>
        {modePinCode === 'enter' && (
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TouchableWithoutFeedback onPress={this.onTouchIdPressed}>
                <Image
                  style={styles.touchIdStyles}
                  source={isTouchId ? TouchIdIcon : null}
                />
              </TouchableWithoutFeedback>
            </View>
            <View style={{flex: 1}} />
            <View style={{flex: 1, alignItems: 'center'}}>
              <TouchableWithoutFeedback onPress={this.onTouchIdPressed}>
                <Image
                  style={styles.faceIdStyles}
                  source={isFaceId ? FaceIdIcon : null}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}
      </>
    );
  };

  render() {
    const {header} = this.props.route.params;

    return header === undefined ? (
      <View />
    ) : (
      <View style={styles.mainContainer}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
          {this.renderHeader()}
        </View>
        <View style={{flex: 5, alignItems: 'center', justifyContent: 'center'}}>
          {this.renderButtons()}
          {this.renderBottom()}
        </View>
      </View>
    );
  }
}

export default connect(null, {
  setError: shared.actions.error,
})(PinCodeScreen);
