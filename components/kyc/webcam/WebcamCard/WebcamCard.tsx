import React from 'react';
import styles from './WebcamCard.module.scss';
import Card from '../../Ui/Card/Card';

interface WebcamCardProps {
  Controls: JSX.Element;
  Webcam: JSX.Element;
}

function WebcamCard({ Controls, Webcam }: WebcamCardProps) {
  return (
    <Card className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.webcam}>{Webcam}</div>
        <div className={styles.controls}>{Controls}</div>
      </div>
    </Card>
  );
}

export default WebcamCard;
