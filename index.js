/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import moment from 'moment';
import {name as appName} from './app.json';
import GlobalFont from 'react-native-global-font';

moment.locale('ru');

GlobalFont.applyGlobal('SFUIDisplay-Regular');

AppRegistry.registerComponent(appName, () => App);
