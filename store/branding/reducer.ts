import { AnyAction } from 'redux';
import {
  BRANDING_FAILURE,
  BRANDING_REQUEST,
  CLEAR,
  GET_BRANDING_SUCCESS,
} from '../constants';
import { ReducerInitialState } from '../../interfaces/reducerInitailState';
import { BrandingInterface } from '../../interfaces/branding.interface';

const initialState: ReducerInitialState<BrandingInterface> = {
  loading: false,
  data: undefined,
  error: false,
};

export default function(
  state = initialState,
  action: AnyAction,
): ReducerInitialState {
  if (action.type === BRANDING_REQUEST) {
    return {
      ...state,
      loading: true,
    };
  } else if (action.type === GET_BRANDING_SUCCESS) {
    return {
      ...state,
      loading: false,
      data: action.payload?.data,
    };
  } else if (action.type === BRANDING_FAILURE) {
    return {
      ...state,
      loading: false,
      error: true,
    };
  }
  return state;
}
