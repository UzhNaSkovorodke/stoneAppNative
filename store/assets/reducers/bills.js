import actions from '../actions';

const initialState = {
  list: [],
  current: null,
  count: 0,
  listForPagination: []
};

export default (state = initialState, action) => {
  if (action.type === actions.fetchBills.type) {
    const { bills, pagingOptions } = action.payload.data.getBills;
    const prevList = pagingOptions.pageNumber === 0
      ? [] : state.list;
    return {
      ...state,
      list: prevList.concat(bills),
      listForPagination: bills,
      count: pagingOptions.total,
      current: null,
      more: pagingOptions.pageTotal - 1
          > pagingOptions.pageNumber
    };
  }

  if (action.type === actions.fetchBill.type) {
    return {
      ...state,
      current: action.payload.data.getBill
    };
  }

  return state;
};
