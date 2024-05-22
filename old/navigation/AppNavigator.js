import React, { useEffect } from 'react'
import { Image, Platform, StyleSheet, TouchableOpacity, View, Text, LogBox } from 'react-native'

import AppealsIcon from '../../assets/oldImg/Appeals.png'
import BackArrowIcon from '../../assets/oldImg/BackArrow.png'
import EstateIcon from '../../assets/oldImg/Estate.png'
import Filter from '../../assets/oldImg/Filter.png'
import HomeIcon from '../../assets/oldImg/Home.png'
import ProfileIcon from '../../assets/oldImg/Profile.png'

import AdditionalServicesScreen from '../screens/AdditionalServicesScreen'
import AppealCreateScreen from '../screens/Appeals/AppealCreateScreen'
import AppealsFilterScreen from '../screens/Appeals/AppealsFilterScreen'
import AppealsScreen from '../screens/Appeals/AppealsScreen'
import EventAppealScreen from '../screens/Appeals/EventAppealScreen'
import MyEventChangeProfileAppealScreen from '../screens/Appeals/MyEventChangeProfileAppealScreen'
import MyEventManagementCompanyAppealScreen from '../screens/Appeals/MyEventManagementCompanyAppealScreen'
import MyEventsGuestPassOrderScreen from '../screens/Appeals/MyEventsGuestPassOrderScreen'
import MyEventsTaxiPassOrderScreen from '../screens/Appeals/MyEventsTaxiPassOrderScreen'
import BillPaymentScreen from '../screens/BillPaymentScreen'
import CreateEventBuildingDeliveryPassScreen from '../screens/CreateEventBuildingDeliveryPassScreen'
import CreateEventDeliveryPassScreen from '../screens/CreateEventDeliveryPassScreen'
import CreateEventGuestPassOrderScreen from '../screens/CreateEventGuestPassOrderScreen'
import CreateEventLargeSizeDeliveryPassScreen from '../screens/CreateEventLargeSizeDeliveryPassScreen'
import CreateEventTaxiPassOrderScreen from '../screens/CreateEventTaxiPassOrderScreen'
import DocumentsScreen from '../screens/DocumentsScreen'
import EditProfileScreen from '../screens/EditUserScreen/EditProfileScreen'
import PasswordChangeScreen from '../screens/EditUserScreen/PasswordChangeScreen'
import PasswordRecoveryScreen from '../screens/EditUserScreen/PasswordRecoveryScreen'
import FakeScreen from '../screens/FakeScreen/FakeScreen'
import HomeScreen from '../screens/HomeScreen'
import MyResidenceScreen from '../screens/MyResidenceScreen'
import NewsScreen from '../screens/NewsScreen'
import PaymentStatementScreen from '../screens/PaymentStatemetScreen'
import PaymentsScreen from '../screens/PaymentsScreen'
import PdfViewScreen from '../screens/PdfViewScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ResidenceScreen from '../screens/ResidenceScreen'
import SelectPassOrderScreen from '../screens/SelectPassOrderScreen'
import GreetingScreen from '../screens/StartScreens/GreetingScreen'
import PinCodeScreen from '../screens/StartScreens/PinCodeScreen'
import RegistrationOrLoginScreen from '../screens/StartScreens/RegistrationOrLoginScreen'
import SignInScreen from '../screens/StartScreens/SignInScreen'
import SwitcherScreen from '../screens/StartScreens/SwitcherScreen'
import UpdateAppScreen from '../screens/StartScreens/UpdateAppScreen'
import WelcomeScreen from '../screens/StartScreens/WelcomeScreen'

import BackImage from '../components/buttons/BackImage'
import ItemSelectionScreen from '../components/custom/ItemSelectionScreen'

