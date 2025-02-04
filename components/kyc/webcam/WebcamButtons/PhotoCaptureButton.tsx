import React from 'react';
import styles from './CaptureButtons.module.scss';
import Button from '../../../Button/Button';

interface PhotoCaptureButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

function PhotoCaptureButton({ onClick, disabled }: PhotoCaptureButtonProps) {
  return (
    <Button
      type="primary"
      className={styles.capture__button}
      disabled={disabled}
      onClick={onClick}
      icon="camera"
    />
  );
}

export default PhotoCaptureButton;
