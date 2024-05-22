/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
import actions from '../actions';

const initialState = {
  signin: self.localStorage ? !!self.localStorage.getItem('TOKEN') : false,
  token: self.localStorage ? self.localStorage.getItem('TOKEN') : ''
};

export default (state = initialState, action) => {
  if (action.type === actions.authSuccess.type) {
    if (self.localStorage) self.localStorage.setItem('TOKEN', action.payload.token);

    return {
      ...state,
      ...action.payload
    };
  }

  if (action.type === actions.checkAuth.type) {
    if (!action.payload) {
      if (self.localStorage) self.localStorage.removeItem('TOKEN');
    }

    return {
      ...state

    };
  }

  if (action.type === actions.changePassword.type) {
    if (self.localStorage) self.localStorage.removeItem('TOKEN');

    return {
      ...state,
      token: null
    };
  }

  if (action.type === actions.logout.type) {
    if (self.localStorage) self.localStorage.removeItem('TOKEN');

    return {
      ...state,
      signin: false
    };
  }

  return state;
};
