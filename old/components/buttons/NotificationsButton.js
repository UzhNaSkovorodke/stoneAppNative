import React from 'react';
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Notifications} from 'react-native-notifications';
import {connect} from 'react-redux';
import shared from '../../../store/index';

import NotificationIcon from '../../../assets/oldImg/Notification.png';
import {Fonts} from '../../utils/Fonts';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 15,
  },
  icon: {
    width: 20.35,
    height: 24.73,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  statusStyle: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: -4.5,
    backgroundColor: '#EE4A4A',
    borderRadius: 50,
    textAlign: 'center',
  },
  notificationsCount: {
    color: '#FFFFFF',
    fontFamily: Fonts.DisplayRegular,
    fontSize: 8,
  },
});

class NotificationsButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentCount: props.notifications.unreadTotal,
    };
  }

  componentDidMount() {
    this.unsubscribe = shared.store.subscribe(this.onDispatched);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  renderCallBack = () => {
    const {unreadTotal} = this.props.notifications;
    const {currentCount} = this.state;
    if (Platform.OS === 'ios') {
      Notifications.ios.setBadgeCount(unreadTotal);
    }
    if (unreadTotal === undefined || unreadTotal !== currentCount) {
      this.setState({currentCount: unreadTotal || 0});
    }
  };

  onDispatched = () => this.renderCallBack();

  onNotificationButtonClick = () =>
    this.props.navigation.navigate('NotificationsScreen');

  render() {
    const {currentCount} = this.state;

    const isNeedStatusBarRender = currentCount > 0;
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={this.onNotificationButtonClick}>
          <ImageBackground
            style={styles.icon}
            resizeMode="contain"
            source={NotificationIcon}>
            {isNeedStatusBarRender && (
              <View style={styles.statusStyle}>
                <Text style={styles.notificationsCount}>{currentCount}</Text>
              </View>
            )}
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(({notifications}) => ({notifications}))(
  NotificationsButton,
);
