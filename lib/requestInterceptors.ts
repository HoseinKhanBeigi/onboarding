import * as Sentry from '@sentry/browser';
import {REFRESH_TOKEN, TOKEN} from '../store/constants';
import {wrappedLocalStorage} from './hybridStorage';
import {StringUtils} from './StringUtils';
import {ObjectUtils} from './ObjectUtils';
import {ErrorUtils} from './errorUtils';
import {ServiceError} from '../components/ServiceError';
import {getTenantConfig} from '../components/TenantConfig/TenantConfig';

export const requestContentType = request => {
  if (['get', 'options'].includes(request.method?.toLowerCase() as string)) {
    request.headers = {
      ...request.headers,
      'Content-Type': 'text/plain',
    };
  } else {
    request.headers = {
      ...request.headers,
      'Content-Type': 'application/json',
    };
  }
  return request;
};

export const requestHeaderTransformer = request => {
  const {noAuth, ...headers} = request.headers;
  if (noAuth) {
    request.headers = headers;
  } else if (!('Authorization' in request.headers)) {
    const accessToken = wrappedLocalStorage.getItem(TOKEN);
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
  if (
    !('Application-Name' in request.headers) &&
    !('application-name' in request.headers)
  ) {
    // TODO: fix this part
    const product = window?.location.href.split('/')[4];
    if (StringUtils.isItFilled(product)) {
      request.headers = {
        ...request.headers,
        'Application-Name': (product as string).toUpperCase(),
      };
    }
  }
  return request;
};

export async function refreshToken(failedRequest) {
  const orgCode =
    getTenantConfig('orgCode') ||
    failedRequest.response.config.headers['Application-Name'] ||
    failedRequest.response.config.headers['application-name'];
  const auth = getTenantConfig('auth');
  const token = wrappedLocalStorage.getItem(REFRESH_TOKEN);
  if (!StringUtils.isItFilled(token)) {
    throw new Error('refreshToken is undefined');
  } else {
    const response = await fetch(`${auth.baseUrl}/token`, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: auth.clientId,
        product: orgCode,
        refresh_token: token as string,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const data = await response.json();
    if (ObjectUtils.checkIfItsFilled(data.error)) {
      throw new Error('refreshToken has been expired');
    } else {
      return data;
    }
  }
}

function b64ToString(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

export function getTokenPayload() {
  const token = wrappedLocalStorage.getItem(TOKEN);
  if (StringUtils.isItFilled(token)) {
    const tokenPayloadString = token?.split('.')[1];
    return JSON.parse(b64ToString(tokenPayloadString));
  }
}

export function sentryReport(error: any) {
  if (typeof window !== 'undefined' && error?.response?.data?.status !== 401) {
    Sentry.captureException(
      new ServiceError(
        error?.response?.data?.exceptionMessage,
        ErrorUtils.getErrorMessage(
          error?.response?.data?.exceptionMessage ||
          error?.response?.data?.status,
        ),
        error?.response?.data?.status,
      ),
      {
        extra: {
          response: error?.response?.data,
          request: error?.response?.config,
        },
      },
    );
  }
  return Promise.reject(error);
}
