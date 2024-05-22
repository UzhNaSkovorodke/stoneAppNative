import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';

import EditProfileImage from '../../assets/oldImg/EditProfileImage.png';

import DefaultButton from '../components/buttons/DefaultButton';
import CommentLabel from '../components/custom/CommentLabel';
import Spinner from '../components/custom/Spinner';
import SplitLine from '../components/custom/SplitLine';

import shared from '../../store/index';
import uri from '../constants/Uri';
import {Fonts} from '../utils/Fonts';
import RNSecureStorage from 'rn-secure-storage';
import ImagePicker from 'react-native-image-picker';

const ProfileScreen = ({
  navigation,
  profile,
  logoutProfile,
  editProfile,
  setError,
}) => {
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);

  const [profileAvatarUri, setProfileAvatarUri] = useState(
    `${uri.imagesProxyUrl}${profile.avatar}`,
  );
  const onPasswordChangeButtonPress = () => {
    navigation.navigate('PasswordChangeScreen');
  };

  const onLogOutButtonPress = () => {
    RNSecureStorage.removeItem('login');
    RNSecureStorage.removeItem('password');
    RNSecureStorage.removeItem('PinCode');
    logoutProfile();
    navigation.navigate('SignInScreen');
  };

  const selectProfileImage = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError([
        {
          message:
            'Доступ к фото запрещен. Дать доступ можно в настройках приложения.',
        },
      ]);
      return;
    }

    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.cancelled) {
      setIsAvatarLoading(true);
      setProfileAvatarUri(result.assets[0].uri);

      editProfile({
        fileContent: result.base64 || null,
        fileName: result.uri,
      }).then(() => {
        setProfileAvatarUri(result.uri);
        setIsAvatarLoading(false);
      });
    }
  };

  const renderImage = () => {
    const [lastName, firstName] = ((profile && profile.fio) || '')
      .replace(/[^a-zA-Zа-яА-Я\s]/g, '')
      .split(' ');
    if (!profileAvatarUri) {
      return null;
    }

    if (profileAvatarUri === '') {
      return (
        <View>
          <View style={styles.noImageWrapper}>
            <Text style={styles.noImageText}>
              {lastName ? lastName[0] : ''}
              {firstName ? firstName[0] : ''}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editProfileImageButton}
            onPress={selectProfileImage}>
            <Image style={styles.editImageIcon} source={EditProfileImage} />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View>
        <Image
          style={styles.profileImage}
          resizeMode="cover"
          source={{uri: profileAvatarUri}}
          onLoadStart={() => {
            setIsAvatarLoading(true);
          }}
          onLoadEnd={() => {
            setIsAvatarLoading(false);
          }}
        />
        {isAvatarLoading ? (
          <View style={[styles.profileImage, styles.spinnerWrapper]}>
            <Spinner />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editProfileImageButton}
            onPress={selectProfileImage}>
            <Image style={styles.editImageIcon} source={EditProfileImage} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderProfileFIO = () => {
    const [lastName, firstName, patronymic] = (
      (profile && profile.fio) ||
      ''
    ).split(' ');
    return (
      <View>
        <Text style={styles.fioText}>
          {lastName ? `${lastName}` : ''}
          {firstName ? `\n${firstName}` : ''}
          {patronymic ? `\n${patronymic}` : ''}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EditProfileScreen', {
              profileFio: profile.fio,
              phoneNumber: profile.phoneNumber,
              profileEmail: profile.email,
            });
          }}>
          <Text style={styles.editProfileText}>Редактировать профиль</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContacts = () => {
    return (
      <View style={styles.profileDataWrapper}>
        <CommentLabel text="Телефон" />
        <Text style={styles.text}>{profile.phoneNumber || ''}</Text>
        <SplitLine style={styles.splitLine2} />
        <CommentLabel text="Электронная почта" />
        <Text style={styles.text}>{profile.email || ''}</Text>
        <SplitLine style={styles.splitLine3} />
      </View>
    );
  };

  return (
    <ScrollView scrollEventThrottle={16}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          {renderImage()}
          {renderProfileFIO()}
        </View>
        <SplitLine style={styles.splitLine} />
        {renderContacts()}
        <DefaultButton
          onPress={onPasswordChangeButtonPress}
          text="Изменить пароль"
        />
        <TouchableOpacity
          style={styles.privacyPolicyText}
          onPress={() =>
            navigation.navigate('PdfViewScreen', {
              fileLink: uri.privacyPolicyFileLink,
              title: 'Политика Конфиденциальности',
            })
          }>
          <Text style={styles.profileExitText}>
            Политика конфиденциальности
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rulesText}
          onPress={() =>
            navigation.navigate('PdfViewScreen', {
              fileLink: uri.rulesFileLink,
              title: 'Правила участия в программе',
            })
          }>
          <Text style={styles.profileExitText}>
            Правила участия в программе
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileExitButton}
          onPress={onLogOutButtonPress}>
          <Text style={styles.profileExitText}>Выйти из профиля</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  fioText: {
    marginTop: 3.5,
    marginLeft: 22,
    color: '#111111',
    fontSize: 16,
  },
  editProfileImageButton: {
    position: 'absolute',
    zIndex: 99,
    bottom: 6,
    left: 60,
  },
  editImageIcon: {
    width: 24,
    height: 24,
  },
  spinnerWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageWrapper: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DEE0E5',
    borderRadius: 40,
  },
  noImageText: {
    color: '#747E90',
    fontFamily: Fonts.DisplayRegular,
    fontSize: 24,
  },
  text: {
    marginTop: 10,
    color: '#111111',
    fontFamily: Fonts.TextLight,
  },
  splitLine2: {
    marginTop: 6,
    marginBottom: 25,
  },
  splitLine3: {
    marginTop: 6,
    marginBottom: 0,
  },
  editProfileText: {
    marginTop: 5,
    marginLeft: 22,
    color: '#747E90',
    fontFamily: Fonts.DisplayLight,
    fontSize: 14,
  },
  profileDataWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  profileExitButton: {
    marginTop: 13,
    fontFamily: Fonts.DisplayLight,
    fontSize: 14,
  },
  profileExitText: {
    color: '#747E90',
    fontFamily: Fonts.DisplayLight,
    fontSize: 14,
  },
  privacyPolicyText: {
    marginTop: 42,
    fontFamily: Fonts.DisplayLight,
    fontSize: 14,
  },
  rulesText: {
    marginTop: 13,
    fontFamily: Fonts.DisplayLight,
    fontSize: 14,
  },
  splitLine: {
    marginTop: 24,
    marginBottom: 24,
  },
});

export default connect(({profile}) => ({profile}), {
  logoutProfile: shared.actions.logout,
  editProfile: shared.actions.editProfile,
  setError: shared.actions.error,
})(ProfileScreen);
