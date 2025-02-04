import React from 'react';
import { ViewDataInterface } from '../../../FormGenerator/FieldGenerator/FieldGenerator';
import ValueMapView from '../../../ValueMapView/ValueMapView';
import { InitialDataInterface } from '../../../../interfaces/entity.interface';

export function generateValueMap({ entity, value }: ViewDataInterface) {
  return (
    <ValueMapView
      label={entity.label}
      value={value}
      items={entity.initialData as Array<InitialDataInterface>}
    />
  );
}
