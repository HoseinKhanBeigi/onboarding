import React, { CSSProperties, FunctionComponent, ReactNode } from 'react';
import classes from 'classnames';
import styles from './Popup.module.scss';
import Backdrop from '../Backdrop/Backdrop';

interface BaseProps {
  visible: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  backdropStyle?: CSSProperties;
}

interface ConditionalProps {
  onCancel?: undefined;
  closeable?: false;
}

export type PopupProps = BaseProps & ConditionalProps;

const Popup: FunctionComponent<PopupProps> = ({
  visible,
  onCancel,
  children,
  closeable = true,
  style,
  className,
  backdropStyle,
}) => {
  if (visible) {
    return (
      <>
        <div
          style={style}
          className={classes(
            styles.popup,
            className,
            visible ? styles.slideIn : styles.slideOut,
            styles.desktop,
          )}
        >
          {children}
        </div>
        <Backdrop
          visible={visible}
          style={backdropStyle}
          onClick={closeable && onCancel ? onCancel : undefined}
        />
      </>
    );
  } else {
    return <></>;
  }
};

export default Popup;
