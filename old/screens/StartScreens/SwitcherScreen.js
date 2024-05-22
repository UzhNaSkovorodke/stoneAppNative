import React, {useEffect} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';

import shared from '../../../store/index';
import Spinner from '../../components/custom/Spinner';
import reportError from '../../utils/ReportError';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSecureStorage from 'rn-secure-storage';

const SwitcherScreen = ({navigation, auth, fetchProfile}) => {
  useEffect(() => {
    const handleFocus = () => {
      bootstrapAsync();
    };
    navigation.addListener('focus', handleFocus);
    return () => {
      navigation.removeListener('focus', handleFocus);
    };
  }, [navigation]);

  const bootstrapAsync = async () => {
    RNSecureStorage.exist('password')
      .then(isExisted =>
        isExisted ? onCheckLoggedLaunch() : onCheckFirstLaunch(),
      )
      .catch(error => reportError(error, 'SwitcherScreen/bootstrapAsync'));
  };

  const onCheckLoggedLaunch = async () => {
    const login = await RNSecureStorage.getItem('login');
    const password = await RNSecureStorage.getItem('password');
    auth({login, password})
      .then(() => fetchProfile())
      .then(res => {
        const fio =
          (res.payload.data.profile && res.payload.data.profile.fio) || '';
        navigation.navigate('PinCodeScreen', {fio});
      })
      .catch(error => {
        reportError(error, 'SwitcherScreen/OnCheckLoggedLaunch/auth');
        navigation.navigate('RegistrationOrLoginScreen');
      });
  };
  const onCheckFirstLaunch = async () => {
    AsyncStorage.getItem('logged').then(isLogin => {
      navigation.navigate(
        isLogin ? 'RegistrationOrLoginScreen' : 'WelcomeScreen',
      );
    });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Spinner />
    </View>
  );
};

export default connect(null, {
  auth: shared.actions.auth,
  authSuccess: shared.actions.authSuccess,
  fetchProfile: shared.actions.fetchProfile,
  fetchConfig: shared.actions.fetchConfig,
})(SwitcherScreen);
