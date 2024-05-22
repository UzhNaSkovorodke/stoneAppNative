import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'

import Spinner from '../components/custom/Spinner'

import shared from '../../store/index'
import WebView from 'react-native-webview'

const styles = StyleSheet.create({
    webView: {
        flex: 1,
    },
    spinnerWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

const BillPaymentScreen = ({ route, navigation, fetchBillPaymentUrl, fetchRoomPaymentUrl }) => {
    const [uri, setUri] = useState('')
    const [isLoading, setLoadingState] = useState(true)

    const loadRoomPaymentLink = ({ roomId, total }) => {
        fetchRoomPaymentUrl({ roomId, total })
            .then((response) => {
                const { paymentLink } = response.payload.data.getRoomPayment
                setUri(paymentLink)
            })
            .finally(() => setLoadingState(false))
    }

    const loadBillPaymentLink = (billId) => {
        fetchBillPaymentUrl({ billId })
            .then((response) => {
                const { paymentLink } = response.payload.data.getBillPayment
                setUri(paymentLink)
            })
            .finally(() => setLoadingState(false))
    }

    const fetchPaymentLink = () => {
        setLoadingState(true)

        const { billId, room } = route.params

        if (billId) {
            loadBillPaymentLink(billId)
        } else if (room) {
            loadRoomPaymentLink(room)
        } else {
            console.error('No Data')
        }
    }

    const onNavigationStateChange = (webViewState) => {
        const rederectedUrl = 'https://mpi.mkb.ru:9443/WebResource/signature.html'
        const mainBankUrl = 'https://mkb.ru/'
        const mainWebSite = 'https://lk.stonehedge.ru'

        if (webViewState.url.includes(mainWebSite)) {
            navigation.goBack()
            return
        }

        if (webViewState.url === rederectedUrl || webViewState.url === mainBankUrl) {
            navigation.goBack()
        }
    }

    useEffect(() => {
        fetchPaymentLink()
    }, [])

    const renderSpinner = () => (
        <View style={styles.spinnerWrapper}>
            <Spinner />
        </View>
    )

    return isLoading ? (
        renderSpinner()
    ) : (
        <WebView
            onNavigationStateChange={onNavigationStateChange}
            style={styles.webView}
            source={{ uri }}
            enableApplePay={true}
            automaticallyAdjustContentInsets={false}
        />
    )
}

export default connect(null, {
    fetchBillPaymentUrl: shared.actions.fetchBillPaymentLink,
    fetchRoomPaymentUrl: shared.actions.fetchRoomPaymentLink,
})(BillPaymentScreen)
