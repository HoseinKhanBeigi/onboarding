import {DataSourceInterface} from './entity.interface';

type ImageType = {
  url: string;
};

interface BackgroundImageInterface {
  desktop: ImageType;
  mobile: ImageType;
  tablet: ImageType;
}

interface BackgroundColorInterface {
  desktop: string;
  mobile: string;
  tablet: string;
}

interface SidebarThemeInterface {
  background: {
    image: BackgroundImageInterface;
    backgroundColor: BackgroundColorInterface;
    shadowColor: string;
  };
  description: {
    backgroundColor: string;
    color: string;
  };
}

interface FormThemeInterface {
  background: {
    image: BackgroundImageInterface;
    backgroundColor: BackgroundColorInterface;
  };
  button: {
    backgroundColor: string;
    border: string;
    disableBackgroundColor: string;
  };
  colors: {
    first: string;
    second: string;
    third: string;
    forth: string;
    fifth: string;
  };
}

export interface ProductThemeInterface {
  sidebar: SidebarThemeInterface;
  form: FormThemeInterface;
}

export interface SwitchItemInterface<T = string> {
  label: string;
  value: T;
  disabled: boolean;
  pattern?: string;
  disableDescription?: string;
}

export interface StartForItemInterface extends SwitchItemInterface {
  uniqIdLabel?: string;
  type?: 'BUSINESS' | 'INDIVIDUAL' | 'MERCHANT';
}

interface LinkItemInterface {
  label: string;
  href: string;
}

interface TypeErrorItemInterface {
  message: string;
  links: Array<LinkItemInterface>;
}

type BaseUrlType = 'file' | 'flow' | 'server';
export type BaseUrlMap = Record<BaseUrlType, any>;

interface AuthConfiguration {
  baseUrl: string;
  clientId: string;
}

export interface BrandingInterface {
  name: string;
  label: string;
  title: string;
  orgCode: string;
  productGroup?: string;
  description: string;
  portalAddress: string;
  baseUrl?: BaseUrlMap;
  auth?: AuthConfiguration;
  phone: string;
  logo: string;
  type?: 'BUSINESS' | 'INDIVIDUAL' | 'MERCHANT';
  theme?: ProductThemeInterface;
  showReferral?: boolean;
  startFor?: Array<StartForItemInterface>;
  actions?: {
    getApplications?: DataSourceInterface;
    getApplication?: DataSourceInterface;
    startApplication?: DataSourceInterface;
    submitApplicationReferral?: DataSourceInterface;
    ocrRequest?: DataSourceInterface;
  };
  errorOnTypes?: Record<string, TypeErrorItemInterface>;
  extraConfig: Record<string, any>;
}
