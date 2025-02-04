import momentJalaali from 'moment-jalaali';
import {resolveEntityData} from '../../FormGenerator/FieldGenerator/resolveEntityData';
import {getInitialData} from '../../Register/Fields/Select/SelectFieldGenerator';
import {configurableRequest, injectIntoString,} from '../../../lib/configurableRequest';
import {FileRequestInstance, RequestInstance} from '../../../store/request';
import {ObjectUtils} from '../../../lib/ObjectUtils';
import {getBase64File} from '../../UploadFile/UploadFile';

momentJalaali.loadPersian({ dialect: 'persian-modern' });

export const DEFAULT_FILE = '/static/images/file.png';

export namespace FieldValueResolver {
  export function resolveSelectFieldValue(
    entity,
    data,
    stageData,
    extraData,
    stagesData,
  ) {
    const resolvedData = resolveEntityData(
      entity.resolve,
      extraData,
      stagesData,
      stageData,
    );
    const resolvedInitialData = getInitialData(
      entity.initialData,
      resolvedData,
      entity.resolve,
    );
    return resolvedInitialData.find(
      val => val.id.toString() === data.toString(),
    )?.label;
  }

  export function resolveLocationFieldValue(entity, data) {
    return entity.initialData.find(
      val => val.addressType.toString() === data.toString(),
    ).street;
  }

  export function resolveSliderFieldValue(entity, data) {
    return entity.steps.find(val => val.value.toString() === data.toString())
      .label;
  }

  export function resolveDatePickerFieldValue(data) {
    return momentJalaali(data).format('jYYYY/jM/jD');
  }

  export function resolveScheduleFieldValue(entity, data) {
    const initialValue = entity.initialData.find(
      val => val.id.toString() === data.toString(),
    );
    return `${new Date(initialValue.fromTimeEpoch).toLocaleTimeString('en-us', {
      hour12: false,
      hour: 'numeric',
      timeZone: 'Iran',
    })} تا ${new Date(initialValue.toTimeEpoch).toLocaleTimeString('en-us', {
      hour12: false,
      hour: 'numeric',
      timeZone: 'Iran',
    })}`;
  }

  export function resolveCheckboxFieldValue(entity) {
    return entity === true ? 'بله' : 'خیر';
  }

  export function resolveFileFieldValue(
    entity,
    data,
    stageData,
    stageConfig,
    router,
  ) {
    return async () => {
      try {
        const tokenResponse = await configurableRequest(
          RequestInstance,
          stageConfig.resolve.token,
          router,
          stageData,
        );
        const token = ObjectUtils.resolveStringPathInObject(
          { [stageConfig.name.toLowerCase()]: tokenResponse },
          entity.resolve?.token.path,
        );
        const imageData = await configurableRequest(
          FileRequestInstance,
          entity.fileConfig.get,
          router,
          { ...stageData, token, filename: data.fileId },
          { responseType: 'blob' },
        );
        if (['application/pdf', 'application/json'].includes((imageData as any).type)) {
          return DEFAULT_FILE;
        } else {
          return await getBase64File(imageData);
        }
      } catch (e) {
        // @ts-ignore
        console.error(e);
        return null;
      }
    };
  }

  export function resolveObjectListFieldValue(entity, data, router) {
    return data.map(listItem => ({
      title: injectIntoString(entity.extraConfig?.itemTitle, router, listItem),
      description: injectIntoString(
        entity.extraConfig?.itemDescription,
        router,
        listItem,
      ),
    }));
  }
}
