import {
  ObjectListValidationInterface,
  ValidationInterface,
} from '../interfaces/entity.interface';
import { StringUtils } from './StringUtils';

export function validateNationalId(id: string) {
  if (!/^\d{10}$/.test(id)) {
    return false;
  }

  const check = parseInt(id[9], 10);
  let sum = 0;
  for (let i = 0; i < 9; ++i) {
    sum += parseInt(id[i], 10) * (10 - i);
  }
  sum %= 11;

  return (sum < 2 && check === sum) || (sum >= 2 && check + sum === 11);
}

export function validationPostalCode(postCode: string) {
  return new RegExp(/(?!(\\d)\\1{3})[13-9]{4}[1346-9][013-9]{5}/).test(
    postCode,
  );
}

export function validateCompanyId(value: string) {
  const coefficients = [17, 19, 23, 27, 29, 17, 19, 23, 27, 29];
  if (value.length !== 11) {
    return false;
  }
  // eslint-disable-next-line
  const controlNumber = parseInt(value.substring(10, 11));
  // eslint-disable-next-line
  const multiplier = parseInt(value.substring(9, 10)) + 2;

  let sum = 0;
  value
    .substring(0, 10)
    .split('')
    .reverse()
    .forEach((item, index) => {
      // eslint-disable-next-line
      sum += (parseInt(item) + multiplier) * coefficients[index];
    });
  const validationReturn = sum % 11;
  return (
    (validationReturn === 10 && controlNumber === 0) ||
    validationReturn === controlNumber
  );
}

const NUMBER_PERSIAN_FORIGN = '^(?! )[\u06f0-\u06f9\0-9]+$';

const EMAIL_PATTERN =
  "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

const MOBILE_PATTERN =
  '(0)?([]|-|[()]){0}09[0|1|2|3|4]([()]){0}(?:[0-9]([ ]|-|[()]){0}){8}';
const PERSIAN_CHAR =
  '^(\\s*([\u0600-\u065F]|[\u066a-\u06eF]|[\u200c\u200d])+\\s*)+$';
const PERSIAN_NUMBER = '^([\u0660-\u066a]+|[\u06f0-\u06f9]+)+$';
const IBAN = '^((IR|ir)(\\d{24}))$';
const PERSIAN_LETTERS = '^(\\s*([\u0600-\u06f9]|[\u200c\u200d])+\\s*)+$';
const PATTERNWEB =
  '^(https://)?([a-zA-Z0-9]+).[a-zA-Z0-9].[‌​a-z]{3}.([a-z]+)?$';
// eslint-disable-next-line prettier/prettier
const PERSIAN_ALPHA = '^(?! )[\u06f0-\u06f9\u0660-\u066a\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u0020\u2000-\u200F\u2028-\u202F\u06A9\u06AF\u06BE\u06CC\u0629\u0643\u0649-\u064B\u064D\u06D5\u06F0-\u06F90-9-.,ُ،]+$';
// eslint-disable-next-line prettier/prettier
const NEWPERSIAN = '^(?! )[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u0655\u067E\u0686\u0698\u0020\u2000-\u200F\u2028-\u202F\u06A9\u06AF\u06BE\u06CC\u0629\u0643\u0649-\u064B\u064D\u06D5]+$';
function isValid(
  list: Array<Record<string, any>>,
  {
    operator,
    count,
    field,
    message,
    value,
    match,
  }: ObjectListValidationInterface,
) {
  const filteredList = list
    .map(item => (item.hasOwnProperty(field) ? item[field] : null))
    .filter(item => (match === 'not' ? item !== value : item === value));
  let countCheck = false;
  if (operator === 'equal') {
    countCheck =
      filteredList.length === (count === 'all' ? list.length : count);
  } else if (operator === 'not') {
    countCheck =
      filteredList.length !== (count === 'all' ? list.length : count);
  } else if (operator === 'less') {
    countCheck = filteredList.length < (count === 'all' ? list.length : count);
  } else if (operator === 'more') {
    countCheck = filteredList.length > (count === 'all' ? list.length : count);
  }
  return countCheck;
}

