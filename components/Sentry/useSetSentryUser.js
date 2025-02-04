import { useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import { getTokenPayload } from '../../lib/requestInterceptors';
import { ObjectUtils } from '../../lib/ObjectUtils';

export function useSetSentryUser() {
  useEffect(() => {
    const tokenPayload = getTokenPayload();
    if (ObjectUtils.checkIfItsFilled(tokenPayload)) {
      Sentry.setUser({
        username: tokenPayload?.user_name,
        id: tokenPayload?.uuid,
      });
    }
  }, []);
}
