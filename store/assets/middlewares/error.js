import actions from '../actions';

const { error } = actions;

export default ({ dispatch }) => next => (action) => {
  if (typeof action !== 'function') return next(action);

  const result = next(action);

  if (!result.then) return result;

  return result.catch((e) => {
    dispatch(error(e));

    return Promise.reject(e);
  });
};
