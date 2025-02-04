import { AnyAction } from 'redux';
import {
  CARD_CREATED,
  CARD_FAILURE,
  CARD_FETCHED,
  CARD_REQUEST,
  CLEAR,
} from '../constants';
import { ReducerInitialState } from '../../interfaces/reducerInitailState';
import { EndUserWorkflowDto } from '../../interfaces/card.interface';

const initialState: ReducerInitialState<EndUserWorkflowDto> = {
  loading: false,
  data: undefined,
  error: false,
};

export default function(
  state = initialState,
  action: AnyAction,
): ReducerInitialState {
  if (action.type === CARD_REQUEST) {
    return {
      ...state,
      loading: true,
    };
  } else if ([CARD_FETCHED, CARD_CREATED].includes(action.type)) {
    return {
      ...state,
      loading: false,
      data: action.payload,
    };
  } else if (action.type === CARD_FAILURE) {
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
