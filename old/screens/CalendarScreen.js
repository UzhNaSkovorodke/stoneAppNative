import _isEmpty from 'lodash/isEmpty';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import * as appStyle from 'react-native-calendars/src/style';

import {Fonts} from '../utils/Fonts';
import DefaultButton from '../components/buttons/DefaultButton';

LocaleConfig.locales.ru = {
  monthNames: [
    'Январь,',
    'Февраль,',
    'Март,',
    'Апрель,',
    'Май,',
    'Июнь,',
    'Июль,',
    'Август,',
    'Сентябрь,',
    'Октябрь,',
    'Ноябрь,',
    'Декабрь,',
  ],
  dayNamesShort: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.'],
};
LocaleConfig.defaultLocale = 'ru';

export default class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);

    const today = new Date();
    const date = today.getDate();
    const fullDate = date < 10 ? `0${date}` : `${date}`;
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const fullMonth = month < 10 ? `0${month}` : `${month}`;

    this.state = {
      start: {},
      end: {},
      period: {},
      today: `${year}-${fullMonth}-${fullDate}`,
    };
  }

  getDateString(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let dateString = `${year}-`;
    if (month < 10) {
      dateString += `0${month}-`;
    } else {
      dateString += `${month}-`;
    }
    if (day < 10) {
      dateString += `0${day}`;
    } else {
      dateString += day;
    }

    return dateString;
  }

  getPeriod(startTimestamp, endTimestamp) {
    const period = {};
    let currentTimestamp = startTimestamp;
    while (currentTimestamp < endTimestamp) {
      const dateString = this.getDateString(currentTimestamp);
      period[dateString] = {
        color: '#747E90',
        textColor: '#FFFFFF',
        borderRadius: 19,
        startingDay: currentTimestamp === startTimestamp,
      };
      currentTimestamp += 24 * 60 * 60 * 1000;
    }
    const dateString = this.getDateString(endTimestamp);
    period[dateString] = {
      color: '#747E90',
      borderRadius: 19,
      textColor: '#FFFFFF',
      endingDay: true,
    };
    return period;
  }

  setFirstDay = dayObj => {
    const {start, end} = this.state;
    const {dateString, day, month, year} = dayObj;
    const timestamp = new Date(year, month - 1, day).getTime();
    const newDayObj = {...dayObj, timestamp};
    const startIsEmpty = _isEmpty(start);
    if (startIsEmpty || (!startIsEmpty && !_isEmpty(end))) {
      const period = {
        [dateString]: {
          color: '#747E90',
          borderRadius: 19,
          textColor: '#FFFFFF',
          endingDay: true,
          startingDay: true,
        },
      };
      this.setState({start: newDayObj, period, end: {}});
    } else {
      const {timestamp: savedTimestamp} = start;
      if (savedTimestamp > timestamp) {
        const period = this.getPeriod(timestamp, savedTimestamp);
        this.setState({start: newDayObj, end: start, period});
      } else {
        const period = this.getPeriod(savedTimestamp, timestamp);
        this.setState({end: newDayObj, start, period});
      }
    }
  };

  render() {
    const {route, navigation} = this.props;
    const {period} = this.state;
    const dateArray = Object.keys(period);
    return (
      <ScrollView style={{backgroundColor: '#F7F7F9'}}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
            backgroundColor: '#F7F7F9',
          }}>
          <Calendar
            style={{
              flex: 1,
              backgroundColor: '#F7F7F9',
              paddingBottom: 8,
              borderRadius: 3,
            }}
            theme={{
              arrowColor: '#747E90',
              monthTextColor: '#747E90',
              textMonthFontFamily: Fonts.DisplayCompactRegular,
              textDayHeaderFontFamily: Fonts.DisplaySemiBold,
              'stylesheet.day.period': {
                base: {
                  width: 34,
                  height: 34,
                  alignItems: 'center',
                  borderRadius: 100,
                  borderWidth: 0.3,
                  borderColor: '#FFFFFF',
                },
                wrapper: {
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  width: 34,
                  borderRadius: 100,
                  borderWidth: 0.3,
                  borderColor: '#FFFFFF',
                  marginLeft: 5,
                },
                fillers: {
                  borderRadius: 100,
                  borderWidth: 0.3,
                  borderColor: '#FFFFFF',
                  position: 'absolute',
                  height: 34,
                  flexDirection: 'row',
                  left: 0,
                  right: 0,
                },
                leftFiller: {
                  height: 0,
                  width: 0,
                },
                rightFiller: {
                  height: 0,
                  width: 0,
                },
                todayText: {},
                text: {
                  marginTop: 7,
                  fontSize: 16,
                  fontFamily: Fonts.DisplayCompactRegular,
                  fontWeight: appStyle.textDayFontWeight,
                  color: appStyle.dayTextColor || '#2d4150',
                  backgroundColor: 'rgba(255, 255, 255, 0)',
                },
              },
            }}
            firstDay={1}
            onDayPress={this.setFirstDay}
            markingType="period"
            markedDates={period}
          />
          <DefaultButton
            onPress={() => {
              route.params.onSetDate({
                startAt: dateArray[0],
                endAt: dateArray[dateArray.length - 1],
              });
              navigation.goBack();
            }}
            text="Применить даты"
          />
        </View>
      </ScrollView>
    );
  }
}
