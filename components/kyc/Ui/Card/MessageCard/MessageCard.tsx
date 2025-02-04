import React from 'react';
import { Button } from 'antd';
import styles from './MessageCard.module.scss';
import Card from '../Card';

export interface MessageCardProps {
  imagePath: string;
  title: string;
  description: string;
  onButtonClick?: () => void;
  buttonText?: string;
}

function MessageCard({
  description,
  title,
  imagePath,
  onButtonClick,
  buttonText,
}: MessageCardProps) {
  return (
    <Card className={styles.card}>
      <div className={styles.card__content}>
        <div className={styles.card__image}>
          <img src={imagePath} alt="info_image" />
        </div>
        <div className={styles.card__text}>
          {title && <h2>{title}</h2>}
          <p>{description}</p>
        </div>
        {onButtonClick && (
          <Button type="primary" block onClick={onButtonClick}>
            {buttonText || 'متوجه شدم'}
          </Button>
        )}
      </div>
    </Card>
  );
}
export default MessageCard;