import { Fonts } from '../utils/Fonts'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TransitionPresets } from '@react-navigation/stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { tabBarLabelStyle, headerStyle, ...styles } = StyleSheet.create({
    tabBarLabelStyle: {
        fontFamily: Fonts.TextRegular,
        fontSize: 11,
    },
    headerStyle: {
        height: Platform.OS === 'ios' ? 100 : 56,
        backgroundColor: Platform.OS === 'ios' ? '#F7F7F9' : '#F7F7F9',
        elevation: 0,
    },
    tabHeaderTitleStyle: {
        color: '#111111',
        fontFamily: Fonts.DisplayBold,
        fontSize: 18,
    },
    appHeaderTitleStyle: {
        color: '#111111',
        fontFamily: Fonts.DisplayRegular,
        fontSize: 14,
    },
    homeIcon: {
        width: 20.93,
        height: 18.21,
    },
    estateIcon: {
        width: 24.62,
        height: 13.17,
        transform: [{ rotate: '-45deg' }],
    },
    appealsIcon: {
        width: 20.1,
        height: 19.7,
    },
    profileIcon: {
        width: 15.61,
        height: 19.37,
    },
    filter: {
        width: 20,
        height: 20,
        marginEnd: 20,
        tintColor: '#111111',
    },
    title: {
        marginLeft: 16,
        color: '#111111',
        fontFamily: Fonts.DisplayBold,
        fontSize: 18,
    },

    headerContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    headerTitle: {
        fontFamily: Fonts.DisplayRegular,
        fontSize: 14,
    },
    headerDescription: {
        alignSelf: 'center',
        color: '#747E90',
        fontFamily: Fonts.DisplayCompactLight,
        fontSize: 12,
    },
})

const Stack = createNativeStackNavigator()

