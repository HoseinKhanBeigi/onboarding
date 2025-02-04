import React from 'react';
import {
  FieldDataInterface,
  resolveItems,
} from '../../../FormGenerator/FieldGenerator/FieldGenerator';
import { StepInterface } from '../../../../interfaces/entity.interface';
import WrappedSlider from '../../../Slider/Slider';

export function generateSlider({
  disabled,
  entityData,
  errorMessage,
  entity: { value, label, steps: entitySteps, step, unit, itemsDependsOn },
  realTimeFormValues,
}: FieldDataInterface) {
  const steps: Array<StepInterface> = resolveItems(
    entitySteps as Array<StepInterface>,
    realTimeFormValues,
    itemsDependsOn,
  );
  const props = {
    value: (value || (entitySteps ? entitySteps[0]?.value : 0)) as number,
    title: label,
    error: errorMessage,
    steps: steps || [],
    step,
    unit,
    data: entityData,
    disabled,
  };
  return <WrappedSlider {...props} />;
}
