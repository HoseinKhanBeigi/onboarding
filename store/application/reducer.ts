import { AnyAction } from 'redux';
import {
  APPLICATION_FAILURE,
  APPLICATION_REQUEST,
  CLEAR,
  GET_APPLICATION_BY_ID_SUCCESS,
  GET_APPLICATIONS_SUCCESS,
  REMOVE_APPLICATION_SUCCESS,
  SET_APPLICATION_REFERRAL_SUCCESS,
  START_APPLICATION_SUCCESS,
  UPDATE_APPLICATION_BY_ID_SUCCESS,
} from '../constants';
import { ReducerInitialState } from '../../interfaces/reducerInitailState';
import { ApplicationInterface } from '../../interfaces/application.interface';

const initialState: ReducerInitialState<ApplicationInterface> = {
  loading: false,
  data: undefined,
  error: false,
};

export default function(
  state = initialState,
  action: AnyAction,
): ReducerInitialState {
  if (action.type === APPLICATION_REQUEST) {
    return {
      ...state,
      loading: true,
      error: false,
    };
  } else if (action.type === GET_APPLICATIONS_SUCCESS) {
    return {
      ...state,
      data: {
        ...state.data,
        applications: action.payload?.data?.list,
        needActivation: action.payload?.data?.needActivation,
      },
      loading: false,
      error: false,
    };
  } else if (
    [
      START_APPLICATION_SUCCESS,
      GET_APPLICATION_BY_ID_SUCCESS,
      UPDATE_APPLICATION_BY_ID_SUCCESS,
    ].includes(action.type)
  ) {
    return {
      ...state,
      data: {
        ...state.data,
        application: action.payload?.data,
      },
      loading: false,
      error: false,
    };
  } else if (action.type === REMOVE_APPLICATION_SUCCESS) {
    return {
      ...state,
      data: {
        applications: state.data?.applications,
      },
      error: false,
      loading: false,
    };
  } else if (action.type === SET_APPLICATION_REFERRAL_SUCCESS) {
    return {
      ...state,
      error: false,
      loading: false,
    };
  } else if (action.type === APPLICATION_FAILURE) {
    return {
      ...state,
      error: true,
      loading: false,
      errorCode: action.payload?.errorCode,
      errorMessage: action.payload?.errorMessage,
    };
  } else if (action.type === CLEAR) {
    return initialState;
  }
  return state;
}
