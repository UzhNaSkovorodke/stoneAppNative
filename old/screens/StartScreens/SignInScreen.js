import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';

import StoneHedge from '../../../assets/oldImg/StoneHedge.png';
import shared from '../../../store/index';
import DefaultButton from '../../components/buttons/DefaultButton';
import CircleCheckBox from '../../components/custom/CircleCheckBox';
import ModalPrivacyPolicy from '../../components/custom/ModalPrivacyPolicy';
import {Fonts} from '../../utils/Fonts';
import reportError from '../../utils/ReportError';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 24,
  },
  textForgot: {
    alignSelf: 'flex-end',
    marginRight: 10,
    color: '#747E90',
    fontFamily: Fonts.DisplayLight,
    fontSize: 12,
  },
  login: {
    height: 60,
    paddingTop: 25,
    paddingBottom: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E6E6E6',
    color: '#747E90',
    fontStyle: 'italic',
  },
  password: {
    height: 60,
    paddingTop: 25,
    paddingBottom: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E6E6E6',
    color: '#747E90',
    fontStyle: 'italic',
  },
  imageLabel: {
    width: '100%',
    resizeMode: 'contain',
    tintColor: '#222221',
  },
  buttonPasswordForgot: {
    width: '50%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxLabel: {
    justifyContent: 'center',
    color: '#747E90',
    fontFamily: Fonts.DisplayLight,
    fontSize: 12,
  },
  agreementCheckBoxText: {
    color: '#747E90',
    fontFamily: Fonts.DisplayLight,
    fontSize: 11,
  },
  agreementCheckBoxLink: {
    textDecorationLine: 'underline',
  },
  agreementCheckBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
  },
  additionalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  textButton: {
    fontFamily: Fonts.DisplayCompactRegular,
    fontSize: 16,
  },
  signInButton: {
    marginTop: 80,
    marginBottom: 0,
  },
});

function SignInScreen({navigation, fetchProfile, auth}) {
  const modalPrivacyPolicyRef = React.createRef();
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [isProgress, setIsProgress] = useState(false);
  const [login, setLogin] = useState(__DEV__ ? 'extra1' : '');
  const [password, setPassword] = useState(__DEV__ ? 'extra1extra1' : '');

  const openPolicyModal = async () => {
    // modalPrivacyPolicyRef.current.open();
  };

  const handleCheckBox = () => {
    setIsRememberMe(prev => !prev);
  };

  const signIn = () => {
    setIsProgress(true);
    auth({login, password})
      .then(() => {
        RNSecureStorage.getItem('login')
          .then(() => {
            signInSuccess();
          })
          .catch(() => {
            //openPolicyModal();
            signInSuccess();
          });
      })
      .catch(error => {
        reportError(error, 'SingIn/signIn');
      })
      .finally(() => setIsProgress(false));
  };

  const signInSuccess = () => {
    console.log('');
    fetchProfile()
      .then(res => {
        RNSecureStorage.setItem('login', login, {
          accessible: ACCESSIBLE.WHEN_UNLOCKED,
        });
        if (isRememberMe) {
          RNSecureStorage.setItem('password', password, {
            accessible: ACCESSIBLE.WHEN_UNLOCKED,
          });
        }
        const fio =
          (res.payload.data.profile && res.payload.data.profile.fio) || '';
        navigation.navigate(isRememberMe ? 'PinCodeScreen' : 'GreetingScreen', {
          fio,
        });
      })
      .catch(error => {
        reportError(error, 'SingIn/signInSuccess/fetchProfile');
      });
  };

  return (
    <View style={{flex: 1}}>
      <ModalPrivacyPolicy
        modalRef={modalPrivacyPolicyRef}
        onAcceptClicked={signInSuccess}
      />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        scrollEventThrottle={16}>
        <View style={styles.container}>
          <Image style={styles.imageLabel} source={StoneHedge} />
          <TextInput
            style={styles.login}
            placeholder="Введите логин"
            autoCapitalize="none"
            selectionColor="#747E90"
            onChangeText={l => setLogin(l)}
            value={login}
          />
          <TextInput
            style={styles.password}
            placeholder="Введите пароль"
            autoCapitalize="none"
            selectionColor="#747E90"
            secureTextEntry
            onChangeText={p => setPassword(p)}
            value={password}
          />
          <View style={styles.additionalWrapper}>
            <CircleCheckBox
              styleLabel={styles.checkBoxLabel}
              checked={isRememberMe}
              onToggle={() => handleCheckBox()}
              labelPosition="right"
              label="Запомнить меня"
            />
            <TouchableOpacity
              style={styles.buttonPasswordForgot}
              onPress={() => navigation.navigate('PasswordRecoveryScreen')}>
              <Text style={styles.textForgot}>Забыли пароль?</Text>
            </TouchableOpacity>
          </View>
          <DefaultButton
            style={styles.signInButton}
            textStyle={styles.textButton}
            onPress={signIn}
            isShowLoader={isProgress}
            text="Войти"
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default connect(null, {
  auth: shared.actions.auth,
  fetchProfile: shared.actions.fetchProfile,
  setError: shared.actions.error,
})(SignInScreen);
