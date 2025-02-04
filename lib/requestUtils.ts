import {StringUtils} from './StringUtils';
import {ObjectUtils} from './ObjectUtils';
import {ConfigRequestInstance, FileRequestInstance, FlowRequestInstance, RequestInstance,} from '../store/request';

export function changeBaseUrls(baseUrlMap: Record<string, any>) {
  if (ObjectUtils.checkIfItsFilled(baseUrlMap)) {
    if (StringUtils.isItFilled(baseUrlMap?.server)) {
      RequestInstance.defaults.baseURL = baseUrlMap?.server;
    }
    if (StringUtils.isItFilled(baseUrlMap?.config)) {
      ConfigRequestInstance.defaults.baseURL = baseUrlMap?.config;
    }
    if (StringUtils.isItFilled(baseUrlMap?.file)) {
      FileRequestInstance.defaults.baseURL = baseUrlMap?.file;
    }
    if (StringUtils.isItFilled(baseUrlMap?.flow)) {
      FlowRequestInstance.defaults.baseURL = baseUrlMap?.flow;
    }
  }
}
