import React from 'react';
import { FieldDataInterface } from '../../../FormGenerator/FieldGenerator/FieldGenerator';
import ObjectList, {
  ObjectListProps,
  ObjectListType,
} from '../../../ObjectList/ObjectList';

export function generateObjectList({
  disabled,
  errorMessage,
  entity: { value, label, extraConfig, name },
  extraData,
}: FieldDataInterface) {
  const props: ObjectListProps = {
    value: (value as ObjectListType) || [],
    title: label,
    inputName: name,
    error: errorMessage,
    extraConfig,
    disabled,
    extraData,
  };
  return <ObjectList {...props} />;
}

export default generateObjectList;
