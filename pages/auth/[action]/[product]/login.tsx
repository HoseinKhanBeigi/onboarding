import crypto from 'crypto-browserify';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {useContext, useEffect} from 'react';
import {RootState} from '../../../../store/rootReducer';
import {clear} from '../../../../store/globalAction';
import {ObjectUtils} from '../../../../lib/ObjectUtils';
import {getBranding} from '../../../../store/branding/action';
import {StringUtils} from '../../../../lib/StringUtils';
import {TenantConfigContext} from '../../../../components/TenantConfig/TenantConfig';
import {PRODUCT_STATE} from "../../../../store/constants";

declare const location: Location;

function base64URLEncode(str) {
  return str
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(buffer) {
  return crypto
    .createHash('sha256')
    .update(buffer)
    .digest();
}

function issueVerifierAndRedirectToOAuth(
  orgCode: string,
  action: string,
  product: string,
  authConfig: Record<string, string>,
) {
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const challenge = base64URLEncode(sha256(verifier));
  localStorage.setItem('verifier', verifier);
  localStorage.setItem(PRODUCT_STATE, JSON.stringify({ action, product }));
  document.location.href = `${authConfig.baseUrl}/auth?client_id=${authConfig.clientId}&product=${orgCode}&redirect_uri=${location.origin}/auth/callback&scope=openid&response_type=code&code_challenge_method=S256&code_challenge=${challenge}`;
}

export function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { product, action } = router.query;
  const isAuthenticated = useSelector<RootState>(
    state => state.auth?.data?.isAuthenticated,
  );
  const error = useSelector<RootState>(state => state.auth?.error);
  const tenantConfig = useContext(TenantConfigContext);

  useEffect(() => {
    if (tenantConfig.resolved) {
      if (
        !isAuthenticated &&
        !error &&
        StringUtils.isItFilled(tenantConfig.orgCode)
      ) {
        issueVerifierAndRedirectToOAuth(
          tenantConfig.orgCode as string,
          action as string,
          product as string,
          tenantConfig.auth,
        );
      } else if (!error) {
        cleanTheStore().then(() => {
          router.push(`/${action}/[product]`, `/${action}/${product}`);
        });
      }
    }
  }, [isAuthenticated, product, error, tenantConfig]);

  async function cleanTheStore() {
    dispatch(clear());
  }

  return '';
}

Login.getInitialProps = async function({ store, query: { product } }) {
  const { branding } = store.getState();
  if (
    !branding.error &&
    !branding.loading &&
    !ObjectUtils.checkIfItsFilled(branding.data)
  ) {
    await getBranding(product)(store.dispatch);
  }
};

export default Login;
