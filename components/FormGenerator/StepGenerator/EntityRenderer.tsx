import React, { useContext } from 'react';
import {
  FieldEntityInterface,
  FieldInterface,
  ViewEntityInterface,
  ViewInterface,
} from '../../../interfaces/entity.interface';
import { FieldGenerator } from '../FieldGenerator/FieldGenerator';
import { ViewGenerator } from '../ViewGenerator/ViewGenerator';
import { FormGeneratorContext } from '../FormGenerator';

interface EntityRendererProps {
  groupName: string;
  entity: FieldEntityInterface | ViewEntityInterface;
}

function EntityRenderer({
  groupName,
  entity: { entity, entityType },
}: EntityRendererProps) {
  const { errors } = useContext(FormGeneratorContext);
  const fieldName = entity.name;
  if (entityType === 'field') {
    const fieldEntity = entity as FieldInterface;
    // TODO: sort entities by order
    return (
      <FieldGenerator
        key={`${groupName}-${entityType}-${fieldName}`}
        entity={fieldEntity}
        baseValuePath={groupName}
        error={errors[groupName] ? errors[groupName][fieldName] : {}}
      />
    );
  } else if (entityType === 'view') {
    return (
      <ViewGenerator
        key={`${groupName}-${entityType}-${fieldName}`}
        baseValuePath={groupName}
        entity={entity as ViewInterface}
      />
    );
  }
  return null;
}

export default EntityRenderer;
