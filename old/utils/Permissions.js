import { PermissionsAndroid, Platform } from 'react-native'

import shared from '../../store/index'

export const invokePermissionWriteExternalStorageDialog = async () => {
    if (Platform.OS === 'ios') {
        return true
    }
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'Разрешение на чтение файлов',
                message: 'Приложению необходимо разрешение, чтобы скачать файл',
            }
        )
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            shared.store.dispatch(shared.actions.error({ message: 'Разрешите доступ к памяти' }))
        }
    } catch (err) {
        return false
    }
    return true
}
