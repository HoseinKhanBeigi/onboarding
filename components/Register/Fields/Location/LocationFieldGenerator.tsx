import React from 'react';
import {
  FieldDataInterface,
  resolveItems,
} from '../../../FormGenerator/FieldGenerator/FieldGenerator';
import { Locations } from '../../../Locations/Locations';

export function generateLocation({
  disabled,
  entityData,
  errorMessage,
  entity: {
    value,
    label,
    name,
    initialData: entityInitialData,
    itemsDependsOn,
  },
  realTimeFormValues,
}: FieldDataInterface) {
  const addresses: Array<any> = resolveItems(
    entityInitialData as any,
    realTimeFormValues,
    itemsDependsOn,
  );
  const props = {
    value: value || 1,
    title: label,
    inputName: name,
    addresses,
    error: errorMessage,
    data: entityData,
    disabled,
  };
  return <Locations {...props} />;
}
