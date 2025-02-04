import React, { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Control } from 'react-hook-form/dist/types/form';
import { DevTool } from '@hookform/devtools';
import { FormConfigInterface } from '../../interfaces/stage.interface';
import GroupRenderer from './StepGenerator/GroupRenderer';
import { dataExtractor } from './DataExtractor/dataExtractor';
import { FieldInterface } from '../../interfaces/entity.interface';
import { ObjectUtils } from '../../lib/ObjectUtils';
import style from '../Register/Register.scss';
import {
  FieldDataInterface,
  ViewDataInterface,
} from './FieldGenerator/FieldGenerator';

export type SingleFieldGeneratorType = (
  baseData: FieldDataInterface,
) => JSX.Element;
export type SingleViewGeneratorType = (
  baseData: ViewDataInterface,
) => JSX.Element;
export type FieldMapType = Map<string, SingleFieldGeneratorType>;
export type ViewMapType = Map<string, SingleViewGeneratorType>;

interface FormGeneratorContextInterface {
  fieldMap: FieldMapType;
  viewMap: ViewMapType;
  control?: Control;
  data?: Record<string, Record<string, any>>;
  realTimeFormValues?: Record<string, Record<string, any>>;
  extraData?: Record<string, Record<string, any>>;
  disabled: boolean;
  errors?: any;
}

export const FormGeneratorContext = React.createContext<
  FormGeneratorContextInterface
>({
  fieldMap: new Map(),
  viewMap: new Map(),
  disabled: false,
});

export interface FormGeneratorInterface {
  fieldMap: FieldMapType;
  viewMap: ViewMapType;
  // eslint-disable-next-line react/require-default-props
  config?: FormConfigInterface;
  onSubmit: (data: Record<string, any>) => void;
  actions: JSX.Element;
  // eslint-disable-next-line react/require-default-props
  data?: Record<string, Record<string, any>>;
  // eslint-disable-next-line react/require-default-props
  extraData?: Record<string, Record<string, any>>;
  disabled: boolean;
  // eslint-disable-next-line react/require-default-props
  isDev?: boolean;
  // eslint-disable-next-line react/require-default-props
  defaultData?: Record<string, unknown>;
}

export function FormGenerator({
  fieldMap,
  viewMap,
  config,
  onSubmit,
  actions,
  data,
  extraData,
  disabled,
  isDev,
  defaultData,
}: FormGeneratorInterface) {
  const { control, errors, handleSubmit, getValues, reset } = useForm();

  useEffect(() => reset(defaultData), [defaultData]);

  const realTimeFormValues = useWatch({ control: control as Control });

  const { defaultValuesRef } = control;

  const groups = useMemo(
    () =>
      config?.groups.map(group => (
        <GroupRenderer key={group.name} group={group} />
      )),
    [config, errors],
  );

  function extractData(params) {
    config?.groups.forEach(group =>
      group?.entities
        .filter(item => item.entityType === 'field')
        .forEach(item => {
          const [extractor] = dataExtractor(
            (item.entity as FieldInterface).extractor,
            control,
            group.name,
          );
          extractor(
            ObjectUtils.resolveStringPathInObject(
              params,
              `${group.name}.${item.entity.name}`,
            ),
          );
        }),
    );
    return getValues();
  }

  function submit(event) {
    event.stopPropagation();
    handleSubmit(formData => onSubmit(extractData(formData)))(event);
  }

  return (
    <>
      <FormGeneratorContext.Provider
        value={{
          control,
          errors,
          disabled,
          data,
          extraData,
          fieldMap,
          viewMap,
          realTimeFormValues:
            Object.keys(realTimeFormValues).length === 0
              ? defaultValuesRef.current
              : realTimeFormValues,
        }}
      >
        <form className={style.groupsContainer} onSubmit={submit}>
          {groups}
          {actions}
          {isDev && <DevTool control={control} />}
        </form>
      </FormGeneratorContext.Provider>
    </>
  );
}
