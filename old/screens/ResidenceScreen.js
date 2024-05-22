import React from 'react'
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native'
import { connect } from 'react-redux'

import Residence from '../../assets/oldImg/Residence.png'

import CommentLabel from '../components/custom/CommentLabel'

import { Fonts } from '../utils/Fonts'

const styles = StyleSheet.create({
    cell: {
        marginTop: 12,
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginHorizontal: 16,
        shadowColor: '#B7B7B7',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    cellTitle: {
        flex: 1,
        marginBottom: 18,
        color: '#111111',
        fontFamily: Fonts.DisplayCompactSemiBold,
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 8,
        backgroundColor: '#F7F7F9',
    },
    placeholder: {
        width: '95%',
        height: 150,
        marginBottom: 10,
        backgroundColor: '#DEE0E5',
    },
    address: {
        marginTop: 5,
        color: '#111111',
        fontFamily: Fonts.TextLight,
        fontSize: 14,
    },
    residenceImage: {
        width: '100%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    button: {
        borderRadius: 8,
    },
    buttonView: {
        backgroundColor: '#FFFFFF',
    },
})

class ResidenceScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        const { projects } = this.props
        this.setState({ data: projects })
    }

    onResidenceButtonClick(id) {
        const { navigation } = this.props
        const { data } = this.state

        navigation.navigate('MyResidenceScreen', { data: data[id] })
    }

    keyExtractor = (item) => item.projectId.toString()

    renderItem = ({ item, index }) => (
        <View style={styles.cell}>
            <TouchableHighlight
                style={styles.button}
                onPress={() => this.onResidenceButtonClick(index)}>
                <View style={styles.buttonView}>
                    <Image
                        source={
                            item.previewPicture[0] ? { uri: item.previewPicture[0] } : Residence
                        }
                        style={[
                            styles.residenceImage,
                            {
                                height:
                                    Dimensions.get('screen').width *
                                    (Image.resolveAssetSource(Residence).height /
                                        Image.resolveAssetSource(Residence).width),
                            },
                        ]}
                    />
                    <View style={{ padding: 16 }}>
                        <Text style={styles.cellTitle}>{item.projectName}</Text>
                        <CommentLabel text="Адрес" />
                        <Text style={styles.address}>{item.address}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    )

    render() {
        const { data } = this.state
        return (
            <View style={styles.container}>
                <FlatList
                    data={data}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                />
            </View>
        )
    }
}
export default connect(({ projects }) => ({ projects: projects.list }))(ResidenceScreen)
