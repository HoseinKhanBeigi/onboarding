import router from 'next/router';
import { RequestInstance } from '../store/request';
import { configurableRequest } from './configurableRequest';
import { showErrorNotification } from '../store/globalAction';
import ErrorUtils from './errorUtils';

// eslint-disable-next-line @typescript-eslint/class-name-casing
interface useConfigurableRequestInterface {
  applicationInfo: any;
  requestConfig: any;
  ids?: any;
  setLoading?: any;
  name?: any;
  setState?: any;
}

export function abstractConfigurableRequest({
  applicationInfo,
  requestConfig,
  ids,
  setLoading,
  name,
  setState,
}: useConfigurableRequestInterface) {
  setLoading(true);
  configurableRequest<Record<string, any>>(
    RequestInstance,
    requestConfig?.[name],
    router,
    {
      ...ids,
      ...applicationInfo,
    },
  )
    .then(response => {
      setLoading(false);
      setState(response.data);
    })
    .catch(exception => {
      if (
        exception.response.data.exceptionMessage === 'FILL_THE_FORM_PROPERLY'
      ) {
        return;
      } else {
        showErrorNotification(
          ErrorUtils.getErrorMessage('THIRD_PARTY_GATEWAY_TIMEOUT'),
        );
      }
    })
    .finally(() => {
      setLoading(false);
    });
}
