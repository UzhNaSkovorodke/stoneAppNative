import actions from '../actions';

const initialState = {
  list: [],
  current: null,
  more: true,
  unreadTotal: 0
};

export default (state = initialState, action) => {
  if (action.type === actions.fetchNotifications.type) {
    const { getNotifications } = action.payload.data;
    const prevList = action.payload.page ? state.list : [];
    // const list = getNotifications.notification;
    const list = prevList.concat(getNotifications.notification);

    return {
      ...state,
      list,
      more: Math.ceil(list.length / action.payload.size) < getNotifications.pagingOptions.pageTotal,
      unreadTotal: getNotifications.pagingOptions.unreadTotal
    };
  }

  if (action.type === actions.setNotification.type) {
    return {
      ...state,
      current: action.payload
    };
  }

  if (action.type === actions.getNewNotifications.type) {
    const list = action.payload.data.getNotifications.notification.concat(state.list);

    return {
      ...state,
      list
    };
  }

  if (action.type === actions.incrimentNotification.type) {
    return {
      ...state,
      unreadTotal: state.unreadTotal + 1
    };
  }

  if (action.type === actions.setNotificationVisited.type) {
    const notification = state.list.find(n => n.notificationId === action.payload);

    if (notification && !notification.isVisited) {
      notification.isVisited = true;

      return {
        ...state,
        unreadTotal: state.unreadTotal - 1
      };
    }
  }

  return state;
};
