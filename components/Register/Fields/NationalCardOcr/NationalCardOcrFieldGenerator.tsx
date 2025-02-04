import React from 'react';
import { FieldDataInterface } from '../../../FormGenerator/FieldGenerator/FieldGenerator';
import { NationalCardOcr } from '../../../NationalCardOcr/NationalCardOcr';

export function generateNationalCardOcr({
  entity: { extraConfig },
}: FieldDataInterface) {
  return <NationalCardOcr requestConfig={extraConfig.ocrRequest} />;
}
