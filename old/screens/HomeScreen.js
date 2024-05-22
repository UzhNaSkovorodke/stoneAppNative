import React, { useEffect, useState } from 'react'
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native'
import { connect } from 'react-redux'

import GuestsIcon from '../../assets/oldImg/Guests.png'
import MakeAppealIcon from '../../assets/oldImg/MakeAppeal.png'
import TaxiIcon from '../../assets/oldImg/Taxi.png'

import ButtonWithIcon from '../components/buttons/ButtonWithIcon'
import SplitLine from '../components/custom/SplitLine'

import { fetchAllNews } from '../../store/assets/api'
import shared from '../../store/index'
import { APPEAL_SELECTION_TYPES } from '../constants/AppealTypes'
import commonStyles from '../styles/CommonStyles'
import { Fonts } from '../utils/Fonts'
import { useNavigation } from '@react-navigation/native'

const styles = StyleSheet.create({
    scrollView: {},
    newsWrapper: {
        width: '100%',
    },
    container: {
        marginTop: 16,
        backgroundColor: 'transparent',
        paddingHorizontal: 10,
    },
    wrapper: {
        width: '100%',
        paddingHorizontal: 6,
    },
    newsImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    containerText: {
        marginTop: 5,
        marginBottom: 26,
        color: '#111111',
        fontFamily: Fonts.DisplayBold,
        fontSize: 18,
        marginHorizontal: 6,
    },
    newsPlaceholder: {
        width: '100%',
        height: 150,
        marginBottom: 10,
        backgroundColor: '#DEE0E5',
    },
    newsText: {
        color: '#111111',
        fontFamily: Fonts.DisplayCompactSemiBold,
        fontSize: 14,
    },
    oneNews: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        marginHorizontal: 6,
        shadowColor: '#B7B7B7',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    guestsIcon: {
        width: 28,
        height: 17,
        marginHorizontal: 16,
    },
    taxiIcon: {
        width: 40,
        height: 16,
        marginHorizontal: 10,
    },
    makeAppealIcon: {
        width: 26,
        height: 25,
        marginHorizontal: 18,
    },
    buildingAppealIcon: {
        width: 25,
        height: 18,
        marginHorizontal: 18,
    },
    splitLine: {
        width: Dimensions.get('screen').width - 32,
        marginLeft: 6,
    },
    placeholder: {
        backgroundColor: '#DEE0E5',
        borderRadius: 3,
    },
    wrapperPadding: {
        padding: 16,
    },
    oneNewsButton: {
        flex: 1,
        borderRadius: 3,
    },
    placeholderLine: {
        backgroundColor: '#DEE0E5',
    },
})

const HomeScreen = ({}) => {
    const [news, setNews] = useState(null)
    const navigation = useNavigation()

    const getAllNews = async (isUpdateNews = false, count = 10) => {
        await fetchAllNews({ page: (count / 10).toFixed(0) - 1, size: 10 }) // page = 1, size = 10
            .then((resp) => {
                setNews(resp.data.getNews.news)
            })
            .catch((e) => console.log(e))
    }

    useEffect(() => {
        getAllNews().catch((e) => console.log(e))
    }, [])

    return (
        <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
            <View style={[commonStyles.container, styles.container]}>
                <View style={styles.wrapper}>
                    <ButtonWithIcon
                        label="Счета"
                        description="Нажмите, чтобы посмотреть и оплатить"
                        source={GuestsIcon}
                        imageStyle={styles.guestsIcon}
                        onPress={() => {
                            navigation.navigate('PaymentsScreen')
                        }}
                    />
                    <ButtonWithIcon
                        label="Заказать пропуск"
                        description="Для гостя, такси или доставки"
                        source={TaxiIcon}
                        imageStyle={styles.taxiIcon}
                        onPress={() => {
                            navigation.navigate('SelectPassOrderScreen')
                        }}
                    />
                    {/*{this.hasUKAppeals && (*/}
                    <ButtonWithIcon
                        label="Обратиться в УК"
                        description="Нажмите, чтобы обратиться"
                        source={MakeAppealIcon}
                        imageStyle={styles.makeAppealIcon}
                        onPress={() => {
                            navigation.navigate('AppealCreateScreen', {
                                mode: APPEAL_SELECTION_TYPES.MANAGE_COMPANY,
                            })
                        }}
                    />
                </View>

                <SplitLine style={styles.splitLine} />

                <Text style={styles.containerText}>Лента новостей</Text>

                <View style={styles.newsWrapper}>
                    {!news && <View style={styles.newsPlaceholder} />}
                    {news &&
                        news.map((newsItem, index) => {
                            return (
                                <View style={styles.oneNews} key={index}>
                                    <TouchableHighlight
                                        style={styles.oneNewsButton}
                                        underlayColor="#E8E8E8"
                                        onPress={() =>
                                            navigation.navigate('NewsScreen', {
                                                title: newsItem.title,
                                                id: newsItem.newsId,
                                            })
                                        }>
                                        <>
                                            <Image
                                                style={styles.newsImage}
                                                source={
                                                    newsItem.previewPicture
                                                        ? {
                                                              uri: `https://admin-lk.stonehedge.ru${newsItem.previewPicture}`,
                                                          }
                                                        : NewsIcon
                                                }
                                            />
                                            <View style={styles.wrapperPadding}>
                                                <Text style={styles.newsText}>
                                                    {newsItem.title}
                                                </Text>
                                            </View>
                                        </>
                                    </TouchableHighlight>
                                </View>
                            )
                        })}
                </View>
            </View>
        </ScrollView>
    )
}

export default connect(
    ({ notifications, dicts, projects }) => ({
        notifications,
        appealTypesArray: dicts.appealTypes,
        projects: projects.list,
    }),
    {
        fetchAllNews: shared.actions.fetchAllNews,
        setWarning: shared.actions.warning,
        setSuccess: shared.actions.success,
        editProfileFcmToken: shared.actions.editProfilePushNotifcations,
        fetchBill: shared.actions.fetchBill,
        updateNotification: shared.actions.updateNotification,
        incrementNotification: shared.actions.incrimentNotification,
        getNotifications: shared.actions.fetchNotifications,
    }
)(HomeScreen)
