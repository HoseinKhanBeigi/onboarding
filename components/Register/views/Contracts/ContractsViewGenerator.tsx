import React from 'react';
import { ViewDataInterface } from '../../../FormGenerator/FieldGenerator/FieldGenerator';
import Contracts from '../../../Contracts/Contracts';

export function generateContracts({ entity }: ViewDataInterface) {
  const getFormsConfig = entity.extraConfig?.actions?.getForms;
  const downloadFormConfig = entity.extraConfig?.actions?.downloadForm;

  return (
    <Contracts
      getFormsConfig={getFormsConfig}
      downloadFormConfig={downloadFormConfig}
      label={entity.label}
    />
  );
}
