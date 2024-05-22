import * as api from '../api'
import { error, notification } from '../middlewares'
import * as reducers from '../reducers'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { withExtraArgument } from 'redux-thunk'

export default createStore(
    combineReducers(reducers),
    applyMiddleware(error, notification, withExtraArgument(api))
)
