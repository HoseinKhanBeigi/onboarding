import {notification} from 'antd';
import {ErrorStageItemInterface} from '../../interfaces/errorStageItem.interface';
import {ProductInterface} from '../../interfaces/product.interface';
import {StageStatusEnum} from '../../interfaces/stageStatus.enum';
import {FormConfigInterface, StageInterface,} from '../../interfaces/stage.interface';
import {FieldEntityInterface, FieldInterface, ViewEntityInterface,} from '../../interfaces/entity.interface';
import {FormInterface} from '../../interfaces/startForm.interface';
import {FieldQueryContainerDto} from '../../interfaces/card.interface';

export function showStageErrors(
  errorItems: Array<ErrorStageItemInterface>,
  stageName: string,
) {
  errorItems
    .filter(item => item.stage === stageName)
    .forEach(item =>
      notification.error({
        duration: null,
        placement: 'bottomRight',
        message: item.title,
        description: item.description,
        key: stageName,
      }),
    );
}

export function closeStageErrors(stageName: string) {
  notification.close(stageName);
}

export function extractDefaultData(
  stage: StageInterface | undefined,
): Record<string, unknown> {
  const data = {};
  stage?.groups.forEach(group => {
    data[group.name] = {};
    group.entities.forEach(({ entity, entityType }) => {
      if (entityType === 'field') {
        const groupName: string = group.name;
        data[groupName][entity.name] = (entity as FieldInterface).value;
      }
    });
  });
  return data;
}

export function findStageStatus(steps, stage) {
  return steps.find(item => item.key === stage?.name)
    ?.status as StageStatusEnum;
}

export function findStage(product: ProductInterface, currentStage: string) {
  return product.stages.find(
    item => item.name.toLowerCase() === currentStage.toLowerCase(),
  );
}

export function generateSubmitState(data, application, stageName) {
  const selection = application?.stages.find(
    item => item.stageType === stageName,
  );

  if (
    typeof data.mappedData === 'object' &&
    !(data.mappedData instanceof Array)
  ) {
    if (selection && selection.state && selection.state === 'FILLED') {
      data.mappedData.submitState = 'FIX';
    } else {
      data.mappedData.submitState = 'NEW';
    }
  }

  return data;
}
export function generateFields(
  fields: Array<FieldQueryContainerDto>,
): Array<FieldEntityInterface | ViewEntityInterface> {
  return fields?.map<FieldEntityInterface>(({field}) => ({
    entityType: 'field',
    order: 0,
    entity: {
      name: field.id as string,
      label: field.title as string,
      type: field.fieldType?.name as string,
      placeHolder: field.description as string,
      validation: {
        required: field.required as boolean,
      },
      extraConfig: {},
    },
  }));
}

export function mapBoxFormToStage(
  form?: FormInterface,
): FormConfigInterface | undefined {
  if (form) {
    return {
      name: '',
      label: '',
      groups: [
        {
          order: 0,
          label: form.title as string,
          entities: generateFields(form.fields),
          name: '',
          descriptions: [],
        },
      ],
    };
  }
}
