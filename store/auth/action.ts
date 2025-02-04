import axios from 'axios';
import getConfig from 'next/config';
import * as querystring from 'querystring';
import {wrappedLocalStorage} from '../../lib/hybridStorage';
import {
  AUTH_FAILED_VERIFY,
  AUTH_START_VERIFY,
  AUTH_SUCCESS_VERIFY,
  ID_TOKEN,
  LOGOUT,
  REFRESH_TOKEN,
  TOKEN
} from '../constants';
import {AccessTokenInterface} from '../../interfaces/auth';
import {StringUtils} from '../../lib/StringUtils';
import {clear} from '../globalAction';

const {
  publicRuntimeConfig: { auth },
} = getConfig();

declare const location: Location;

export const verify = (code, orgCode) => async (dispatch, getState) => {
  try {
    dispatch({ type: AUTH_START_VERIFY });

    const verifier = localStorage.getItem('verifier');
    if (!StringUtils.isItFilled(verifier)) {
      throw new Error('verifier is null');
    }

    const branding = getState().branding?.data;

    let authConfig = auth;
    if (branding && branding?.auth) {
      authConfig = branding?.auth;
    }
    const response = await axios.post<AccessTokenInterface>(
      `${authConfig.baseUrl}/token`,
      querystring.stringify({
        grant_type: 'authorization_code',
        client_id: authConfig.clientId,
        redirect_uri: `${location.origin}/auth/callback`,
        code_verifier: verifier,
        product: orgCode,
        code,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    wrappedLocalStorage.setItem(TOKEN, response.data.access_token);
    wrappedLocalStorage.setItem(REFRESH_TOKEN, response.data.refresh_token);
    wrappedLocalStorage.setItem(ID_TOKEN, response.data.id_token);
    dispatch({ type: AUTH_SUCCESS_VERIFY });
    return Promise.resolve();
  } catch (error) {
    dispatch({ type: AUTH_FAILED_VERIFY });
    return Promise.reject(error);
  }
};

export const logout = () => async dispatch => {
  wrappedLocalStorage.removeItem(TOKEN);
  wrappedLocalStorage.removeItem(REFRESH_TOKEN);
  wrappedLocalStorage.removeItem('verifier');
  wrappedLocalStorage.removeItem('goftino_YMW5bX_fpdata');
  wrappedLocalStorage.removeItem('ally-supports-cache');
  wrappedLocalStorage.removeItem('id_token');
  clear()(dispatch);
  dispatch({ type: LOGOUT });
};
