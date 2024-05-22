import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { connect } from 'react-redux'

import shared from '../../store/index'
import WebView from 'react-native-webview'

const NewsScreen = ({ route, fetchNews }) => {
    const generateAssetsFontCss = (fontFileName, fileFormat = 'ttf') => {
        const fileUri = Platform.select({
            ios: `${fontFileName}.${fileFormat}`,
            android: `file:///android_asset/fonts/${fontFileName}.${fileFormat}`,
        })

        return `
      @font-face {
        font-family: '${fontFileName}';
        src: local('${fontFileName}'), url('${fileUri}') format('truetype');
      }`
    }

    const [newsText, setNewsText] = useState('')
    const [newsImage, setNewsImage] = useState('https://lk.stonehedge.ru/images/news-adaptiv.jpg')

    useEffect(() => {
        fetchNews({ newsId: route.params.id }).then((res) => {
            const { news } = res.payload.data.getNews

            if (!news || !news[0]) {
                return
            }
            setNewsText(news[0].text)
            setNewsImage(`https://lk.stonehedge.ru${news[0].previewPicture}`)
        })
    }, [route.params.id, fetchNews])

    const fontFamily = Platform.select({
        ios: 'sans-serif',
        android: 'SFUIText-Light',
    })

    const stylesText = `
      <head>
        <style type="text/css">
          ${generateAssetsFontCss('SFUIText-Light')}
          * {
            font-size: ${Platform.OS === 'ios' ? '1.2em' : '1.3em'};
            color: #111111;
            padding: 0;
            margin: 0;
            width: 100%;
            font-family: ${fontFamily};
          }
          .image {
            width: 100%;
          }
          .container {
            box-sizing: border-box;
            width:100%;
            padding: 6px 16px 22px 16px;
          }
          .text {
            line-height: 1.5;
            width: 100%;
          }
        </style>
      </head>`

    return (
        <WebView
            style={{ width: '100%' }}
            useWebKit={false}
            source={{
                html: `${stylesText}
                <body>
                    <div class="image">
                        <img src="${newsImage}" alt="" />
                    </div>
                    <br>
                    <div class="container">
                        <div class="text">${newsText}</div>
                    </div>
                </body>`,
            }}
            scalesPageToFit={false}
            textZoom={30}
            showsHorizontalScrollIndicator={false}
        />
    )
}

export default connect(null, {
    fetchNews: shared.actions.fetchNews,
})(NewsScreen)
