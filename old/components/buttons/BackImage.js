import React from 'react'
import { Image, Platform, View } from 'react-native'

const BackImage = ({ width, height, source }) => {
    return (
        <View style={{ padding: 8, marginLeft: Platform.OS === 'ios' ? 8 : 0 }}>
            <Image
                style={{
                    width,
                    height,
                    tintColor: '#434851',
                }}
                source={source ?? undefined}
            />
        </View>
    )
}

export default BackImage
