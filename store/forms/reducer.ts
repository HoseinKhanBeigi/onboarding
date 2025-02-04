import { AnyAction } from 'redux';
import {
  CLEAR,
  FORM_FETCHED,
  FORMS_FAILURE,
  FORMS_REQUEST,
} from '../constants';
import { ReducerInitialState } from '../../interfaces/reducerInitailState';
import { FormInterface } from '../../interfaces/startForm.interface';

const initialState: ReducerInitialState<Record<string, FormInterface>> = {
  loading: false,
  data: undefined,
  error: false,
};

export default function(
  state = initialState,
  action: AnyAction,
): ReducerInitialState {
  if (action.type === FORMS_REQUEST) {
    return {
      ...state,
      loading: true,
      error: false,
      failedId: undefined,
    };
  } else if (action.type === FORM_FETCHED) {
    const map = state.data || {};
    const form = action.payload.data;
    map[action.payload.id] = form;
    return {
      ...state,
      data: map,
      loading: false,
      error: false,
      failedId: undefined,
    };
  } else if (action.type === FORMS_FAILURE) {
    return {
      ...state,
      loading: false,
      error: true,
      failedId: action.payload.id,
    };
  } else if (action.type === CLEAR) {
    return initialState;
  }
  return state;
}
