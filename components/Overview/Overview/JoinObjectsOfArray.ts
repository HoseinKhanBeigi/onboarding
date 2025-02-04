import { NextRouter } from 'next/router';
import { OverviewListInterface } from '../../../interfaces/overview.interface';
import { StageInterface } from '../../../interfaces/stage.interface';
import { FieldValueResolver } from './FIeldValueResolver';

function resolveFieldValue(
  data,
  entity,
  stageData,
  router,
  stageConfig,
  stagesData,
  extraData,
) {
  if (entity.type === 'checkbox') {
    return FieldValueResolver.resolveCheckboxFieldValue(data);
  } else if (entity.type === 'schedule') {
    return FieldValueResolver.resolveScheduleFieldValue(entity, data);
  } else if (entity.type === 'date-picker') {
    return FieldValueResolver.resolveDatePickerFieldValue(data);
  } else if (entity.type === 'slider') {
    return FieldValueResolver.resolveSliderFieldValue(entity, data);
  } else if (entity.type === 'locations') {
    return FieldValueResolver.resolveLocationFieldValue(entity, data);
  } else if (entity.type === 'select') {
    return FieldValueResolver.resolveSelectFieldValue(
      entity,
      data,
      stageData,
      extraData,
      stagesData,
    );
  } else if (['stakeholder-list', 'object-list'].includes(entity.type)) {
    return FieldValueResolver.resolveObjectListFieldValue(entity, data, router);
  } else if (entity.type === 'file') {
    return FieldValueResolver.resolveFileFieldValue(
      entity,
      data,
      stageData,
      stageConfig,
      router,
    );
  }
  return data;
}

export type JoinObjectsOfArray = Array<{
  items: Array<OverviewListInterface>;
  stageName: string;
}>;

function getStatus(entity: any, item: any) {
  if (item.type === 'file') {
    return entity.state;
  } else {
    return 'SUBMITTED';
  }
}

export function joinObjectsOfArray(
  stagesData: Record<string, any>,
  labelObject: Record<string, any>,
  stages: Array<StageInterface>,
  router: NextRouter,
  extraData?: Record<string, Record<string, any>>,
): JoinObjectsOfArray {
  console.log(extraData,"extraData")
  const newList: any = [];
  Object.keys(stagesData)
    .filter(stageName => stages.find(stage => stage.name === stageName))
    .forEach(stageName => {
      const stage = stagesData[stageName];
      const stageItems: any = [];
      Object.keys(stage).forEach(groupName => {
        const group = stage[groupName];
        Object.keys(group).forEach(entityName => {
          const entity = group[entityName];
          const item = labelObject[stageName][groupName][entityName];
          // generate and push new item
          if (item) {
            stageItems.push({
              title: item.label,
              value: resolveFieldValue(
                entity,
                item,
                stagesData[stageName],
                router,
                stages.find(({ name }) => name === stageName),
                stagesData,
                extraData,
              ),
              status: getStatus(entity, item),
              type: item.type,
              name: entityName,
            });
          }
        });
      });
      newList.push({
        items: stageItems,
        stageName,
      });
    });

  return newList;
}

export default joinObjectsOfArray;
