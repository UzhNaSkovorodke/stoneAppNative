import actions from '../actions';

const initialState = {
  list: [],
  loading: false
};

export default (state = initialState, action) => {
  if (action.type === actions.fetchProjects.processType) {
    return {
      ...state,
      loading: true
    };
  }

  if (action.type === actions.fetchProjects.type) {
    return {
      ...state,
      list: action.payload.data.getRealEstate,
      loading: false
    };
  }

  return state;
};
