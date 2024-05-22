import { StyleSheet } from 'react-native'

import { Fonts } from '../../../utils/Fonts'

export default StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: undefined,
        width: 271,
        backgroundColor: '#EAEAEA',
    },
    wrapper: {
        alignItems: 'center',
        width: '100%',
    },
    descriptionWrapper: {
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    descriptionText: {
        fontSize: 17,
        marginTop: 12,
        marginBottom: 20,
        color: '#111111',
        textAlign: 'center',
        lineHeight: 20,
    },
    image: {
        height: 40,
        width: 40,
        marginTop: 16,
    },
    cancelText: {
        fontFamily: Fonts.TextRegular,
        fontSize: 17,
        color: '#747E90',
    },
    cancelButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#3C3C4329',
        height: 44,
    },
    acceptText: {
        fontFamily: Fonts.TextSemibold,
        fontSize: 17,
        color: '#747E90',
    },
    acceptButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#3C3C4329',
        height: 44,
    },
    a: {
        fontSize: 14,
        color: '#111',
    },
    p: {
        paddingHorizontal: 16,
        textAlign: 'center',
        fontSize: 14,
        color: '#111',
        fontFamily: Fonts.TextRegular,
    },
})
