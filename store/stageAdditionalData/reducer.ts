import {AnyAction} from 'redux';
import {ReducerInitialState} from '../../interfaces/reducerInitailState';
import {CLEAR, FAILED_RESOLVE_STAGE_DATA, REQUEST_RESOLVE_STAGE_DATA, STAGE_DATA_RESOLVED} from '../constants';

const initialState: ReducerInitialState<Record<string, Record<string, any>>> = {
  loading: false,
  data: undefined,
  error: false,
};

export default function(
  state = initialState,
  action: AnyAction,
): ReducerInitialState {
  if (action.type === REQUEST_RESOLVE_STAGE_DATA) {
    return {
      ...state,
      loading: true,
      error: false
    }
  } else if (action.type === STAGE_DATA_RESOLVED) {
    return {
      data: {
        ...state.data,
        [action.payload.stageName]: {
          ...(state.data ? state.data[action.payload.stageName] : {}),
          [action.payload.key]: action.payload.data
        }
      },
      loading: false,
      error: false
    }
  } else if (action.type === FAILED_RESOLVE_STAGE_DATA) {
    return {
      ...state,
      loading: false,
      error: true
    }
  } else if (action.type === CLEAR) {
    return initialState;
  }
  return state;
}
