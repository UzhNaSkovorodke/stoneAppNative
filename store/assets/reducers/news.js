import actions from '../actions';

const initialState = {
  list: [],
  current: null,
  more: true,
  pageTotal: 0,
  total: 0
};

export default (state = initialState, action) => {
  if (action.type === actions.fetchAllNews.type) {
    const { pagingOptions } = action.payload.data.getNews;
    const prevList = action.payload.page ? state.list : [];
    const list = prevList.concat(action.payload.data.getNews.news);
    return {
      ...state,
      more: Math.ceil(list.length / action.payload.size) < pagingOptions.pageTotal,
      pageTotal: pagingOptions.pageTotal,
      total: pagingOptions.total,
      list
    };
  }

  if (action.type === actions.fetchNews.type) {
    return {
      ...state,
      current: action.payload.data.getNews.news[0]
    };
  }

  return state;
};
