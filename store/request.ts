import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import getConfig from 'next/config';
import {refreshToken, requestContentType, requestHeaderTransformer, sentryReport,} from '../lib/requestInterceptors';
import {wrappedLocalStorage} from "../lib/hybridStorage";
import {REFRESH_TOKEN, TOKEN} from "./constants";
import {StringUtils} from "../lib/StringUtils";
import Router from "next/router";

const {
  publicRuntimeConfig: { configBaseUrl },
} = getConfig();

export const refreshAuthLogic = failedRequest =>
  refreshToken(failedRequest)
    .then(tokenRefreshResponse => {
      wrappedLocalStorage.setItem(TOKEN, tokenRefreshResponse.access_token);
      wrappedLocalStorage.setItem(
        REFRESH_TOKEN,
        tokenRefreshResponse.refresh_token,
      );
      failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.access_token}`;
      return Promise.resolve();
    })
    .catch(() => {
      if (typeof window !== 'undefined') {
        const product = window?.location.href.split('/')[4]?.split('?')[0];
        const action = window?.location.href.split('/')[3];
        if (StringUtils.isItFilled(product) && action !== 'auth') {
          Router.push(
            '/auth/[action]/[product]/logout',
            `/auth/${action}/${product}/logout`,
          );
        }
      }
    });

const RequestInstance = axios.create();
createAuthRefreshInterceptor(RequestInstance, refreshAuthLogic, {
  pauseInstanceWhileRefreshing: true,
});
RequestInstance.interceptors.request.use(requestHeaderTransformer, e =>
  Promise.reject(e),
);
RequestInstance.interceptors.request.use(requestContentType, e =>
  Promise.reject(e),
);
RequestInstance.interceptors.response.use(res => res, sentryReport);

const ConfigRequestInstance = axios.create({ baseURL: configBaseUrl });
createAuthRefreshInterceptor(ConfigRequestInstance, refreshAuthLogic, {
  pauseInstanceWhileRefreshing: true,
});
ConfigRequestInstance.interceptors.request.use(requestHeaderTransformer, e =>
  Promise.reject(e),
);
ConfigRequestInstance.interceptors.request.use(requestContentType, e =>
  Promise.reject(e),
);
ConfigRequestInstance.interceptors.response.use(res => res, sentryReport);

const FlowRequestInstance = axios.create();

createAuthRefreshInterceptor(FlowRequestInstance, refreshAuthLogic, {
  pauseInstanceWhileRefreshing: true,
});

FlowRequestInstance.interceptors.request.use(requestHeaderTransformer, e =>
  Promise.reject(e),
);
FlowRequestInstance.interceptors.request.use(requestContentType, e =>
  Promise.reject(e),
);

const FileRequestInstance = axios.create();
createAuthRefreshInterceptor(FileRequestInstance, refreshAuthLogic, {
  pauseInstanceWhileRefreshing: true,
});
FileRequestInstance.interceptors.request.use(requestHeaderTransformer, e =>
  Promise.reject(e),
);
export {
  RequestInstance,
  ConfigRequestInstance,
  FileRequestInstance,
  FlowRequestInstance,
};
