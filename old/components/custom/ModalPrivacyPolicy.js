import AttentionIcon from '../../../assets/oldImg/Attention.png'
import uri from '../../constants/Uri'
import { Fonts } from '../../utils/Fonts'
import HTMLView from 'react-native-htmlview'
import Modal from 'react-native-modalbox'

import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

const styles = StyleSheet.create({
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
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    htmlView: {
        marginTop: 16,
        marginBottom: 24,
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

const ModalPrivacyPolicy = ({ onAcceptClicked, modalRef }) => {
    const closeModal = () => modalRef.current.close()
    return (
        <>
            <Modal
                backdropPressToClose={false}
                style={styles.modal}
                backdrop
                ref={modalRef}
                position="center"
                useNativeDriver={true}>
                <View style={styles.wrapper}>
                    <Image style={styles.image} tintColor="black" source={AttentionIcon} />
                    <HTMLView
                        style={styles.htmlView}
                        value={`<p>Продолжая использование мобильного приложения, вы принимаете <a href="${uri.rulesFileLink}"><u>правила участия</u></a> в программе и <a href="${uri.privacyPolicyFileLink}"><u>политику конфиденциальности</u></a></p>`}
                        stylesheet={styles}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => closeModal()}>
                            <Text style={styles.cancelText}>Отменить</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => {
                                onAcceptClicked()
                                closeModal()
                            }}>
                            <Text style={styles.acceptText}>Принять</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default connect()(ModalPrivacyPolicy)
