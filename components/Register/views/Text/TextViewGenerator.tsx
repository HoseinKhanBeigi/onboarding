import React from 'react';
import { ViewDataInterface } from '../../../FormGenerator/FieldGenerator/FieldGenerator';
import TextView from '../../../TextView/TextView';

export function generateText({ entity, value }: ViewDataInterface) {
  return <TextView label={entity.label} value={value} />;
}
