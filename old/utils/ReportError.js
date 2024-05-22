export default function reportError(errorString, method = '') {
    console.error(errorString, method)
    if (!__DEV__) {
        try {
            console.error(errorString, method)
        } catch (error) {
            console.error(error)
        }
    }
}
