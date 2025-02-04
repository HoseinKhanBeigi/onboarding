import {
  ActionDataResolveInterface,
  StoreDataResolveInterface,
} from '../../../interfaces/entity.interface';
import { ObjectUtils } from '../../../lib/ObjectUtils';

export function resolveEntityData(
  resolve:
    | Record<string, StoreDataResolveInterface | ActionDataResolveInterface>
    | undefined,
  stageAdditionalData: Record<string, any> | undefined,
  stagesData: Record<string, any> | undefined,
  formData: Record<string, any> | undefined,
): Record<string, any> {
  let data = {};

  if (!resolve) {
    return data;
  }

  for (const resolveKey in resolve) {
    if (resolve.hasOwnProperty(resolveKey)) {
      if (resolve[resolveKey].type === 'store') {
        const resolveItem = resolve[resolveKey] as StoreDataResolveInterface;

        let resolvedValue = null;
        if (resolveItem.topic && resolveItem.topic === 'data') {
          if (stagesData) {
            resolvedValue = ObjectUtils.resolveStringPathInObject(
              { ...stagesData },
              resolveItem.path,
            );
          }
        } else if (resolveItem.topic && resolveItem.topic === 'form') {
          if (formData) {
            resolvedValue = ObjectUtils.resolveStringPathInObject(
              { ...formData },
              resolveItem.path,
            );
          }
        } else if (stageAdditionalData) {
          resolvedValue = ObjectUtils.resolveStringPathInObject(
            { ...stageAdditionalData },
            resolveItem.path,
          );
        }
        data = ObjectUtils.insertDataIntoObjectByStringPath(
          data,
          resolveKey,
          resolvedValue,
        );
      }
    }
  }

  return data;
}

export default resolveEntityData;
