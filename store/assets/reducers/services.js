import actions from '../actions';

const initialState = {};

export default (state = initialState, action) => {
  if (action.type === actions.fetchServices.type) {
    const { projectId, ...other } = action.payload.data.getServices;

    return {
      ...state,
      [projectId]: Object.values(other.services.reduce((res, doc) => ({
        ...res,
        [doc.sectionId]: [
          ...(res[doc.sectionId] || []),
          doc
        ]
      }), {}))
    };
  }

  return state;
};
