import React from 'react';
import { FormInputInterface } from '../../../FormInput/FormInput';
import { FormInput } from '../../../index';
import {
  FieldDataInterface,
  resolveItems,
} from '../../../FormGenerator/FieldGenerator/FieldGenerator';
import { InitialDataInterface } from '../../../../interfaces/entity.interface';
import { ObjectUtils } from '../../../../lib/ObjectUtils';
import { injectDataIntoObject } from '../../../../lib/configurableRequest';

export function generateSelect({
  dataExtractor,
  dataConverter,
  disabled,
  entityData,
  errorMessage,
  entity: {
    value,
    label,
    placeHolder,
    name,
    initialData,
    itemsDependsOn,
    resolve,
    validation,
  },
  realTimeFormValues,
  
}: FieldDataInterface) {
  
  const initialData1 = getInitialData(
    initialData,
    entityData,
    resolve,
  ) as Array<InitialDataInterface>;
  const items: Array<InitialDataInterface> = resolveItems(
    initialData1,
    realTimeFormValues,
    itemsDependsOn,
  );
  const mode: string = validation?.select?.multiple ? 'multiple' : 'single';
  const props: FormInputInterface = {
    type: 'select',
    value: value || null,
    title: label,
    placeholder: placeHolder,
    extractor: dataExtractor,
    converter: dataConverter,
    inputName: name,
    items,
    error: errorMessage,
    data: entityData,
    mode,
    disabled,
  };
  return <FormInput {...props} />;
}

export function getInitialData(initialData, entityData, resolve) {
  if (initialData instanceof Array && initialData.length > 0) {
    return initialData;
  } else {
    const resolvedInitialData = entityData.initialData;
    if (
      ObjectUtils.checkIfItsFilled(resolvedInitialData) &&
      resolvedInitialData.length > 0
    ) {
      if (resolve?.initialData?.type === 'store' && resolve?.initialData?.map) {
        return resolvedInitialData.map(item =>
          injectDataIntoObject(resolve?.initialData.map, {}, item),
        );
      }
      return resolvedInitialData;
    }
  }
}
