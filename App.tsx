import * as React from 'react';
import {Platform, StatusBar} from 'react-native';
import {Provider} from 'react-redux';

import KeyboardSpacer from 'react-native-keyboard-spacer';
import ModalRoot from './old/components/custom/RootModalsComponent';
import AppNavigator from './old/navigation/AppNavigator';
import shared from './store/index';

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

export default function App() {
  return (
    <>
      <SafeAreaView style={{backgroundColor: '#F7F7F9'}}>
        <StatusBar barStyle="dark-content" backgroundColor="#F7F7F9" />
      </SafeAreaView>

      <SafeAreaProvider>
        <NavigationContainer
          theme={{
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              background: '#F7F7F9',
            },
          }}>
          <Provider store={shared.store}>
            <ModalRoot.RootModalsComponent>
              <AppNavigator />
              {Platform.OS === 'ios' ? <KeyboardSpacer /> : null}
            </ModalRoot.RootModalsComponent>
          </Provider>
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
}
