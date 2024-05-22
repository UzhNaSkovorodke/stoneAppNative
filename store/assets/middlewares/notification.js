/* eslint-disable no-console */
/* global WebSocket */
import actions from '../actions';

const WS_URL = process.env.REACT_APP_WS_HOST || '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const { receivedNotificationsCount } = actions;

export default ({ dispatch, getState }) => next => (action) => {
  if (action.type !== actions.authSuccess.type && action.type !== actions.checkAuth.type) {
    return next(action);
  }

  const result = next(action);
  const { auth } = getState();

  if (WS_URL && auth.token) {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      ws.send(`token=${auth.token}`);

      if (!IS_PRODUCTION) console.warn('Соединение установлено.');
    };

    ws.onclose = (event) => {
      if (event.wasClean) {
        if (!IS_PRODUCTION) console.warn('Соединение закрыто чисто');
      } else if (!IS_PRODUCTION) console.warn('Обрыв соединения'); // например, "убит" процесс сервера

      if (!IS_PRODUCTION) console.warn(`Код: ${event.code} причина: ${event.reason}`);
    };

    ws.onmessage = (event) => {
      if (!IS_PRODUCTION) console.warn(`Получены данные ${event.data}`);

      try {
        const data = JSON.parse(event.data);

        if (Object.hasOwnProperty.call(data, 'auth') && !data.auth) {
          ws.close();

          return;
        }

        if (Object.hasOwnProperty.call(data, 'amountOfUnreadNotifications')) {
          dispatch(receivedNotificationsCount(data));
        }
      } catch (e) {
        if (!IS_PRODUCTION) console.warn(e);
      }

      ws.send('pong');
    };

    ws.onerror = (error) => {
      if (!IS_PRODUCTION) console.warn(`Ошибка ${error.message}`);
    };
  }

  return result;
};
