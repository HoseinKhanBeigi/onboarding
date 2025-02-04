import React from 'react';
import { FormInputInterface } from '../../../FormInput/FormInput';
import { FormInput } from '../../../index';
import { FieldDataInterface } from '../../../FormGenerator/FieldGenerator/FieldGenerator';
import DataInjector from '../../../../lib/DataInjector';

export function generateDatePicker({
  dataExtractor,
  dataConverter,
  disabled,
  entityData,
  errorMessage,
  entity: { value, label, name, placeHolder, validation },
}: FieldDataInterface) {
  let min;
  let max;
  if (validation?.datePicker) {
    if (validation?.datePicker.min) {
      min = parseInt(
        DataInjector.unixDateMapper(validation?.datePicker.min),
        10,
      );
    }
    if (validation?.datePicker.max) {
      max = parseInt(
        DataInjector.unixDateMapper(validation?.datePicker.max),
        10,
      );
    }
  }

  const props: FormInputInterface = {
    type: 'date-picker',
    value: value || Date.now(),
    title: label,
    placeholder: placeHolder,
    extractor: dataExtractor,
    converter: dataConverter,
    inputName: name,
    error: errorMessage,
    data: entityData,
    min,
    max,
    disabled,
  };
  return <FormInput {...props} />;
}
