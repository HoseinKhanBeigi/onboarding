import {Control} from 'react-hook-form/dist/types/form';
import {ObjectFieldExtractor, PatternFieldExtractor,} from '../../../interfaces/entity.interface';
import {ObjectUtils} from '../../../lib/ObjectUtils';

export function dataExtractor(
  extractor: Array<ObjectFieldExtractor | PatternFieldExtractor> | undefined,
  control: Control,
  baseValuePath: string,
): [(data: any) => any, () => void] {
  if (!extractor) {
    return [data => data, () => {}];
  } else {
    extractor
      .filter(
        item =>
          typeof control.getValues(`${baseValuePath}.${item.key}`) ===
          'undefined',
      )
      .forEach(item => {
        control.register(`${baseValuePath}.${item.key}`, { required: false });
      });

    return [
      data => {
        extractor.forEach(item => {
          let extractedValue = null;
          if (data) {
            if (item.type === 'pattern') {
              const matchedData = data
                .toString()
                .match(new RegExp(item.pattern));
              extractedValue = matchedData ? matchedData[1] : null;
            } else if (item.type === 'object' && typeof data === 'object') {
              extractedValue = ObjectUtils.resolveStringPathInObject(
                data,
                item.path,
              );
            }
          }
          control.setValue(`${baseValuePath}.${item.key}`, extractedValue, {
            shouldDirty: true,
            shouldValidate: true,
          });
        });
        return data;
      },
      () =>
        extractor.forEach(item =>
          control.unregister(`${baseValuePath}.${item.key}`),
        ),
    ];
  }
}

export default dataExtractor;
