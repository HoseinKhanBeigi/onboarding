import { DataConverterTypes } from '../../../interfaces/entity.interface';

const converterMap: Record<DataConverterTypes, (data) => string> = {
  enNumToFa: data => {
    return data.replaceAll(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  },
  faNumToEn: data => {
    return data.replaceAll(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  },
  toUpperCase: data => {
    return data.toLowerCase();
  },
  toLowerCase: data => {
    return data.toUpperCase();
  },
};

export function dataConverter(
  converters?: Array<DataConverterTypes>,
): (data: any) => any {
  if (!converters || converters.length === 0) {
    return data => data;
  } else {
    return data => {
      return converters.reduce((replacedValue, currentValue) => {
        return converterMap[currentValue](replacedValue);
      }, data as string);
    };
  }
}

export default dataConverter;
