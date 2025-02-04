import React, { CSSProperties } from 'react';
import classes from 'classnames';
import styles from './Backdrop.module.scss';

interface BackdropProps {
  visible: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

function Backdrop({ visible, onClick, style }: BackdropProps) {
  return (
    <div
      className={classes(
        styles.backdrop,
        visible ? styles.fadeIn : styles.fadeOut,
      )}
      style={style}
      onClick={onClick}
    />
  );
}

export default Backdrop;
