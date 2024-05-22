import React from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'

import AdditionalServices from '../../assets/oldImg/CleaningServices.png'
import Documents from '../../assets/oldImg/Docs.png'
import Payment from '../../assets/oldImg/Payments.png'
import ArtResidence from '../../assets/oldImg/Residence.png'

import ButtonWithIcon from '../components/buttons/ButtonWithIcon'
import EmailButton from '../components/buttons/EmailButton'
import PhoneButton from '../components/buttons/PhoneButton'
import WorkingHoursButton from '../components/buttons/WorkingHoursButton'
import SplitLine from '../components/custom/SplitLine'

import { Fonts } from '../utils/Fonts'

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#F7F7F9',
    },
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: -25,
        marginBottom: 15,
        borderRadius: 3,
        marginHorizontal: 16,
    },
    text: {
        color: '#747E90',
        fontFamily: Fonts.DisplayLight,
        fontSize: 12,
    },
    description: {
        marginTop: 6,
        color: '#111111',
        fontFamily: Fonts.TextLight,
        fontSize: 14,
    },
    label: {
        marginBottom: 10,
        color: '#111111',
        fontFamily: Fonts.DisplayBold,
        fontSize: 18,
    },
    modalWindow: {
        width: '100%',
        height: 200,
        justifyContent: 'flex-start',
    },
    placement: {
        width: '100%',
        padding: 16,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        shadowColor: '#B7B7B7',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    apartment: {
        marginTop: 6,
        marginBottom: 10,
        color: '#111111',
        fontFamily: Fonts.DisplayCompactSemiBold,
        fontSize: 16,
    },
    arrowDown: {
        width: 7,
        height: 5,
        marginLeft: 8,
        tintColor: '#CCCCCC',
    },
    additionalServicesImage: {
        width: 30,
        height: 32.14,
        marginRight: 28,
        marginLeft: 16,
    },
    paymentImage: {
        width: 24,
        height: 38.39,
        marginRight: 31,
        marginLeft: 19,
    },
    documentsImage: {
        width: 24,
        height: 33.15,
        marginRight: 31,
        marginLeft: 19,
    },
    splitLine: {
        marginTop: 24,
        marginBottom: 27,
    },
    bottomMarginView: {
        height: 24,
    },
    rightMargin: {
        marginRight: 18,
    },
    contactsWrapper: {
        marginTop: 24,
    },
    contactsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
})

class MyResidenceScreen extends React.Component {
    onDocumentsButtonPress = () => {
        const { route, navigation } = this.props
        navigation.navigate('DocumentsScreen', {
            projectId: route.params.data.projectId,
        })
    }

    onPaymentButtonPress = () =>
        this.props.navigation.navigate('PaymentsScreen', {
            projectId: this.props.route.params.data.projectId,
            fundsFlowProjectId: this.props.route.params.data.projectId,
        })

    onAdditionalServicesButtonPress = () =>
        this.props.navigation.navigate('AdditionalServicesScreen', {
            projectId: this.props.route.params.data.projectId,
        })

    renderContacts = () =>
        this.props.route.params.data.contacts.map(
            ({ contactPerson, phoneNumber, schedule, email }) => (
                <View style={styles.contactsWrapper} key={contactPerson}>
                    {contactPerson && <Text style={styles.text}>{contactPerson}</Text>}
                    <View style={styles.contactsContainer}>
                        {phoneNumber && phoneNumber[0] && (
                            <PhoneButton style={styles.rightMargin} number={phoneNumber[0]} />
                        )}
                        {phoneNumber && phoneNumber[1] && (
                            <PhoneButton style={styles.rightMargin} number={phoneNumber[1]} />
                        )}
                        {schedule && (
                            <WorkingHoursButton style={styles.rightMargin} currentMode={schedule} />
                        )}
                        {email && <EmailButton style={styles.rightMargin} mail={email} />}
                    </View>
                </View>
            )
        )

    renderApartmentsDescriptionView = () => (
        <>
            <Text style={styles.text}>Адрес</Text>
            <Text style={styles.description}>{this.props.route.params.data.address}</Text>
        </>
    )

    render() {
        const { data } = this.props.route.params
        const imageRenderHeight =
            Dimensions.get('screen').width *
            (Image.resolveAssetSource(ArtResidence).height /
                Image.resolveAssetSource(ArtResidence).width)

        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={styles.scrollView}>
                    <Image
                        style={{ width: '100%', height: imageRenderHeight }}
                        source={
                            data.previewPicture[0] ? { uri: data.previewPicture[0] } : ArtResidence
                        }
                    />
                    <View style={styles.container} overflow="hidden">
                        <View style={styles.placement}>
                            {this.renderApartmentsDescriptionView()}
                        </View>
                        <ButtonWithIcon
                            onPress={this.onAdditionalServicesButtonPress}
                            label="Дополнительные услуги"
                            description="Нажмите, чтобы ознакомиться"
                            source={AdditionalServices}
                            imageStyle={styles.additionalServicesImage}
                        />
                        <ButtonWithIcon
                            onPress={this.onPaymentButtonPress}
                            label="Счета"
                            description="Нажмите, чтобы посмотреть и оплатить"
                            source={Payment}
                            imageStyle={styles.paymentImage}
                        />
                        <ButtonWithIcon
                            onPress={this.onDocumentsButtonPress}
                            label="Документы"
                            description="Нажмите, чтобы ознакомиться"
                            source={Documents}
                            imageStyle={styles.documentsImage}
                        />
                        <SplitLine style={styles.splitLine} />
                        <Text style={styles.label}>Контакты</Text>
                        {this.renderContacts()}
                    </View>
                    <View style={styles.bottomMarginView} />
                </ScrollView>
            </View>
        )
    }
}

export default MyResidenceScreen
