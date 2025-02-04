import React from 'react';
import { FieldDataInterface } from '../../../FormGenerator/FieldGenerator/FieldGenerator';
import {
  ObjectListProps,
  ObjectListType,
} from '../../../ObjectList/ObjectList';
import StakeholderList from '../../../StakeholderList/StakeholderList';

export function generateStakeholderList({
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
  return <StakeholderList {...props} />;
}

export default generateStakeholderList;
