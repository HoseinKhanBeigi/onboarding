import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { StringUtils } from '../lib/StringUtils';
import { wrappedLocalStorage } from '../lib/hybridStorage';
import { REDIRECT_URL } from '../store/constants';

function useClientRedirectUrl(product, defaultUrl): string {
  const router = useRouter();
  return useMemo(() => {
    const key = `${product}-${REDIRECT_URL}`;
    if (StringUtils.isItFilled(router.query.redirect)) {
      const redirect = router.query.redirect as string;
      wrappedLocalStorage.setItem(key, redirect);
      return redirect;
    } else if (StringUtils.isItFilled(wrappedLocalStorage.getItem(key))) {
      return wrappedLocalStorage.getItem(key) as string;
    }
    return defaultUrl;
  }, [router.query, defaultUrl]);
}

export { useClientRedirectUrl };
