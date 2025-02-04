import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {verify} from '../../store/auth/action';
import {StringUtils} from '../../lib/StringUtils';
import {RootState} from '../../store/rootReducer';
import {ObjectUtils} from "../../lib/ObjectUtils";
import {getBranding} from "../../store/branding/action";
import {PRODUCT_STATE} from "../../store/constants";

export function Callback() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { code, session_state: sessionState } = router.query;
  const errorInVerify = useSelector<RootState>(state => state.auth?.error);
  const isAuthenticated = useSelector<RootState>(
    state => state.auth?.data?.isAuthenticated,
  );
  const [branding, brandingLoading, brandingError] = useSelector((state: RootState) => [
    state.branding.data,
    state.branding.loading,
    state.branding.error
  ]);

  const productState = useMemo(() => {
    try {
      const productStateString = localStorage.getItem(PRODUCT_STATE);
      return JSON.parse(productStateString as string);
    } catch {
      return null;
    }
  }, []);

  const orgCode = useMemo(() => {
    if (productState?.action === 'onboarding' && branding) {
      return branding.orgCode;
    } else if (productState?.action !== 'onboarding' || brandingError) {
      return 'KIAN_DIGITAL';
    } else {
      return null;
    }
  }, [branding, productState]);

  useEffect(() => {
    if (
      !brandingError &&
      !brandingLoading &&
      !ObjectUtils.checkIfItsFilled(branding)
    ) {
      dispatch(getBranding(productState?.product));
    }
  }, [brandingError, brandingLoading, branding, productState]);

  useEffect(() => {
    if (isAuthenticated) {
      try {
        router.push(
          `/${productState?.action}/[product]`,
          `/${productState?.action}/${productState?.product}`,
        );
      } catch {
        router.push('/');
      }
    }
  }, [isAuthenticated, router.pathname]);

  useEffect(() => {
    if (
      StringUtils.isItFilled(code) &&
      !errorInVerify &&
      StringUtils.isItFilled(orgCode)
    ) {
      dispatch(verify(code, orgCode));
    }
  }, [code, orgCode]);

  const showError = useMemo(
    () => (!StringUtils.isItFilled(code) && StringUtils.isItFilled(sessionState)) || errorInVerify,
    [code, sessionState, errorInVerify],
  );

  useEffect(() => {
    if ((!StringUtils.isItFilled(code) && !StringUtils.isItFilled(sessionState)) && !isAuthenticated) {
      if (StringUtils.isItFilled(productState.action) && StringUtils.isItFilled(productState.product)) {
        router.push(
          '/onboarding/[product]',
          `/onboarding/${productState.product}`,
        );
      }
    }
  }, [code, sessionState, isAuthenticated, productState]);

  if (showError) {
    return (
      <>
        <p>مشکلی پیش آمده است. لطفا برای تلاش دوباره روی لینک زیر کلیک کنید.</p>
        <Link
          as={`/auth/${productState?.action}/${productState?.product}/login`}
          href={`/auth/${productState?.action}/${productState?.product}/login`}
        >
          تلاش دوباره
        </Link>
      </>
    );
  } else {
    return (
      <>
        <p>لطفا صبر کنید ...</p>
      </>
    );
  }
}

export default Callback;
