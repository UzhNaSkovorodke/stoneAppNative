export default class Timer {
    constructor(callback, delay) {
        let timerId
        let start
        let remaining = delay
        this.pause = function () {
            window.clearTimeout(timerId)
            remaining -= Date.now() - start
        }
        this.resume = function () {
            start = Date.now()
            window.clearTimeout(timerId)
            timerId = window.setTimeout(callback, remaining)
        }
        this.resume()
    }
}
