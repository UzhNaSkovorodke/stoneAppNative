import actions from '../actions';

const initialState = {
  list: [],
  listForPagination: [],
  current: null,
  count: 0,
  filter: null,
  pagination: null
};

export default (state = initialState, action) => {
  if (action.type === actions.saveAppealFilters.type) {
    const { page, size, ...filter } = action.payload;

    return {
      ...state,
      filter,
      pagination: { page, size }
    };
  }

  if (action.type === actions.fetchAppealList.type) {
    const prevList = action.payload.data.getEvents.pagingOptions.pageNumber === 0
      ? [] : state.list;
    const firstAppealsId = action.payload.data.getEvents.pagingOptions.pageNumber === 0
      && action.payload.data.getEvents.events.length > 0
      ? action.payload.data.getEvents.events[0].eventId
      : null;

    return {
      ...state,
      list: prevList.concat(action.payload.data.getEvents.events),
      listForPagination: action.payload.data.getEvents.events,
      count: action.payload.data.getEvents.pagingOptions.pageTotal,
      more: action.payload.data.getEvents.pagingOptions.pageTotal - 1
        > action.payload.data.getEvents.pagingOptions.pageNumber,
      loading: false,
      firstAppealsId
    };
  }

  if (action.type === actions.fetchGuestPass.type
      || action.type === actions.fetchDeliveryPass.type
      || action.type === actions.fetchTaxiPass.type
    || action.type === actions.fetchServiceCompanyAppeal.type
    || action.type === actions.fetchEditProfileAppeal.type) {
    return {
      ...state,
      current: action.payload.data.getEvent
    };
  }

  if (action.type === actions.clearAppeal.type) {
    return {
      ...state,
      current: null
    };
  }

  if (action.type === actions.addComment.type && state.current && state.current.comment) {
    return {
      ...state,
      current: {
        ...state.current,
        comment: [
          ...state.current.comment,
          action.payload
        ]
      }
    };
  }

  if (action.type === actions.setComment.type && state.current && state.current.comment) {
    return {
      ...state,
      current: {
        ...state.current,
        comment: action.payload
      }
    };
  }

  return state;
};
