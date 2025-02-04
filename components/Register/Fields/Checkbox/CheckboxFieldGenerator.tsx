import React from 'react';
import { FormInputInterface } from '../../../FormInput/FormInput';
import { FormInput } from '../../../index';
import { FieldDataInterface } from '../../../FormGenerator/FieldGenerator/FieldGenerator';

export function generateCheckbox({
  dataExtractor,
  dataConverter,
  disabled,
  entityData,
  errorMessage,
  entity: { value, label, name },
}: FieldDataInterface) {
  const props: FormInputInterface = {
    type: 'checkbox',
    value: value || null,
    title: '',
    placeholder: label,
    extractor: dataExtractor,
    converter: dataConverter,
    inputName: name,
    error: errorMessage,
    data: entityData,
    disabled,
  };
  return <FormInput {...props} />;
}
