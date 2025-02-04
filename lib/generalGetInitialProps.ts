import {ObjectUtils} from './ObjectUtils';
import {getBranding} from '../store/branding/action';
import {getCommon} from '../store/common/action';
import {CustomNextPageContext} from '../pages/_app';

export async function generalGetInitialProps({
  store,
  query: { product },
  asPath,
}: CustomNextPageContext) {
  const { branding, common } = store.getState();
  let brandingData = branding.data;
  let commonData = common.data;
  try {
    if (
      !branding.error &&
      !branding.loading &&
      !ObjectUtils.checkIfItsFilled(branding.data)
    ) {
      brandingData = await getBranding(product as string)(store.dispatch);
    }
    if (
      !common.error &&
      !common.loading &&
      !ObjectUtils.checkIfItsFilled(common.data)
    ) {
      commonData = await getCommon()(store.dispatch);
    }
  } catch (e) {
    console.error(`${new Date().toISOString()} ERROR: ${asPath}`);
    console.error(e);
  }
  return {
    branding: brandingData,
    common: commonData,
  };
}
