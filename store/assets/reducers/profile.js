import actions from '../actions';

const initialState = {
  enablePush: false
};

export default (state = initialState, action) => {
  if (action.type === actions.fetchProfile.type) {
    return {
      ...state,
      ...action.payload.data.profile
    };
  }

  if (action.type === actions.toggleProfilePush.type) {
    return {
      ...state,
      enablePush: action.payload.enablePush
    };
  }

  return state;
};
