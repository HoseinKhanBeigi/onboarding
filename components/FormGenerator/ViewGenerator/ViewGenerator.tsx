import React, { useContext, useMemo } from 'react';
import { Control } from 'react-hook-form/dist/types/form';
import { useWatch } from 'react-hook-form';
import { ViewInterface } from '../../../interfaces/entity.interface';
import { FormGeneratorContext } from '../FormGenerator';
import { isHidden } from '../../isHidden/isHidden';
import { ViewDataInterface } from '../FieldGenerator/FieldGenerator';
import { ObjectUtils } from '../../../lib/ObjectUtils';

interface ViewGeneratorProps {
  entity: ViewInterface;
  baseValuePath: string;
}

export function ViewGenerator({ entity, baseValuePath }: ViewGeneratorProps) {
  const { control, data, extraData, viewMap, realTimeFormValues } = useContext(
    FormGeneratorContext,
  );
  const formControl = control as Control;
  const { type, hidden: hiddenConfig } = entity;

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

  const value = useMemo(
    () =>
      ObjectUtils.resolveStringPathInObject(
        realTimeFormValues,
        `${baseValuePath}.${entity.name}`,
      ),
    [realTimeFormValues],
  );
  const componentBaseData: ViewDataInterface = {
    data,
    extraData,
    realTimeFormValues,
    entity,
    value,
  };

  if (viewMap.has(type)) {
    // @ts-ignore
    const component = viewMap.get(type)(componentBaseData);
    return (
      <div data-cy="field-box" hidden={hidden}>
        {component}
      </div>
    );
  } else {
    return <></>;
  }
}
