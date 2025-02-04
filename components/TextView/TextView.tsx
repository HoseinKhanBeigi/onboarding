import React from 'react';
import style from './TextView.scss';

interface TextViewProps {
  value: string;
  label: string;
}

export default function TextView({ value, label }: TextViewProps) {
  return (
    <div className={style.container}>
      <span className={style.label}>{label}</span>
      <span className={style.value}>{value}</span>
    </div>
  );
}
