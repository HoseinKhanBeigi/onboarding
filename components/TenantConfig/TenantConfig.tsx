import React, {useEffect, useReducer} from 'react';
import {useSelector} from 'react-redux';
import {saveKeys, TenantConfigReducer} from './TenantConfigReducer';
import {RootState} from '../../store/rootReducer';
import {changeBaseUrls} from '../../lib/requestUtils';

export const TenantConfigContext = React.createContext<Record<string, any>>({
  resolved: false,
});

let Config = {};

export function getTenantConfig(key) {
  if (Config && key in Config) {
    return Config[key];
  } else {
    return null;
  }
}

export function TenantConfigProvider({ children, config }) {
  const [state, dispatch] = useReducer(TenantConfigReducer, config);

  const brandingData = useSelector(({ branding }: RootState) => branding.data);

  useEffect(() => {
    Config = state;
  }, [state]);

  useEffect(() => {
    if (brandingData) {
      let payload: Record<string, any> = {
        resolved: true,
        orgCode: brandingData.orgCode,
        productGroup: brandingData.productGroup,
      };
      if (brandingData.baseUrl) {
        changeBaseUrls(brandingData.baseUrl);
        payload = {
          ...payload,
          ...brandingData.baseUrl,
        };
      }
      if (brandingData.auth) {
        payload.auth = brandingData.auth;
      }
      if (brandingData.actions) {
        payload.actions = brandingData.actions;
      }
      changeBaseUrls({ ...state, ...payload });
      dispatch(saveKeys(payload));
    }
  }, [brandingData]);

  return (
    <TenantConfigContext.Provider value={state}>
      {children}
    </TenantConfigContext.Provider>
  );
}
