import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import AnotherFile from '../../../assets/oldImg/Document.png'
import ExitImg from '../../../assets/oldImg/Exit3.png'
import Pdf from '../../../assets/oldImg/Pdf.png'

const styles = StyleSheet.create({
    filesContainer: {
        zIndex: 1,
        width: 80,
        height: 68,
        alignItems: 'center',
        marginTop: 16,
        marginRight: 16,
        marginBottom: 5,
        backgroundColor: '#747E90',
        borderRadius: 3,
    },
    imageWrapping: {
        width: '100%',
        height: 35,
        marginTop: 8,
        resizeMode: 'contain',
    },
    textWrapping: {
        flex: 1,
        color: '#FFFFFF',
        fontFamily: 'SFProDisplay-Semibold',
        fontSize: 8,
    },
    viewWrapping: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        paddingTop: 6,
        paddingBottom: 8,
    },
    exitButtonContainer: {
        position: 'absolute',
        zIndex: 99,
        top: 0,
        right: 0,
        width: 12,
        height: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    exitImage: {
        width: 6,
        height: 6,
        opacity: 0.9,
        tintColor: '#FFFFFF',
    },
    truncateText: {
        overflow: 'hidden',
        flex: 1,
        textAlign: 'right',
    },
})

class ImageContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isImageFullScreenVisible: false,
            isWorking: true,
        }
        this.RemoveFromList = this.props.onRemoveItem
    }

    onClickDisable = () => {
        this.setState({ isWorking: false })
        this.RemoveFromList(this.props.idComponent.key)
    }

    getFileName = (fullFileName) => fullFileName.split('.').slice(0, -1).join('')

    getFileType = (fullFileName) => fullFileName.split('.').pop()

    onPickerShow = ({ type, navigation, fileUri, fileName }) => {
        const { onClick } = this.props
        if (onClick) {
            onClick()
        }

        if (this.RemoveFromList !== undefined) {
            type === 'image' ? this.pickerRefImage.show() : this.pickerRef.show()
            return
        }
        if (type === 'image') {
            this.setState({ isImageFullScreenVisible: true })
        } else if (type === 'pdf') {
            navigation.navigate('PdfViewScreen', {
                fileLink: fileUri,
                title: fileName,
            })
        } else if (type === 'other') {
            // / TODO: STH-916 Download Files and invoke downloadFile({fileLink, fileName})
        }
    }

    render() {
        const { isWorking, isImageFullScreenVisible } = this.state
        const { isImage, isPdf, fileName, fileUri, isExe } = this.props.idComponent
        const { navigation, containerStyle } = this.props
        if (!isWorking) {
            return null
        }
        if (isImage) {
            const images = [
                {
                    source: {
                        uri: `${this.RemoveFromList === undefined ? 'https:' : ''}${fileUri}`,
                    },
                },
            ]
            return (
                <View>
                    {/*<ImageView*/}
                    {/*    images={images}*/}
                    {/*    imageIndex={0}*/}
                    {/*    isVisible={isImageFullScreenVisible}*/}
                    {/*    onClose={() => this.setState({ isImageFullScreenVisible: false })}*/}
                    {/*/>*/}
                    <TouchableOpacity
                        onPress={() =>
                            this.onPickerShow({
                                type: 'image',
                                fileName,
                                fileUri,
                                navigation,
                            })
                        }
                        style={[styles.filesContainer, containerStyle]}>
                        {/*<ReactNativePickerModule*/}
                        {/*    pickerRef={(e) => {*/}
                        {/*        this.pickerRefImage = e*/}
                        {/*    }}*/}
                        {/*    title="Выберите Действие"*/}
                        {/*    confirmButton="Выбрать"*/}
                        {/*    cancelButton="Отмена"*/}
                        {/*    items={['Открыть', 'Удалить']}*/}
                        {/*    onValueChange={(value) => {*/}
                        {/*        if (value === 'Удалить') {*/}
                        {/*            this.onClickDisable()*/}
                        {/*        }*/}
                        {/*        if (value === 'Открыть') {*/}
                        {/*            // задержка нужно чтобы скрылся пикер*/}
                        {/*            setTimeout(*/}
                        {/*                () => this.setState({ isImageFullScreenVisible: true }),*/}
                        {/*                400*/}
                        {/*            )*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*/>*/}
                        <Image
                            style={{ width: 80, height: 68 }}
                            source={{
                                uri: `${
                                    this.RemoveFromList === undefined ? 'https:' : ''
                                }${fileUri}`,
                            }}
                        />
                        {this.RemoveFromList !== undefined && (
                            <TouchableOpacity
                                onPress={this.onClickDisable}
                                style={styles.exitButtonContainer}>
                                <Image style={styles.exitImage} source={ExitImg} />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                </View>
            )
        }
        if (isPdf) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.onPickerShow({
                            type: 'pdf',
                            fileName,
                            fileUri,
                            navigation,
                        })
                    }}
                    style={[styles.filesContainer, containerStyle]}>
                    {/*<ReactNativePickerModule*/}
                    {/*    pickerRef={(e) => {*/}
                    {/*        this.pickerRef = e*/}
                    {/*    }}*/}
                    {/*    title="Выберите Действие"*/}
                    {/*    confirmButton="Выбрать"*/}
                    {/*    cancelButton="Отмена"*/}
                    {/*    items={['Открыть', 'Удалить']}*/}
                    {/*    onValueChange={(value) => {*/}
                    {/*        if (value === 'Удалить') {*/}
                    {/*            this.onClickDisable()*/}
                    {/*        }*/}
                    {/*        if (value === 'Открыть') {*/}
                    {/*            navigation.navigate('PdfViewScreen', {*/}
                    {/*                fileLink: fileUri,*/}
                    {/*                title: fileName,*/}
                    {/*            })*/}
                    {/*        }*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <Image style={styles.imageWrapping} tintColor="#FFFFFF" source={Pdf} />
                    <View style={styles.viewWrapping}>
                        <Text
                            style={[styles.textWrapping, styles.truncateText]}
                            ellipsizeMode="tail"
                            numberOfLines={1}>
                            {this.getFileName(fileName)}
                        </Text>
                        <Text style={styles.textWrapping}>{`.${this.getFileType(fileName)}`}</Text>
                    </View>
                    {this.RemoveFromList !== undefined && (
                        <TouchableOpacity
                            onPress={this.onClickDisable}
                            style={styles.exitButtonContainer}>
                            <Image style={styles.exitImage} source={ExitImg} />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            )
        }
        if (!isExe) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.onPickerShow({
                            type: 'other',
                            fileName,
                            fileUri,
                            navigation,
                        })
                    }}
                    style={[styles.filesContainer, containerStyle]}>
                    <Image style={styles.imageWrapping} tintColor="#FFFFFF" source={AnotherFile} />
                    <View style={styles.viewWrapping}>
                        <Text
                            style={[styles.textWrapping, styles.truncateText]}
                            ellipsizeMode="tail"
                            numberOfLines={1}>
                            {this.getFileName(fileName)}
                        </Text>
                        <Text style={styles.textWrapping}>{`.${this.getFileType(fileName)}`}</Text>
                    </View>
                    {this.RemoveFromList !== undefined && (
                        <TouchableOpacity
                            onPress={this.onClickDisable}
                            style={styles.exitButtonContainer}>
                            <Image style={styles.exitImage} source={ExitImg} />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            )
        }
        return undefined
    }
}
export default ImageContainer
