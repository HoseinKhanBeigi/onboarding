import React, { useLayoutEffect } from 'react';
import styles from './LoadingProgress.scss';

interface LoadingProps {
  message: string;
  color?: string;
}

function Loading({ message, color = '#ffffff' }: LoadingProps) {
  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--loading-color', color);
  }, [color]);
  return (
    <div className={styles.container}>
      <div className={styles['loader-5']}>
        <span />
      </div>
      <p className="mt-4" style={{ color }}>
        {message}
      </p>
    </div>
  );
}

export default Loading;
