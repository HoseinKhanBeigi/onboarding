import React from 'react';
import { FieldDataInterface } from '../../../FormGenerator/FieldGenerator/FieldGenerator';
import { UploadFile } from '../../../UploadFile/UploadFile';

export function generateFile({
  disabled,
  entityData,
  extraData,
  errorMessage,
  entity: { value, label, name, sample, validation, fileConfig },
}: FieldDataInterface) {
  const props = {
    value,
    title: label,
    error: errorMessage,
    config: fileConfig,
    acceptFile: validation.file?.accept,
    multipleFile: validation.file?.multiple,
    validationMessage: validation.file?.message,
    maxSize: validation.file?.maxSize,
    sample,
    fileName: name,
    data: entityData,
    disabled,
  };
  return <UploadFile {...props} />;
}
