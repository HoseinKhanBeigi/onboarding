import {useSelector} from 'react-redux';
import {useContext, useEffect} from 'react';
import {useRouter} from 'next/router';
import {RootState} from '../../store/rootReducer';
import {useSetSentryUser} from '../Sentry/useSetSentryUser';
import {TenantConfigContext} from '../TenantConfig/TenantConfig';

function useAuthGuard(action: 'flow' | 'onboarding', productId: string) {
  const router = useRouter();
  const isAuthenticated = useSelector(
    ({ auth }: RootState) => auth?.data?.isAuthenticated,
  );

  const tenantConfig = useContext(TenantConfigContext);

  useSetSentryUser();
  useEffect(() => {
    if (!isAuthenticated && tenantConfig.resolved) {
      router.push(
        '/auth/[action]/[product]/login',
        `/auth/${action}/${productId}/login`,
      );
    }
  }, [isAuthenticated]);
}

export default useAuthGuard;