export function isValidMobile(value?: string) {
  if (StringUtils.isItFilled(value)) {
    return new RegExp(MOBILE_PATTERN).test(value as string);
  }
  return false;
}

export function formValidation(valid: ValidationInterface) {
  const validity: Record<string, any> = {};

  if (valid.required) {
    validity.required = 'این فیلد اجباری است';
  }

  if (valid.input) {
    if (valid.input.maxLength) {
      validity.maxLength = {
        value: valid.input.maxLength,
        message: `نباید بیشتر از ${valid.input.maxLength} کاراکتر باشد`,
      };
    }

    if (valid.input.minLength) {
      validity.minLength = {
        value: valid.input.minLength,
        message: `نباید کمتر از ${valid.input.minLength} کاراکتر باشد`,
      };
    }

    if (valid.input.max) {
      validity.max = {
        value: valid.input.max,
        message: `نباید بیشتر از ${valid.input.max}  باشد`,
      };
    }

    if (valid.input.min) {
      validity.min = {
        value: valid.input.min,
        message: `نباید کمتر از ${valid.input.min}  باشد`,
      };
    }

    if (valid.input.pattern) {
      validity.pattern = {
        value: new RegExp(valid.input.pattern),
        message:
          valid.input.message || 'لطفا عبارت وارد شده را دوباره بررسی کنید',
      };
    }

    if (valid.input.use) {
      if (valid.input.use === 'individualNationalCode') {
        validity.validate = id =>
          validateNationalId(id) || 'کد ملی وارد شده صحیح نمی‌باشد';
      } else if (valid.input.use === 'mobile') {
        validity.pattern = {
          value: new RegExp(MOBILE_PATTERN),
          message: 'لطفا شماره موبایل را به درستی وارد کنید',
        };
      } else if (valid.input.use === 'email') {
        validity.pattern = {
          value: new RegExp(EMAIL_PATTERN),
          message: 'لطفا آدرس ایمیل را به درستی وارد کنید',
        };
      } else if (valid.input.use === 'persian') {
        validity.pattern = {
          value: new RegExp(PERSIAN_ALPHA),
          message: 'شما فقط مجاز به استفاده از حروف و اعداد فارسی هستید',
        };
      } else if (valid.input.use === 'persian-chars') {
        validity.pattern = {
          value: new RegExp(PERSIAN_CHAR),
          message: 'لطفا فقط از حروف فارسی استفاده کنید',
        };
      } else if (valid.input.use === 'patternWeb') {
        validity.pattern = {
          value: new RegExp(PATTERNWEB),
          message: 'لطفا فرمت وب را به درستی وارد کنید',
        };
      } else if (valid.input.use === 'new-persian') {
        validity.pattern = {
          value: new RegExp(NEWPERSIAN),
          message: 'لطفا فقط از حروف فارسی استفاده کنید',
        };
      } else if (valid.input.use === 'iban') {
        validity.pattern = {
          value: new RegExp(IBAN),
          message: 'لطفا شماره شبای صحیح را وارد کنید',
        };
      } else if (valid.input.use === 'persian-number') {
        validity.pattern = {
          value: new RegExp(PERSIAN_NUMBER),
          message: 'لطفا فقط از اعداد فارسی استفاده کنید',
        };
      } else if (valid.input.use === 'number') {
        validity.pattern = {
          value: new RegExp(NUMBER_PERSIAN_FORIGN),
          message: 'لطفا فقط از اعداد استفاده کنید',
        };
      } else if (valid.input.use === 'iban') {
        validity.pattern = {
          value: new RegExp(NUMBER_PERSIAN_FORIGN),
          message: 'لطفا فقط از اعداد استفاده کنید',
        };
      }
      return validity;
    }
  }

  if (valid.objectList) {
    if (valid.objectList instanceof Array) {
      validity.validate = list => {
        // @ts-ignore
        return valid.objectList?.map(item => isValid(list, item)).every(item => item) || valid.objectList[0].message;
      };
    } else {
      validity.validate = list => {
        // @ts-ignore
        return isValid(list, valid.objectList as ObjectListValidationInterface) || valid.objectList?.message;
      };
    }
  }

  return validity;
}
