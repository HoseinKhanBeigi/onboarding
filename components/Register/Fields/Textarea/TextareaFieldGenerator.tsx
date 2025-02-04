import React from 'react';
import { FormInputInterface } from '../../../FormInput/FormInput';
import { FormInput } from '../../../index';
import { FieldDataInterface } from '../../../FormGenerator/FieldGenerator/FieldGenerator';

export function generateTextarea({
  dataExtractor,
  dataConverter,
  disabled,
  entityData,
  errorMessage,
  entity: { value, label, placeHolder, name },
}: FieldDataInterface) {
  const props: FormInputInterface = {
    type: 'textarea',
    value: value || '',
    title: label,
    placeholder: placeHolder,
    extractor: dataExtractor,
    converter: dataConverter,
    inputName: name,
    error: errorMessage,
    data: entityData,
    disabled,
  };
  return <FormInput {...props} />;
}
