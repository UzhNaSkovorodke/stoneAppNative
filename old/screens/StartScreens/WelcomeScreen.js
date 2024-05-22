import React from 'react'
import { Dimensions, ImageBackground, Text, TouchableOpacity, View, StyleSheet } from 'react-native'

import Image1 from '../../../assets/oldImg/WelcomeScreen/FirstWelcomeDefault.png'
import FirstWelcomeIphoneX from '../../../assets/oldImg/WelcomeScreen/FirstWelcomeIphoneX.png'
import Image4 from '../../../assets/oldImg/WelcomeScreen/ForthWelcomeDefault.png'
import ForthWelcomeIphoneX from '../../../assets/oldImg/WelcomeScreen/ForthWelcomeIphoneX.png'
import Image2 from '../../../assets/oldImg/WelcomeScreen/SecondWelcomeDefault.png'
import SecondWelcomeIphoneX from '../../../assets/oldImg/WelcomeScreen/SecondWelcomeIphoneX.png'
import Image3 from '../../../assets/oldImg/WelcomeScreen/ThirdWelcomeDefault.png'
import ThirdWelcomeIphoneX from '../../../assets/oldImg/WelcomeScreen/ThirdWelcomeIphoneX.png'
import reportError from '../../utils/ReportError'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import Swiper from 'react-native-swiper'

const { width, height } = Dimensions.get('window')
const isLongScreen = height / width > 2

const styles = StyleSheet.create({
    startButton: {
        borderRadius: 26,
        backgroundColor: '#747E90',
        marginBottom: (((height / 100) * 95) / 100) * 16,
        marginRight: width / 18,
        width: 103,
        height: 40,
        justifyContent: 'center',
    },
    textStartButton: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: '#E6E6E6',
        position: 'relative',
    },
    slide: {
        flex: 1,
        marginTop: -80,
        justifyContent: 'flex-start',
        backgroundColor: '#E6E6E6',
    },
    wrapperImg: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: '95%',
        marginLeft: 'auto',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    wrapper: {},
    pagination: {
        position: 'absolute',
        top: -(height / 1.15),
    },
    dot: {
        backgroundColor: '#BBBBBB',
        width: '20%',
        height: 4,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
        top: 0,
    },
    activeDot: {
        backgroundColor: '#FFFFFF',
        width: '20%',
        height: 4,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
        top: 0,
    },
})

const WelcomeScreen = ({ navigation }) => {
    const onButtonClicked = async () => {
        navigation.navigate('RegistrationOrLoginScreen')
        await AsyncStorage.setItem('logged', '1')
    }

    return (
        <SafeAreaView style={styles.container}>
            <Swiper
                style={styles.wrapper}
                showsButtons={false}
                loop={true}
                autoplay={true}
                autoplayTimeout={5}
                dot={<View style={styles.dot} />}
                activeDot={<View style={styles.activeDot} />}
                paginationStyle={styles.pagination}>
                {[Image1, Image2, Image3, Image4].map((image, index) => (
                    <View style={styles.slide} key={index}>
                        <TouchableOpacity
                            style={styles.wrapperImg}
                            activeOpacity={1}
                            delayPressIn={0}>
                            <ImageBackground
                                style={styles.image}
                                source={
                                    isLongScreen
                                        ? [
                                              FirstWelcomeIphoneX,
                                              SecondWelcomeIphoneX,
                                              ThirdWelcomeIphoneX,
                                              ForthWelcomeIphoneX,
                                          ][index]
                                        : image
                                }>
                                <TouchableOpacity
                                    style={styles.startButton}
                                    onPress={onButtonClicked}>
                                    <Text style={styles.textStartButton}>Начать</Text>
                                </TouchableOpacity>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                ))}
            </Swiper>
        </SafeAreaView>
    )
}

export default WelcomeScreen
