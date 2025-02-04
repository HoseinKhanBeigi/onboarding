import React, { useContext, useEffect, useMemo } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Control } from 'react-hook-form/dist/types/form';
import {
  FieldInterface,
  ItemResolverInterface,
  ViewInterface,
} from '../../../interfaces/entity.interface';
import { formValidation } from '../../../lib/formValidation';
import { isHidden } from '../../isHidden/isHidden';
import { dataExtractor as dataExtractorGenerator } from '../DataExtractor/dataExtractor';
import { dataConverter as dataConverterGenerator } from '../DataConverter/dataConverter';
import { resolveEntityData } from './resolveEntityData';
import { ObjectUtils } from '../../../lib/ObjectUtils';
import { FormGeneratorContext } from '../FormGenerator';

interface ErrorType {
  message: string;
  type: unknown;
  ref: unknown;
}

interface FieldGeneratorProps {
  entity: FieldInterface;
  baseValuePath: string;
  error: ErrorType;
}

export interface FieldDataInterface {
  dataExtractor: (data: any) => any;
  dataConverter: (data: any) => any;
  entityData: any;
  data?: Record<string, any>;
  extraData?: Record<string, any>;
  errorMessage?: string;
  disabled: boolean;
  realTimeFormValues?: Record<string, any>;
  entity: FieldInterface;
}

export interface ViewDataInterface {
  data?: Record<string, any>;
  extraData?: Record<string, any>;
  realTimeFormValues?: Record<string, any>;
  entity: ViewInterface;
  value: any;
}

export function FieldGenerator({
  entity,
  baseValuePath,
  error,
}: FieldGeneratorProps) {
  const {
    control,
    disabled,
    data,
    extraData,
    fieldMap,
    realTimeFormValues,
  } = useContext(FormGeneratorContext);
  const formControl = control as Control;
  const {
    extractor,
    type,
    value,
    resolve,
    hidden: hiddenConfig,
    converter,
  } = entity;

  const formValues = useWatch({ control: formControl });
  const hidden = useMemo(
    () =>
      isHidden({
        config: hiddenConfig,
        stages: data,
        additionalData: extraData,
        form: realTimeFormValues || {},
      }),
    [hiddenConfig, data, extraData, formValues, realTimeFormValues],
  );

  const entityData: Record<string, any> = useMemo(
    () => resolveEntityData(resolve, extraData, data, realTimeFormValues),
    [resolve, extraData, data, realTimeFormValues],
  );

  const [dataExtractor, unregister] = dataExtractorGenerator(
    extractor,
    formControl,
    baseValuePath,
  );

  const dataConverter = dataConverterGenerator(converter);
  useEffect(() => unregister, [false]);

  const errorMessage: string = (error && error.message) || '';

  const componentBaseData: FieldDataInterface = {
    dataExtractor,
    dataConverter,
    entityData,
    data,
    extraData,
    errorMessage,
    disabled,
    realTimeFormValues,
    entity,
  };

  const element: JSX.Element = useMemo(() => {
    if (fieldMap.has(type)) {
      // @ts-ignore
      return fieldMap.get(type)(componentBaseData);
    } else {
      return <></>;
    }
  }, [
    fieldMap,
    entity,
    type,
    componentBaseData,
    realTimeFormValues,
    data,
    extraData,
  ]);

  return (
    <div data-cy="field-box" hidden={hidden}>
      <Controller
        as={element}
        name={`${baseValuePath}.${entity.name}`}
        control={control}
        defaultValue={value || ''}
        rules={hidden ? {} : formValidation(entity.validation)}
      />
    </div>
  );
}

export function resolveItems<T>(
  data: Array<T>,
  values: any,
  itemsDependsOn?: ItemResolverInterface,
): Array<T> {
  console.log(values,"values")
  if (itemsDependsOn) {
     const test =  data.filter(item => {
      const itemEquality =
        (
          ObjectUtils.resolveStringPathInObject(item, itemsDependsOn.path) ||
          itemsDependsOn.path
        ).toString() ===
        (
          ObjectUtils.resolveStringPathInObject(values, itemsDependsOn.value) ||
          itemsDependsOn.value
        ).toString();

      return itemsDependsOn.match === 'exact' ? itemEquality : !itemEquality;
    });

    console.log(test,"test")
    return  test;
  }
  return data;
}

export default FieldGenerator;
