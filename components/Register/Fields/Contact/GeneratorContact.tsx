/* eslint-disable import/no-named-as-default */
import React from 'react';
import { FieldDataInterface } from '../../../FormGenerator/FieldGenerator/FieldGenerator';
import Contact from '../../../Contact/index';

export function generateFullContact({
  entity: { extraConfig, value, validation },
  errorMessage
}: FieldDataInterface) {
  return (
    <Contact
      requestConfig={extraConfig.actions}
      value={value}
      validation={validation}
      errorMessage={errorMessage}
    />
  );
}
