import actions from '../actions';

const initialState = {
  errors: [],
  warnings: [],
  successes: []
};

export default (state = initialState, action) => {
  if (action.type === actions.error.type) {
    return {
      ...state,
      errors: state.errors.concat(action.payload
        .filter(({ message }) => message)
        .map((message, i) => ({ id: Date.now() + i, ...message })))
    };
  }

  if (action.type === actions.removeError.type) {
    return {
      ...state,
      errors: state.errors.filter(({ id }) => id !== action.payload)
    };
  }

  if (action.type === actions.warning.type) {
    return {
      ...state,
      warnings: state.warnings.concat(action.payload
        .filter(({ message }) => message)
        .map((message, i) => ({ id: Date.now() + i, ...message })))
    };
  }

  if (action.type === actions.removeWarning.type) {
    return {
      ...state,
      warnings: state.warnings.filter(({ id }) => id !== action.payload)
    };
  }

  if (action.type === actions.success.type) {
    return {
      ...state,
      successes: state.successes.concat(action.payload
        .filter(({ message }) => message)
        .map((message, i) => ({ id: Date.now() + i, ...message })))
    };
  }

  if (action.type === actions.removeSuccess.type) {
    return {
      ...state,
      successes: state.successes.filter(({ id }) => id !== action.payload)
    };
  }

  return state;
};
