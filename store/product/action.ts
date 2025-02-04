import {ConfigRequestInstance} from '../request';
import {Dispatcher} from '../../interfaces/dispatcher';
import {ProductInterface} from '../../interfaces/product.interface';
import {getProductPath} from './service';
import {GET_PRODUCT_FAILURE, GET_PRODUCT_REQUEST, GET_PRODUCT_SUCCESS,} from '../constants';

export function getProduct(
  orgCode: string,
  product: string,
  type: string,
  relation: string,
  name?:string
): Dispatcher<ProductInterface | undefined> {
  return async dispatch => {
    try {
      await dispatch({ type: GET_PRODUCT_REQUEST });

      const response = await ConfigRequestInstance.get<ProductInterface>(
        getProductPath(orgCode, product, type, relation, name),
      );

      dispatch({
        type: GET_PRODUCT_SUCCESS,
        payload: { data: response.data },
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: GET_PRODUCT_FAILURE,
      });

      return undefined;
    }
  };
}

export function updateProduct(
  product: ProductInterface,
): Dispatcher<ProductInterface> {
  return async dispatch => {
    dispatch({
      type: GET_PRODUCT_SUCCESS,
      payload: { data: product },
    });
    return product;
  };
}

export default getProduct;
