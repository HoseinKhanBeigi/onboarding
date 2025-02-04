import {AnyAction} from 'redux';
import {CONFIGURATION_FAILURE, CONFIGURATION_REQUEST, GET_CONFIGURATION_SUCCESS} from '../constants';
import {ReducerInitialState} from '../../interfaces/reducerInitailState';
import {ConfigurationInterface} from '../../interfaces/common.interface';

const initialState: ReducerInitialState<ConfigurationInterface> = {
  loading: false,
  data: undefined,
  error: false,
};

export default function (
  state = initialState,
  action: AnyAction,
): ReducerInitialState {
  if (action.type === CONFIGURATION_REQUEST) {
    return {
      ...state,
      loading: true,
    };
  } else if (action.type === GET_CONFIGURATION_SUCCESS) {
    return {
      ...state,
      loading: false,
      data: action.payload?.data,
    };
  } else if (action.type === CONFIGURATION_FAILURE) {
    return {
      ...state,
      loading: false,
      error: true,
    };
  }
  return state;
}
