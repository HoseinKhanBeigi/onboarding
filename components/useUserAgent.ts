import { useMemo } from 'react';
import { ObjectUtils } from '../lib/ObjectUtils';

declare const navigator: Navigator;
const isServer = typeof window === 'undefined';

export function useUserAgent() {
  return useMemo(() => {
    let userAgent = '';
    if (!isServer && ObjectUtils.checkIfItsFilled(navigator)) {
      userAgent = navigator.userAgent.toLowerCase();
    }
    const browserType = {
      isSafari: false,
      isChrome: false,
      isFirefox: false,
      isIE: false,
      isEdge: false,
      isOther: false,
      isAndroid: false,
      isIOS: false,
    };

    if (userAgent.match(/safari/i)) {
      browserType.isSafari = true;
    } else if (userAgent.match(/chrome|chromium|crios/i)) {
      browserType.isChrome = true;
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserType.isFirefox = true;
    } else if (userAgent.match(/opr\//i)) {
      browserType.isOther = true;
    } else if (userAgent.match(/edg/i)) {
      browserType.isOther = true;
    } else if (userAgent.match(/msie/i)) {
      browserType.isIE = true;
    }
    if (userAgent.match(/android/i)) {
      browserType.isAndroid = true;
    } else if (userAgent.match(/iphone/i)) {
      browserType.isIOS = true;
    }
    return { userAgent, browserType };
  }, []);
}
