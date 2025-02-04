import { StageInterface } from '../../../interfaces/stage.interface';
import { FieldEntityInterface } from '../../../interfaces/entity.interface';

export function generateLabelObject(
  stages: StageInterface[],
): Record<string, any> {
  const labelObject: Record<string, any> = {};
  stages.forEach(stage => {
    labelObject[stage.name] = {};
    stage.groups.forEach(group => {
      labelObject[stage.name][group.name] = {};
      group.entities
        .filter(entity => entity.entityType === 'field')
        .forEach(entity => {
          const fieldEntity = entity as FieldEntityInterface;
          labelObject[stage.name][group.name][fieldEntity.entity.name] = {
            label: fieldEntity.entity.label,
            type: fieldEntity.entity.type,
            initialData: fieldEntity.entity.initialData || null,
            steps: fieldEntity.entity.steps || null,
            resolve: fieldEntity.entity?.resolve || null,
            actions: fieldEntity.entity?.actions || null,
            fileConfig: fieldEntity.entity?.fileConfig || null,
            extraConfig: fieldEntity.entity?.extraConfig || null,
          };
        });
    });
  });
  return labelObject;
}

export default generateLabelObject;
