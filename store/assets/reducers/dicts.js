import actions from '../actions';

const initialState = {
  eventType: [],
  eventStatuses: [],
  parkingPlaceTypes: [],
  eventRelevanceTypes: [],
  deliveryTypes: [],
  appealTypes: [],
  arrivalTypes: [],
  notificationTypes: [],
  billStatuses: [],
  notificationStatuses: [],
  fundsFlowTypes: []
};

export default (state = initialState, action) => {
  if (action.type === actions.fetchEventTypes.type
    || action.type === actions.fetchEventStatuses.type
    || action.type === actions.fetchParkingPlaceTypes.type
    || action.type === actions.fetchEventRelevanceTypes.type
    || action.type === actions.fetchDeliveryTypes.type
    || action.type === actions.fetchAppealTypes.type
    || action.type === actions.fetchNotificationTypes.type
    || action.type === actions.fetchArrivalTypes.type
    || action.type === actions.fetchBillStatuses.type
    || action.type === actions.fetchNotificationStatuses.type
    || action.type === actions.fetchFundsFlowTypes.type) {
    return {
      ...state,
      ...action.payload.data.getDictionaries
    };
  }

  if (action.type === actions.clearEventTypes.type) {
    return {
      ...state,
      eventType: []
    };
  }

  return state;
};
