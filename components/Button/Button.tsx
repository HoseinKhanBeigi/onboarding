import React from 'react';
import { ButtonProps } from 'antd/lib/button';
import { Button as AntButton } from 'antd';
import classes from 'classnames';
import style from './Button.scss';

export default function Button(props: ButtonProps) {
  return (
    <AntButton {...props} className={classes(style.button, props.className)}>
      {props.children}
    </AntButton>
  );
}
