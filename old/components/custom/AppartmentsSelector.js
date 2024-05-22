import React from 'react'
import { StyleSheet, View } from 'react-native'

import CheckBox from './CheckBox'

import RoundButton from '../buttons/RoundButton'

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        marginTop: 17,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    roundButton: {
        height: 40,
        marginTop: 0,
        marginBottom: 13,
        marginRight: 13,
    },
    checkBoxStyle: {
        marginTop: 9,
        marginBottom: 7,
    },
})

const ApartmentsSelector = ({
    apartmentsName,
    rooms,
    isChecked,
    onSelectCheckBox,
    onRoomPress,
    project,
}) => (
    <>
        <CheckBox
            style={styles.checkBoxStyle}
            onValueChange={onSelectCheckBox}
            value={isChecked}
            label={apartmentsName}
        />
        {isChecked && (
            <View style={styles.wrapper}>
                {rooms.map((element) => (
                    <RoundButton
                        key={element.roomId.toString()}
                        style={styles.roundButton}
                        text={element.room}
                        isSelected={project.roomId.includes(element.roomId)}
                        onPress={() => onRoomPress(element)}
                    />
                ))}
            </View>
        )}
    </>
)

export default ApartmentsSelector
