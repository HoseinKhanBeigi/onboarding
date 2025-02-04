import { ConfigItemInterface } from '../interfaces/common.interface';

const ERROR_MAP = new Map<string | number, string>();

ERROR_MAP.set(
  'FILL_THE_FORM_PROPERLY',
  'لطفا همه فیلدها را با مقدار صحیح پر کنید',
);
ERROR_MAP.set(
  'THIRD_PARTY_GATEWAY_TIMEOUT',
  'زمان انتظار مورد نظر به پایان رسید',
);
ERROR_MAP.set(
  'default',
  'درخواست شما با خطا مواجه شده است. لطفاً دقایقی دیگر تلاش کنید. در صورت برطرف نشدن مشکل با پشتیبانی تماس بگیرید.',
);

ERROR_MAP.set('SEJAM_INVALID_OTP', 'کد اعتبارسنجی سجام نا معتبر است');

ERROR_MAP.set('CAPTCHA_IS_WRONG', 'کد امنیتی اشتباه است، لطفا مجددا تلاش کنید');

export class ErrorUtils {
  static setErrors(list: Array<ConfigItemInterface>): void {
    list.forEach(({ id, title }) => ERROR_MAP.set(id, title));
  }

  static getErrorMessage(errorCode): string {
    if (ERROR_MAP.has(errorCode)) {
      return ERROR_MAP.get(errorCode) as string;
    }
    return ERROR_MAP.get('default') as string;
  }

  static getDefaultErrorMessage(): string {
    return ERROR_MAP.get('default') as string;
  }
}

export default ErrorUtils;
