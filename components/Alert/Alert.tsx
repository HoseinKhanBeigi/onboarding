import React from 'react';
import { Alert as AntAlert } from 'antd';
import './Alert.scss';

interface AlertProps {
  title: string;
  description: string;
}

export default function Alert(props: AlertProps) {
  return (
    <AntAlert
      message={props.title}
      description={props.description}
      type="warning"
      showIcon
      closable
    />
  );
}
