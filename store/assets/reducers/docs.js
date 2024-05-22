import actions from '../actions';

const initialState = {};

export default (state = initialState, action) => {
  if (action.type === actions.fetchDocs.type) {
    const { getDocumentsOnProjectId } = action.payload.data;
    const { projectId, documents } = getDocumentsOnProjectId;

    return {
      ...state,
      [projectId]: Object.values(documents.reduce((res, doc) => ({
        ...res,
        ['_' + doc.sectionId]: [
          ...(res['_' + doc.sectionId] || []),
          doc
        ]
      }), {}))
    };
  }

  return state;
};
