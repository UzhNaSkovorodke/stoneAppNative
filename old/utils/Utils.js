import { Platform } from 'react-native'

import { invokePermissionWriteExternalStorageDialog } from './Permissions'

import constants from '../constants/Uri'
import moment from 'moment/locale/ru'

//import reportError from './ReportError';

export const APPEAL_STATE_TYPES = {
    APPEAL_IN_PROCESSING: 1,
    APPEAL_IN_WORK: 2,
    APPEAL_CLOSED: 3,
}

const isRequired = (error = 'Параметр обязателен') => {
    throw new Error(error)
}

export const normalizePrice = (price) => {
    const priceParts = String(price).split('.')
    const renderDecimalPart = () => (priceParts[1] ? `,${priceParts[1]}` : '')

    let res = priceParts[0]
    if (priceParts[1] === '00') {
        return `${res}`
    } else {
        return `${res}${renderDecimalPart()}`
    }
}

export const getTime = () => {
    const interval = 5 * 60 * 1000
    return moment(Math.ceil(moment().seconds(0).milliseconds(0) / interval) * interval).add(
        10,
        'minutes'
    )
}

export const filterAvailableProjectAppealTypes = ({
    appealType = isRequired(),
    projects = isRequired(),
    appealTypesArray = isRequired(),
}) =>
    appealTypesArray
        .filter((at) =>
            at.projects.some((atProject) =>
                projects.some((project) => project.projectId === atProject)
            )
        )
        .filter((at) => at.section === appealType)

export const getRootImageUrl = () => {
    if (__DEV__) {
        return constants.rootImageDevUrl
    }
    return constants.rootImageProdUrl
}

export const checkValidUrl = (url) => {
    const regex =
        /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
    return regex.test(url)
}

export const replaceSymbols = (text, comment = false) => {
    if (comment) {
        return text.replace(/(\r\n|\n|\r)/gm, '\\n').replace(/[\\"]/g, '\\$&')
    } else {
        return text.replace(/[\\"]/g, '\\$&')
    }
}

export const downloadFile = async ({ fileLink, fileName = '' }) => {
    // if (await invokePermissionWriteExternalStorageDialog()) {
    //   fileLink = String(fileLink).startsWith('https:')
    //     ? fileLink
    //     : `https:${fileLink}`;
    //   const { config, fs, ios } = RNFetchBlob;
    //   const { DocumentDir, DownloadDir } = fs.dirs;
    //   const dirToSave = Platform.OS === 'ios' ? DocumentDir : DownloadDir;
    //   const path = `${dirToSave}/${fileName.replace(/ /g, '_')}`;
    //   const lastDot = String(fileLink).lastIndexOf('.');
    //   const appendExt = lastDot ? String(fileLink).slice(lastDot + 1) : undefined;
    //   config({
    //     fileCache: true,
    //     path,
    //     appendExt,
    //     addAndroidDownloads: {
    //       useDownloadManager: true,
    //       notification: true,
    //       mediaScannable: true,
    //       path,
    //       description: `Скачивание ${fileName}`,
    //     },
    //   })
    //     .fetch('GET', fileLink, {})
    //     .then(async ({ base64 }) => {
    //       if (Platform.OS === 'ios') {
    //         const b64 = await base64();
    //         const filePath = path + (appendExt ? `.${appendExt}` : '');
    //         fs.writeFile(filePath, b64, 'base64');
    //         ios.previewDocument(filePath);
    //       }
    //     })
    //     .catch(error => {
    //       //reportError(error, 'File download failed');
    //     });
    // }
}
