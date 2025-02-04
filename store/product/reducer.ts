import {AnyAction} from 'redux';
import {CLEAR, GET_PRODUCT_FAILURE, GET_PRODUCT_REQUEST, GET_PRODUCT_SUCCESS,} from '../constants';
import {ReducerInitialState} from '../../interfaces/reducerInitailState';
import {ProductInterface} from '../../interfaces/product.interface';

const initialState: ReducerInitialState<ProductInterface> = {
  loading: false,
  data: undefined,
  error: false,
};

export default function(
  state = initialState,
  action: AnyAction,
): ReducerInitialState {
  if (action.type === GET_PRODUCT_REQUEST) {
    return {
      ...state,
      loading: true,
    };
  } else if (action.type === GET_PRODUCT_SUCCESS) {
    return {
      ...state,
      loading: false,
      data: action.payload?.data,
    };
  } else if (action.type === GET_PRODUCT_FAILURE) {
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
