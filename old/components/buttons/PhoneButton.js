import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import call from 'react-native-phone-call';

import CallIcon from '../../../assets/oldImg/Call.png';
import {Fonts} from '../../utils/Fonts';
import reportError from '../../utils/ReportError';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  text: {
    color: '#111111',
    fontFamily: Fonts.TextLight,
    fontSize: 12,
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
});

export default class PhoneButton extends React.Component {
  onCallButtonPress(phone) {
    const args = {
      number: phone,
    };

    call(args).catch(error => reportError(error, 'PhoneButton'));
  }

  render() {
    const {number, style} = this.props;
    return (
      <TouchableOpacity
        style={[styles.wrapper, style]}
        onPress={() => this.onCallButtonPress(number)}>
        <View style={{flexDirection: 'row'}}>
          <Image style={styles.icon} tintColor="#747E90" source={CallIcon} />
          <Text style={styles.text}>{number}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
