import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

import styles from './styles'

import AttentionIcon from '../../../../assets/oldImg/Attention.png'
import PropTypes from 'prop-types'
import Modal from 'react-native-modalbox'

const ModalAgreementComponent = ({ onAcceptClicked, message, onClose }) => {
    const [modalVisibility, setModalVisibility] = useState(true)
    const closeModal = () => {
        if (onClose) {
            onClose()
        }

        setModalVisibility(false)
    }

    return (
        <>
            <Modal
                isOpen={modalVisibility}
                backdropPressToClose={false}
                style={styles.modal}
                backdrop
                position="center"
                useNativeDriver>
                <View style={styles.wrapper}>
                    <Image style={styles.image} tintColor="black" source={AttentionIcon} />
                    <View style={styles.descriptionWrapper}>
                        <Text style={styles.descriptionText}>{message}</Text>
                    </View>
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

ModalAgreementComponent.propTypes = {
    onAcceptClicked: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default connect()(ModalAgreementComponent)
