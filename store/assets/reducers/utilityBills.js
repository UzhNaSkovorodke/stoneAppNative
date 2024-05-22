import actions from '../actions';

const initialState = {
  list: [],
  current: null,
  count: 0,
  listForPagination: []
};

export default (state = initialState, action) => {
  if (action.type === actions.fetchUtilityBills.type) {
    const {
      bills,
      pagingOptions
    } = action.payload.data.getBills;
    const prevList = pagingOptions.pageNumber === 0 ? [] : state.list;
    return {
      ...state,
      list: prevList.concat(bills),
      listForPagination: bills,
      count: pagingOptions.total,
      current: null,
      more: (Math.trunc(pagingOptions.pageTotal
                    / pagingOptions.pageSize) + 1)
                > pagingOptions.pageNumber
    };
  }

  return state;
};