function TabNavigator() {
    const Tab = createBottomTabNavigator()

    const { bottom } = useSafeAreaInsets()
    return (
        <Tab.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
                gestureEnabled: false,
                headerBackTitleVisible: false,
                //headerRight: NotificationsButton,
                headerStyle,
                headerTitleStyle: styles.tabHeaderTitleStyle,
                tabBarActiveTintColor: '#101010',
                tabBarInactiveTintColor: '#747E90',
                tabBarLabelStyle,
                tabBarStyle: { paddingBottom: bottom + 4 },
                ...TransitionPresets.ScaleFromCenterAndroid,
            }}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    title: '',
                    tabBarLabel: 'Главная',
                    tabBarIcon: ({ color: tintColor }) => (
                        <Image style={[styles.homeIcon, { tintColor }]} source={HomeIcon} />
                    ),
                }}
            />
            <Tab.Screen
                name="ResidenceScreen"
                component={ResidenceScreen}
                options={{
                    title: 'Управление недвижимостью',
                    tabBarLabel: 'Недвижимость',
                    tabBarIcon: ({ color: tintColor }) => (
                        <Image style={[styles.estateIcon, { tintColor }]} source={EstateIcon} />
                    ),
                }}
            />
            <Tab.Screen
                name="AppealsScreen"
                component={AppealsScreen}
                options={({ route: { params }, navigation: { navigate } }) => ({
                    title: 'Обращения',
                    tabBarLabel: 'Обращения',
                    tabBarIcon: ({ color: tintColor }) => (
                        <Image style={[styles.appealsIcon, { tintColor }]} source={AppealsIcon} />
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() =>
                                navigate('AppealsFilterScreen', {
                                    filter: params?.filter || {},
                                })
                            }>
                            <Image style={styles.filter} source={Filter} />
                        </TouchableOpacity>
                    ),
                })}
            />
            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    title: 'Профиль',
                    tabBarLabel: 'Профиль',
                    tabBarIcon: ({ color: tintColor }) => (
                        <Image style={[styles.profileIcon, { tintColor }]} source={ProfileIcon} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export default function AppNavigator() {
    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
    }, [])

    return (
        <Stack.Navigator
            initialRouteName="WelcomeScreen"
            screenOptions={{
                gestureEnabled: false,
                headerBackImage: () => (
                    <BackImage width={21.33} height={16} source={BackArrowIcon} />
                ),
                headerBackTitleVisible: false,
                headerStyle: headerStyle,
                headerTitleAlign: 'center',
                headerTitleStyle: styles.appHeaderTitleStyle,
                ...TransitionPresets.ScaleFromCenterAndroid,
            }}>
            <Stack.Screen
                name={'TabNavigator'}
                component={TabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={'UpdateAppScreen'}
                component={UpdateAppScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={'WelcomeScreen'}
                component={WelcomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={'SwitcherScreen'}
                component={SwitcherScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={'RegistrationOrLoginScreen'}
                component={RegistrationOrLoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={'SignInScreen'}
                component={SignInScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={'GreetingScreen'}
                component={GreetingScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={'PinCodeScreen'}
                component={PinCodeScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name={'NewsScreen'}
                component={NewsScreen}
                options={({ route }) => ({
                    title: route?.params?.title,
                    headerTitleContainerStyle: {
                        width: '70%',
                        alignItems: 'center',
                    },
                })}
            />
            <Stack.Screen
                name={'PdfViewScreen'}
                component={PdfViewScreen}
                options={({ route }) => ({ title: route.params.title })}
            />
            <Stack.Screen
                name={'EditProfileScreen'}
                component={EditProfileScreen}
                options={{ title: 'Изменить профиль' }}
            />
            <Stack.Screen
                name={'PasswordChangeScreen'}
                component={PasswordChangeScreen}
                options={{ title: 'Изменить пароль' }}
            />
            <Stack.Screen
                name={'PasswordRecoveryScreen'}
                component={PasswordRecoveryScreen}
                options={{ title: 'Восстановление пароля' }}
            />
            <Stack.Screen
                name={'AppealCreateScreen'}
                component={AppealCreateScreen}
                options={{ title: 'Создать обращение' }}
            />
            <Stack.Screen
                name={'EventAppealScreen'}
                component={EventAppealScreen}
                options={({ route }) => ({ title: route.params.title })}
            />
            <Stack.Screen
                name={'SelectPassOrderScreen'}
                component={SelectPassOrderScreen}
                options={{ title: 'Заказать пропуск' }}
            />
            <Stack.Screen name={'FakeScreen'} component={FakeScreen} />
            <Stack.Screen
                name={'ItemSelectionScreen'}
                component={ItemSelectionScreen}
                options={({ route }) => ({ title: route.params.title })}
            />
            <Stack.Screen
                name={'CreateEventDeliveryPassScreen'}
                component={CreateEventDeliveryPassScreen}
                options={{ title: 'Заказать пропуск для доставки' }}
            />

            <Stack.Screen
                name={'CreateEventTaxiPassOrderScreen'}
                component={CreateEventTaxiPassOrderScreen}
                options={{ title: 'Заказать пропуск для такси' }}
            />
            <Stack.Screen
                name={'CreateEventGuestPassOrderScreen'}
                component={CreateEventGuestPassOrderScreen}
                options={{ title: 'Заказать пропуск для гостя' }}
            />
            <Stack.Screen
                name={'CreateEventBuildingDeliveryPassScreen'}
                component={CreateEventBuildingDeliveryPassScreen}
                options={{ title: 'Заказать пропуск для стройматериалов' }}
            />
            <Stack.Screen
                name={'CreateEventLargeSizeDeliveryPassScreen'}
                component={CreateEventLargeSizeDeliveryPassScreen}
                options={{ title: 'Заказать пропуск для крупногабаритных грузов' }}
            />
            <Stack.Screen
                name={'MyEventsGuestPassOrderScreen'}
                component={MyEventsGuestPassOrderScreen}
                options={{ title: 'Мои события' }}
            />
            <Stack.Screen
                name={'MyEventsTaxiPassOrderScreen'}
                component={MyEventsTaxiPassOrderScreen}
                options={{ title: 'Мои события' }}
            />
            <Stack.Screen
                name={'MyEventChangeProfileAppealScreen'}
                component={MyEventChangeProfileAppealScreen}
                options={{ title: 'Мои события' }}
            />
            <Stack.Screen
                name={'MyEventManagementCompanyAppealScreen'}
                component={MyEventManagementCompanyAppealScreen}
                update
                options={{ title: 'Мои события' }}
            />
            <Stack.Screen
                name={'MyResidenceScreen'}
                component={MyResidenceScreen}
                options={({ route }) => ({
                    title: route.params ? route.params.data.projectName : '',
                })}
            />
            <Stack.Screen
                name={'PaymentsScreen'}
                component={PaymentsScreen}
                options={({ route: { params }, navigation }) => ({
                    title: 'Счета',
                })}
            />
            <Stack.Screen
                name={'BillPaymentScreen'}
                component={BillPaymentScreen}
                options={{ title: 'Оплата услуги' }}
            />
            <Stack.Screen
                name={'PaymentStatementScreen'}
                component={PaymentStatementScreen}
                options={({ route }) => ({
                    headerTitle: () => (
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTitle}>Выписка по л/с</Text>
                            <Text style={styles.headerDescription}>{route.params.roomName}</Text>
                        </View>
                    ),
                })}
            />
            <Stack.Screen
                name={'AppealsFilterScreen'}
                component={AppealsFilterScreen}
                options={{ title: 'Фильтры' }}
            />
            <Stack.Screen
                name={'AdditionalServicesScreen'}
                component={AdditionalServicesScreen}
                options={{ title: 'Дополнительные услуги' }}
            />
            <Stack.Screen
                name={'DocumentsScreen'}
                component={DocumentsScreen}
                options={{ title: 'Документы' }}
            />
        </Stack.Navigator>
    )
}
