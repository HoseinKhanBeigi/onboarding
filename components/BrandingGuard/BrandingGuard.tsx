import React, {useContext, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import {RootState} from '../../store/rootReducer';
import {TenantConfigContext} from '../TenantConfig/TenantConfig';
import {ObjectUtils} from '../../lib/ObjectUtils';
import {getBranding} from '../../store/branding/action';
import {StringUtils} from '../../lib/StringUtils';

export default function BrandingGuard({children}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const tenantConfig = useContext(TenantConfigContext);
  const [loading, error, data] = useSelector(({branding}: RootState) => [
    branding.loading,
    branding.error,
    branding.data,
  ]);

  const {product} = router.query;
  const isServer = typeof window === 'undefined';
  const productNotfound =
    !isServer && (error || router.pathname.split('/')[2] === 'undefined');

  useEffect(() => {
    if (
      !tenantConfig.resolved &&
      (error || !StringUtils.isItFilled(data?.orgCode) || productNotfound) &&
      !isServer
    ) {
      router.push(
        '/onboarding/[product]/not-found',
        `/onboarding/${product}/not-found`,
      );
    }
  }, [error, data?.orgCode, productNotfound, isServer, product]);

  useEffect(() => {
    if (!loading && !error && !ObjectUtils.checkIfItsFilled(data)) {
      dispatch(getBranding(product as string));
    }
  }, [loading, error, data]);

  if (tenantConfig.resolved) {
    return (
      <>
        {children}
      </>
    );
  } else {
    return <p>لطفا صبر کنید ...</p>;
  }
}
