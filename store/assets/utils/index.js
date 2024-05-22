import { createAction } from '@reduxjs/toolkit'

const noop = () => {}

const createAsyncActionCreator = (
    resource,
    prefix = 'fetch',
    { pre = noop, post = noop, catchCb = noop } = {}
) => {
    const apiMethod = `${prefix}${resource}`
    const processActionName = `${apiMethod}/process`
    const successActionName = `${apiMethod}/success`

    const fun = (data) => (dispatch, getState, api) => {
        const { auth } = getState()

        if (!api[apiMethod]) return Promise.reject()

        dispatch(createAction(processActionName)())

        pre({ data }, dispatch, getState, api)

        return api[apiMethod](auth.token, data)
            .then((response) => {
                post({ data, response }, dispatch, getState, api)

                return response
            })
            .then((res) => dispatch(createAction(successActionName)(res)))
            .catch((error) => {
                catchCb({ data, error }, dispatch, getState, api)

                return Promise.reject(error)
            })
    }

    fun.type = successActionName
    fun.processType = processActionName

    return fun
}

// eslint-disable-next-line import/prefer-default-export
export { createAsyncActionCreator }
