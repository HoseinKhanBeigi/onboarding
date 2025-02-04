import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import style from './Notice.scss';

interface PendingProps {
  title: string;
  message: string;
  icon?: JSX.Element;
}

function Notice({ title, message, icon }: PendingProps) {
  return (
    <div className={style.bodyContainer}>
      {icon || <UserOutlined className={style.checkIcon} />}
      <div className={style.done}>{title}</div>
      <div className={style.call}>{message}</div>
    </div>
  );
}

export default Notice;
