import {MultipleConstraintInterface} from '../../interfaces/entity.interface';
import {ObjectUtils} from "../../lib/ObjectUtils";

interface IsHiddenProps {
  config?: boolean | MultipleConstraintInterface;
  form: Record<string, any>;
  stages?: Record<string, Record<string, any>>;
  additionalData?: Record<string, Record<string, any>>;
}

export function isHidden({
  config,
  form,
  additionalData,
  stages
}: IsHiddenProps): boolean {
  if (!config) {
    return false;
  }

  if (typeof config === 'boolean') {
    return config as boolean;
  } else {
    const hiddenConstraints = config as MultipleConstraintInterface;
    const resolvedConstraints = hiddenConstraints.constraints.map<boolean>(({topic, path, match, value}) => {
      let resolvedValue;
      if (topic && topic !== 'form') {
        if (topic === 'data') {
          resolvedValue = ObjectUtils.resolveStringPathInObject(stages, path);
        } else if (topic === 'extra-data') {
          resolvedValue = ObjectUtils.resolveStringPathInObject(additionalData, path);
        }
      } else {
        resolvedValue = ObjectUtils.resolveStringPathInObject(form, path);
      }
      if (match === 'exact') {
        return resolvedValue === value;
      } else {
        return resolvedValue !== value;
      }
    });
    if (config.combination === 'and') {
      return resolvedConstraints.reduce((prev, current) => {
        if (!prev) {
          return prev;
        }
        return current;
      });
    } else {
      return resolvedConstraints.reduce((prev, current) => {
        return prev || current;
      });
    }
  }
}
