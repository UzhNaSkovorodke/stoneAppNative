import { StyleSheet } from 'react-native'

import { Fonts } from '../utils/Fonts'

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
    },
    mediumText: {
        color: '#111111',
        fontFamily: Fonts.DisplayLight,
        fontSize: 14,
    },
})
