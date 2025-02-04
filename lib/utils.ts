import {AxiosResponse} from 'axios';
import {wrappedLocalStorage} from './hybridStorage';
import {TOKEN} from '../store/constants';
import {ServerErrorMap} from '../interfaces/purchase';
import {MappedConfigResponse, UnMappedConfigResponse,} from '../interfaces/config';
import {ProductThemeInterface} from "../interfaces/branding.interface";

interface MappedError {
  message: string;
  hasAction: boolean;
}

interface MakeItTwoDigits {
  (value: string, prefix?: string, suffix?: string): string;
  (value: number, prefix?: string, suffix?: string): string;
  (value: string | number, prefix?: unknown, suffix?: unknown): string;
}

interface SeparateWithComma {
  (value?: string): string;
  (value?: number): string;
  (value?: unknown): string;
}

export class Utils {
  static separateWithComma: SeparateWithComma = value => {
    if (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '';
    }
  };

  static objectIsEmpty(obj: Record<string, unknown>): boolean {
    return obj ? Object.keys(obj).length === 0 : false;
  }

  // TODO: add the type to method.
  static makeItTwoDigits = (value, prefix = '', suffix = '') => {
    const generatedString = '0'.concat(value).substr(-2, 2);
    return `${prefix}${generatedString}${suffix}`;
  };

  static parseJwt(token = ''): Record<string, any> | null {
    let targetToken = token;
    if (!targetToken) {
      const tokenHolder = wrappedLocalStorage.getItem(TOKEN);
      if (tokenHolder) {
        targetToken = tokenHolder;
      } else {
        return null;
      }
    }

    try {
      const base64Url = targetToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => {
            return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
          })
          .join(''),
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  static calculateRemainingTime(expireDate: number): number {
    return Math.floor((expireDate - (Date.now() + 60000)) / 1000);
  }

  static convertToPersianNumber = number => {
    const persianNumber = [
      'صفر',
      'یک',
      'دو',
      'سه',
      'چهار',
      'پنج',
      'شش',
      'هفت',
      'هشت',
      'نه',
      'ده',
    ];
    return persianNumber[number];
  };

  static purchaseErrorMapper(error: string | undefined): MappedError {
    if (ServerErrorMap.MEMBER_ACCOUNT_BLOCKED === error) {
      return {
        message: 'حساب کاربری شما مسدود است، لطفا با پشتیبانی تماس بگیرید.',
        hasAction: true,
      };
    } else if (ServerErrorMap.INSUFFICIENT_BALANCE === error) {
      return {
        message:
          'مبلغ خرید شما از میزان اعتبار فعلیتان بیشتر است. امکان پرداخت در حال حاضر موجود نیست، بعدا تلاش کنید.',
        hasAction: true,
      };
    } else if (
      ServerErrorMap.PURCHASE_IS_NOT_WAITED_FOR_USER_CONFIRMATION === error
    ) {
      return {
        message:
          'شما قبلا این پرداخت را تایید کرده اید و نیازی به تایید دوباره شما نیست.',
        hasAction: true,
      };
    }
    return {
      message: 'خطایی پیش آمده، لطفا با پذیرنده خود تماس بگیرید.',
      hasAction: false,
    };
  }

  static faResponseMapper(
    response: AxiosResponse<UnMappedConfigResponse>,
  ): AxiosResponse<MappedConfigResponse> {
    if (response.data) {
      response.data = response.data?.map(item => ({
        name: item.faTitle,
        id: item.id,
        available: item.available,
      }));
      return response;
    }
    return response;
  }

  static get isDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  static checkIfItsFilled(value) {
    return value !== null && typeof value !== 'undefined';
  }

  static applyStylesFromBrand(theme: ProductThemeInterface | undefined) {
    const selectBackgroundImg = (url, backGroundColor) => {
      if (url && backGroundColor) {
        return `url(${url}), ${backGroundColor}`;
      } else if (url && !backGroundColor) {
        return `url(${url})`;
      } else {
        return backGroundColor;
      }
    };

    document.documentElement.style.setProperty(
      '--sidebar-bg-img-url-mobile',
      theme?.sidebar?.background?.image?.mobile?.url || '',
    );
    document.documentElement.style.setProperty(
      '--sidebar-bg-color-mobile',
      theme?.sidebar?.background?.backgroundColor?.mobile || '#334357',
    );
    document.documentElement.style.setProperty(
      '--sidebar-desc-bg-color',
      theme?.sidebar?.description?.backgroundColor || '',
    );
    document.documentElement.style.setProperty(
      '--sidebar-desc-color',
      theme?.sidebar?.description?.color || '#334357',
    );

    // applyFormStyle
    const desktopBackgroundImgForm = selectBackgroundImg(
      theme?.form?.background?.image?.desktop?.url,
      theme?.form?.background?.backgroundColor?.desktop,
    );
    const mobileBackgroundImgForm = selectBackgroundImg(
      theme?.form?.background?.image?.mobile?.url,
      theme?.form?.background?.backgroundColor?.mobile,
    );

    document.documentElement.style.setProperty(
      '--sidebar-desc-bg-color',
      theme?.sidebar?.description?.backgroundColor || '#121b26',
    );
    document.documentElement.style.setProperty(
      '--sidebar-desc-color',
      theme?.sidebar?.description?.color || '#ffffff',
    );
    document.documentElement.style.setProperty(
      '--form-bg-img-url-desktop',
      desktopBackgroundImgForm || '',
    );
    document.documentElement.style.setProperty(
      '--from-bg-img-url-mobile',
      mobileBackgroundImgForm || '',
    );
    document.documentElement.style.setProperty(
      '--from-bg-color',
      theme?.form?.background?.backgroundColor?.desktop || '#fefefe',
    );
    document.documentElement.style.setProperty(
      '--Button-primary-color',
      theme?.form?.button?.backgroundColor || '#40a9ff',
    );
    document.documentElement.style.setProperty(
      '--button-primary-disable-color',
      theme?.form?.button?.disableBackgroundColor ||
        'rgba(24, 144, 255, 0.25)',
    );
  }
}

export default Utils;
