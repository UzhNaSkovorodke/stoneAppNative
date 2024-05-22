import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Fonts } from '../../utils/Fonts'

const ClickBtn = ({ onPress, imgSrc, imgStyle, title, ...props }) => {
    return (
        <View style={styles.shadowButton} key={props.key}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.5}>
                <View style={styles.buttonContainer}>
                    <Image style={imgStyle} source={imgSrc} />
                    <Text style={styles.textButtonStyle}>{title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    shadowButton: {
        shadowColor: '#dedede',
        elevation: 5,
        shadowOpacity: 0.25,
        flexBasis: '48%',
        marginBottom: 16,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 14,
        height: 117,
    },
    textButtonStyle: {
        color: '#747E90',
        fontFamily: Fonts.DisplayCompactSemiBold,
        fontSize: 14,
        textAlign: 'center',
    },
})
export default ClickBtn
