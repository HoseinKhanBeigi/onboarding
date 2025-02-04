import {AnyAction} from 'redux';
import {ReducerInitialState} from '../../interfaces/reducerInitailState';
import {CLEAR, FAILED_SAVE_STAGE, REQUEST_SAVE_STAGE, STAGE_SAVED} from '../constants';

const initialState: ReducerInitialState<Record<string, any>> = {
  loading: false,
  data: undefined,
  error: false,
};

export default function (
  state = initialState,
  action: AnyAction,
): ReducerInitialState {
  if (action.type === REQUEST_SAVE_STAGE) {
    return {
      ...state,
      loading: true,
      error: false
    }
  } else if (action.type === STAGE_SAVED) {
    return {
      data: {
        ...state.data,
        [ action.payload.stageName ]: action.payload.data
      },
      loading: false,
      error: false
    }
  } else if (action.type === FAILED_SAVE_STAGE) {
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
