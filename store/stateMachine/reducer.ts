import { AnyAction } from 'redux';
import { ReducerInitialState } from '../../interfaces/reducerInitailState';
import { StateMachineInterface } from '../../interfaces/stateMachine.interface';
import {
  CLEAR,
  GET_STATE_MACHINE_FAILURE,
  GET_STATE_MACHINE_REQUEST,
  GET_STATE_MACHINE_SUCCESS,
} from '../constants';

const initialState: ReducerInitialState<StateMachineInterface> = {
  loading: false,
  data: undefined,
  error: false,
};

export default function(
  state = initialState,
  action: AnyAction,
): ReducerInitialState {
  if (action.type === GET_STATE_MACHINE_REQUEST) {
    return {
      ...state,
      loading: true,
    };
  } else if (action.type === GET_STATE_MACHINE_SUCCESS) {
    return {
      ...state,
      loading: false,
      data: action.payload?.data,
    };
  } else if (action.type === GET_STATE_MACHINE_FAILURE) {
    return {
      ...state,
      loading: false,
      error: true,
    };
  } else if (action.type === CLEAR) {
    return initialState;
  }
  return state;
}
