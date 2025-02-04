import {ConfigRequestInstance} from '../request';
import {Dispatcher} from '../../interfaces/dispatcher';
import {getConfigPath} from './service';
import {ConfigurationInterface} from '../../interfaces/common.interface';
import {CONFIGURATION_FAILURE, CONFIGURATION_REQUEST, GET_CONFIGURATION_SUCCESS,} from '../constants';

export function getCommon(): Dispatcher<ConfigurationInterface | undefined> {
  return async dispatch => {
    try {
      await dispatch({ type: CONFIGURATION_REQUEST });

      const response = await ConfigRequestInstance.get<ConfigurationInterface>(
        getConfigPath('common'),
        { headers: { 'application-name': 'common' } },
      );

      dispatch({
        type: GET_CONFIGURATION_SUCCESS,
        payload: { data: response.data },
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: CONFIGURATION_FAILURE,
      });

      return undefined;
    }
  };
}

export default getCommon;
