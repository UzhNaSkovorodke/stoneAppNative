import React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Fonts } from '../../utils/Fonts'

const ItemSelectionScreen = ({ route, navigation }) => {
    const { selectedId, itemList, onItemSelected } = route.params

    const keyExtractor = (item) => item.id

    const onGoBack = (selectedItem) => {
        onItemSelected(selectedItem)
        navigation.goBack()
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.button} onPress={() => onGoBack(item)}>
            <View style={Number(selectedId) === Number(item.id) ? styles.cellChecked : styles.cell}>
                <Text style={styles.text}>{item.text}</Text>
            </View>
        </TouchableOpacity>
    )
    return (
        <FlatList
            style={styles.flatList}
            data={itemList}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
        />
    )
}

const styles = StyleSheet.create({
    cell: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        paddingHorizontal: 16,
    },
    cellChecked: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: '#F7F7F9',
        borderRadius: 3,
        paddingHorizontal: 16,
    },
    text: {
        color: '#111',
        fontFamily: Fonts.TextLight,
        fontSize: 16,
    },
    flatList: {
        marginTop: 10,
    },
    button: {
        borderRadius: 3,
    },
})

export default ItemSelectionScreen
