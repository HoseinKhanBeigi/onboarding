import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { NextRouter } from 'next/router';
import { DataSourceInterface } from '../interfaces/entity.interface';
import DataInjector from './DataInjector';
import { ObjectUtils } from './ObjectUtils';
import { BaseObjectError } from './objectError';

export async function configurableRequest<T extends any>(
  requestInstance: AxiosInstance,
  { method, url, header, body }: DataSourceInterface,
  router: NextRouter,
  data: Record<string, any>,
  config?: Record<string, any>,
) {
  const injectedUrl = injectIntoString(url, router, data);
  if (injectedUrl) {
    const injectedHeaders = injectDataIntoObject(header, router, data);
    const injectedBody = injectDataIntoObject(body, router, data);
    const options: AxiosRequestConfig = {
      method,
      headers: injectedHeaders,
      data: injectedBody,
      url: injectedUrl,
      ...config,
    };
    const response = await requestInstance(options);
    if (response.headers.captchacode) {
      return {
        res: response.data,
        captchacode: response.headers.captchacode,
      };
    } else {
      return response.data;
    }
  } else {
    throw new BaseObjectError(
      'FILL_THE_FORM_PROPERLY',
      `couldn't inject data into url, check the url: ${url}`,
    );
  }
}

export function injectDataIntoObject(baseObject, routerParams, data) {
  let injectedObject = {};
  if (typeof baseObject === 'string') {
    const injectedData = injectIntoString(baseObject, routerParams, data);
    if (ObjectUtils.checkIfItsFilled(injectedData)) {
      injectedObject = injectedData;
    } else {
      throw new BaseObjectError(
        'FILL_THE_FORM_PROPERLY',
        `couldn't inject data, check the object: ${baseObject}`,
      );
    }
  } else {
    for (const item in baseObject) {
      if (baseObject.hasOwnProperty(item)) {
        const injectedItem = injectIntoString(
          baseObject[item],
          routerParams,
          data,
        );
        injectedObject = ObjectUtils.insertDataIntoObjectByStringPath(
          injectedObject,
          item,
          injectedItem || null,
        );
      }
    }
  }
  return injectedObject;
}

export function injectIntoString(
  value: string | undefined,
  router: NextRouter,
  data: Record<string, any>,
): any {
  if (ObjectUtils.checkIfItsFilled(value) && typeof value === 'string') {
    const injectedValue = DataInjector.dataInjector(value, router, data);
    if (injectedValue.successful) {
      return injectedValue.value as any;
    }
  } else if (ObjectUtils.checkIfItsFilled(value) && typeof value !== 'string') {
    return value;
  }
  return value;
}
