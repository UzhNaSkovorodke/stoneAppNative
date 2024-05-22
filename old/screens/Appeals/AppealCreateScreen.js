import { FlatList, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import RoomTransferAppeal from '../../../assets/oldImg/RoomTransferImage.png'
import ClickBtn from '../../components/custom/ClickBtn'
import { APPEAL_TYPES } from '../../constants/AppealTypes'
import { Fonts } from '../../utils/Fonts'
import {
    checkValidUrl,
    filterAvailableProjectAppealTypes,
    getRootImageUrl,
} from '../../utils/Utils'
import { useNavigation } from '@react-navigation/native'

const AppealCreateScreen = ({ appealTypesArray, projects }) => {
    const navigation = useNavigation()

    const appealTypes = filterAvailableProjectAppealTypes({
        projects,
        appealTypesArray,
        appealType: APPEAL_TYPES.UK,
    })

    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>Выберите категорию для написания обращения</Text>

            <FlatList
                numColumns={2}
                data={appealTypes}
                ListHeaderComponent={
                    <Text style={styles.subLabel}>Обратиться в управляющую компанию</Text>
                }
                columnWrapperStyle={styles.columnWrapperStyle}
                renderItem={(e) => {
                    const getImg = (elem) => {
                        const image = elem.item.icon
                            ? `${getRootImageUrl()}${elem.item.icon}`
                            : RoomTransferAppeal

                        return checkValidUrl(image) ? { uri: image } : image
                    }
                    const imgSrc = getImg(e)

                    const navigationHandler = ({ item }) => {
                        navigation.navigate('EventAppealScreen', {
                            typeID: item.id,
                            projectsId: item.projects,
                            title: item.name,
                        })
                    }

                    return (
                        <ClickBtn
                            onPress={() => navigationHandler(e)}
                            imgSrc={imgSrc}
                            imgStyle={styles.imgAppeal}
                            title={e.item.name}
                        />
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F7F7F9',
    },
    label: {
        maxWidth: 260,
        marginBottom: 26,
        color: '#111111',
        fontFamily: Fonts.DisplayBold,
        fontSize: 18,
    },
    subLabel: {
        marginBottom: 16,
        color: '#747E90',
        fontFamily: Fonts.DisplayLight,
        fontSize: 12,
    },
    btnWrapper: {
        backgroundColor: '#FFFFFF',
    },
    shadowButton: {
        height: 117,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        elevation: 5,
        borderRadius: 3,
        shadowColor: '#dedede',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    imgAppeal: {
        width: 38,
        alignSelf: 'center',
        height: 46.23,
        resizeMode: 'contain',
    },
    textWrapper: {
        height: 50,
        justifyContent: 'center',
    },
    textButtonStyle: {
        color: '#747E90',
        fontFamily: Fonts.DisplayCompactSemiBold,
        fontSize: 14,
        textAlign: 'center',
    },
    columnWrapperStyle: {
        flex: 1,
        justifyContent: 'space-between',
    },
})
export default connect(({ dicts, projects }) => ({
    appealTypesArray: dicts.appealTypes,
    projects: projects.list,
}))(AppealCreateScreen)
