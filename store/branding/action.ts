import {ConfigRequestInstance} from '../request';
import {Dispatcher} from '../../interfaces/dispatcher';
import {BRANDING_FAILURE, BRANDING_REQUEST, GET_BRANDING_SUCCESS,} from '../constants';
import {BrandingInterface} from '../../interfaces/branding.interface';
import {getBrandingPath} from './service';

export function getBranding(
  name: string,
): Dispatcher<BrandingInterface | undefined> {
  return async dispatch => {
    try {
      await dispatch({ type: BRANDING_REQUEST });

      const response = await ConfigRequestInstance.get<BrandingInterface>(
        getBrandingPath(name),
        {
          headers: {
            'Application-Name': name,
          },
        },
      );

      const { data } = response;
      dispatch({
        type: GET_BRANDING_SUCCESS,
        payload: { data },
      });

      return data;
    } catch (error) {
      dispatch({
        type: BRANDING_FAILURE,
      });

      return undefined;
    }
  };
}

export default getBranding;
