import React, { CSSProperties } from 'react';
import classes from 'classnames';
import styles from './Card.module.scss';

interface CardProps {
  className?: string;
  style?: CSSProperties;
  title?: string;
  children: any;
}

function Card({ children, className, style, title }: CardProps) {
  return (
    <div
      className={classes(styles.card, className)}
      style={style && { ...style }}
    >
      {title && <div className={styles.card__title}>{title}</div>}
      <div className={styles.card__content}>{children}</div>
    </div>
  );
}

export default Card;
