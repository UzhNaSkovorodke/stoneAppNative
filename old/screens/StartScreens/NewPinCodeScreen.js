import { Dimensions, StyleSheet } from 'react-native'

import { Fonts } from '../../utils/Fonts'
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('window')
const buttonSize = width / 5.2
const spaceTop = width / 25

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    pinStyles: {
        width: 10,
        height: 10,
        borderRadius: 50,
    },
    disabledPin: {
        borderWidth: 1,
        borderColor: '#707070',
    },
    selectedPin: {
        borderColor: '#747E90',
        backgroundColor: '#747E90',
    },
    textDescription: {
        width: '60%',
        marginTop: 20,
        marginBottom: 10,
        color: '#747E90',
        fontFamily: Fonts.TextLight,
        fontSize: 12,
        textAlign: 'center',
    },
    textTitle: {
        color: '#747E90',
        fontFamily: Fonts.TextLight,
        fontSize: 16,
    },
    blueButton: {
        width: buttonSize,
        height: buttonSize,
        borderWidth: 1.3,
        borderColor: '#747E90',
        borderRadius: 50,
        textAlign: 'center',
    },
    blueButtonNumber: {
        marginTop: 3,
        color: '#747E90',
        fontSize: 22,
        textAlign: 'center',
    },
    blueButtonText: {
        marginTop: -3,
        color: '#747E90',
        fontSize: 10,
        textAlign: 'center',
    },
    buttonBlueColumn: {
        flexDirection: 'row',
        marginTop: spaceTop,
    },
    deleteImage: {
        width: buttonSize * 0.8,
        height: buttonSize * 0.8,
        alignSelf: 'center',
        tintColor: '#747E90',
    },
    lostButtonText: {
        alignSelf: 'center',
        color: '#747E90',
        fontSize: buttonSize * 0.25,
    },
    touchIdStyles: {
        width: buttonSize * 0.7,
        height: buttonSize * 0.7,
    },
    faceIdStyles: {
        width: buttonSize * 0.6,
        height: buttonSize * 0.6,
    },
    pins: {
        width: '25%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
})
const NewPinCodeScreen = () => {
    const navigation = useNavigation()

    //TODO back btn

    //TODO TouchId || FaceID

    //TODO firstPassword

    //TODO secondPassword

    //TODO validateCreatedPin

    //TODO validateEnteredPin

    //TODO onFail

    //TODO onSuccess

    return <></>
}
