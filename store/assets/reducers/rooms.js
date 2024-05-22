import actions from '../actions';

const initialState = { list: [], current: null };

export default (state = initialState, action) => {
  if (action.type === actions.fetchRoomsForProject.type) {
    return {
      ...state,
      list: action.payload.data.getRoomsForProject
    };
  }

  if (action.type === actions.fetchRoom.type) {
    return {
      ...state,
      current: action.payload.data.getInformationOnRoom
    };
  }

  if (action.type === actions.fetchAllRooms.type) {
    return {
      ...state,
      current: action.payload.data.getRooms
    };
  }

  return state;
};
