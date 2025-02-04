import React, { useMemo } from 'react';
import style from './ValueMapView.scss';
import { InitialDataInterface } from '../../interfaces/entity.interface';

interface TextViewProps {
  value: string;
  label: string;
  items: Array<InitialDataInterface>;
}

export default function ValueMapView({ value, label, items }: TextViewProps) {
  const mappedValue = useMemo(() => {
    const result = items.find(item => item.id === value);
    if (result) {
      return result.label;
    }
    return '';
  }, [value]);
  return (
    <div className={style.container}>
      <span className={style.label}>{label}</span>
      <span className={style.value}>{mappedValue}</span>
    </div>
  );
}
