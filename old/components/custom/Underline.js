import PropTypes from 'prop-types'

import React, { Component } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
    underlineWrapper: {
        height: 1,
        alignItems: 'center',
    },
})

class Underline extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lineLength: new Animated.Value(0),
        }
        this.wrapperWidth = 0
    }

    componentDidMount() {
        requestAnimationFrame(() => {
            if (this.refs.wrapper == null) {
                return
            }
            const container = this.refs.wrapper // un-box animated view
            container.measure((left, top, width, height) => {
                this.wrapperWidth = width
            })
        })
    }

    expandLine() {
        const { lineLength } = this.state
        Animated.timing(lineLength, {
            toValue: this.wrapperWidth,
            duration: this.props.duration,
            useNativeDriver: true,
        }).start()
    }

    shrinkLine() {
        const { lineLength } = this.state
        Animated.timing(lineLength, {
            toValue: 0,
            duration: this.props.duration,
            useNativeDriver: true,
        }).start()
    }

    render() {
        const { borderColor } = this.props
        return (
            <View style={styles.underlineWrapper} ref="wrapper">
                <View style={[{ width: '100%', height: 1, backgroundColor: borderColor }]} />
            </View>
        )
    }
}

Underline.propTypes = {
    duration: PropTypes.number,
    borderColor: PropTypes.string,
}

Underline.defaultProps = {
    duration: 0,
    borderColor: 'black',
}

export default Underline
