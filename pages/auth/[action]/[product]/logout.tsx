import React, {useContext, useEffect} from 'react';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../../../store/auth/action';
import {RootState} from '../../../../store/rootReducer';
import {ObjectUtils} from '../../../../lib/ObjectUtils';
import {getBranding} from '../../../../store/branding/action';
import {TenantConfigContext} from '../../../../components/TenantConfig/TenantConfig';
import {wrappedLocalStorage} from "../../../../lib/hybridStorage";
import {ID_TOKEN, PRODUCT_STATE} from "../../../../store/constants";

export function Logout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { product, action } = router.query;
  const isAuthenticated = useSelector<RootState>(
    state => state.auth?.data?.isAuthenticated,
  );
  const tenantConfig = useContext(TenantConfigContext);
  useEffect(() => {
    if (isAuthenticated && tenantConfig.resolved) {
      (async () => {
        wrappedLocalStorage.setItem(PRODUCT_STATE, JSON.stringify({ action, product }));
        const idToken = wrappedLocalStorage.getItem(ID_TOKEN);
        await dispatch(logout());
        window.location.assign(
          `${tenantConfig.auth.baseUrl}/logout?post_logout_redirect_uri=${encodeURI(
            `${location.origin}/auth/callback`,
          )}&id_token_hint=${idToken}`,
        );
      })();
    }
  }, [isAuthenticated, tenantConfig]);

  if (typeof window !== 'undefined' && !isAuthenticated) {
    router.push(
      `/auth/[action]/[product]/login`,
      `/auth/${action}/${product}/login`,
    );
  }
  return '';
}

Logout.getInitialProps = async function({ store, query: { product } }) {
  const { branding } = store.getState();
  if (
    !branding.error &&
    !branding.loading &&
    !ObjectUtils.checkIfItsFilled(branding.data)
  ) {
    await getBranding(product)(store.dispatch);
  }
};

export default Logout;
