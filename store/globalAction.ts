import { Dispatch } from 'redux';
import { notification } from 'antd';
import { Dispatcher } from '../interfaces/dispatcher';
import { CLEAR } from './constants';

const ERROR_NOTIFICATION_KEY = 'ERROR_NOTIFICATION_KEY';

export function clear(): Dispatcher {
  return async (dispatch: Dispatch) => {
    dispatch({ type: CLEAR });
  };
}

export function showErrorNotification(message: string) {
  notification.error({
    duration: 5,
    message,
    key: ERROR_NOTIFICATION_KEY,
  });
}

export function hideErrorNotification() {
  notification.close(ERROR_NOTIFICATION_KEY);
}

export default clear;
