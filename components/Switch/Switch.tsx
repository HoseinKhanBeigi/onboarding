import React from 'react';
import classes from 'classnames';
import { Tooltip } from 'antd';
import style from './Switch.scss';
import { SwitchItemInterface } from '../../interfaces/branding.interface';

interface SwitchProps<T> {
  label: string;
  items: Array<SwitchItemInterface<T>>;
  onChange: (value: T) => void;
  value: T;
}
export default function Switch<T = string | number>({
  items,
  onChange,
  label,
  value,
}: SwitchProps<T>) {
  function setValue(selectedValue: T, disabled) {
    if (!disabled) {
      onChange(selectedValue);
    }
  }
  const renderedItems = items.map(
    ({ label: itemLabel, value: itemValue, disabled, disableDescription }) => {
      if (disabled) {
        return (
          <Tooltip
            key={String(itemValue)}
            placement="topLeft"
            title={disableDescription}
          >
            <span
              className={classes(
                style.disabled,
                value === itemValue ? style.selected : '',
              )}
              onClick={() => setValue(itemValue, disabled)}
            >
              {' '}
              {itemValue}{' '}
            </span>
          </Tooltip>
        );
      }
      return (
        <span
          key={String(itemValue)}
          className={value === itemValue ? style.selected : ''}
          onClick={() => setValue(itemValue, disabled)}
        >
          {' '}
          {itemLabel}{' '}
        </span>
      );
    },
  );

  return (
    <div className={style.container}>
      <span>{label}</span>
      <div className={style.switchBox}>{renderedItems}</div>
    </div>
  );
}
