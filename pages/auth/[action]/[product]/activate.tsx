import {useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import {useContext, useEffect} from 'react';
import {RootState} from '../../../../store/rootReducer';
import {getBranding} from '../../../../store/branding/action';
import {StringUtils} from '../../../../lib/StringUtils';
import {ObjectUtils} from '../../../../lib/ObjectUtils';
import {TenantConfigContext} from '../../../../components/TenantConfig/TenantConfig';
import {PRODUCT_STATE} from "../../../../store/constants";

declare const location: Location;

function redirectToActivation(
  orgCode: string,
  action: string,
  product: string,
  authConfig: Record<string, string>,
) {
  localStorage.setItem(PRODUCT_STATE, JSON.stringify({ action, product }));
  // TO-KNOW: it's not possible to use the shorlink of neshan activation account because of using two different neshan nodes in production
  document.location.href = `${authConfig.baseUrl}/auth?response_type=code&client_id=neshan-activation&product=${orgCode}&redirect_uri=${location.origin}/auth/activate`;
}
export function Activate() {
  const router = useRouter();
  const { product, action } = router.query;
  const needActivation = useSelector<RootState>(
    state => state.application?.data?.needActivation,
  );
  const tenantConfig = useContext(TenantConfigContext);
  const { orgCode } = tenantConfig;

  useEffect(() => {
    if (StringUtils.isItFilled(orgCode) && needActivation) {
      redirectToActivation(
        orgCode,
        action as string,
        product as string,
        tenantConfig.auth,
      );
    }
  }, [product]);

  return '';
}

Activate.getInitialProps = async function({ store, query: { product } }) {
  const { branding } = store.getState();
  if (
    !branding.error &&
    !branding.loading &&
    !ObjectUtils.checkIfItsFilled(branding.data)
  ) {
    await getBranding(product)(store.dispatch);
  }
};

export default Activate;
