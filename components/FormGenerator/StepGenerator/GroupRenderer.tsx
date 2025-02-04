import React from 'react';
import { GroupInterface } from '../../../interfaces/group.interface';
import style from './StepGenerator.scss';
import EntityRenderer from './EntityRenderer';

interface GroupRendererProps {
  group: GroupInterface;
}

function GroupRenderer({ group }: GroupRendererProps) {
  const {
    name: groupName,
    order: groupOrder,
    label: groupLabel,
    entities: groupEntities,
    descriptions: groupDescriptions,
  } = group;
  const entities = groupEntities.map(entity => (
    <EntityRenderer
      key={`${groupName}-${entity.entity.name}`}
      groupName={groupName}
      entity={entity}
    />
  ));
  const descriptions = groupDescriptions.map(description => (
    <pre
      className={style.description}
      key={description.length}
      data-cy="description"
    >
      <img src="/static/images/rule-orange.svg" alt="rule" />
      {description}
    </pre>
  ));
  // TODO: sort groups by order

  const setOfHiddenEntities = groupEntities.filter(
    item => item.entity.hidden !== true,
  );
  if (setOfHiddenEntities.length === 0) {
    return <></>;
  }

  return (
    <div data-cy={groupName} key={`${groupOrder}-${groupName}`}>
      <div className={`${style.group} col-4`}>
        <span className={style.groupLabel} data-cy="title">
          {groupLabel}
        </span>
        <hr />
        {entities}
      </div>
      <div className={style.descContainer}> {descriptions} </div>
    </div>
  );
}

export default GroupRenderer;
