import React, { useEffect, useRef } from 'react'
import { Animated, Easing, View } from 'react-native'

import SpinLoader from '../../../assets/oldImg/SpinLoader.png'

const Spinner = (props) => {
    const loadingSpin = useRef(new Animated.Value(0)).current

    const spinAnimation = () => {
        loadingSpin.setValue(0)
        Animated.sequence([
            Animated.timing(loadingSpin, {
                toValue: 1,
                duration: 1800,
                useNativeDriver: true,
                easing: Easing.linear,
            }),
        ]).start(() => spinAnimation())
    }

    useEffect(() => {
        spinAnimation()
    }, [])

    const spin = loadingSpin.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    })

    return (
        <View>
            <Animated.Image
                style={{
                    height: 35,
                    width: 35,
                    transform: [{ rotate: spin }],
                    ...props.style,
                }}
                tintColor="#747E90"
                source={SpinLoader}
            />
        </View>
    )
}

export default Spinner
