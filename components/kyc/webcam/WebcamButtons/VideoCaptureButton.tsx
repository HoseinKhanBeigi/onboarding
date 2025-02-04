import React, { useLayoutEffect, useRef, useState, useMemo } from 'react';
import classes from 'classnames';
import styles from './CaptureButtons.module.scss';
import Button from '../../../Button/Button';

interface VideoCaptureButtonProps {
  timer: number;
  onClick: () => void;
  onTimerEnd: () => void;
}

function VideoCaptureButton({
  timer,
  onClick,
  onTimerEnd,
}: VideoCaptureButtonProps) {
  const [capturing, setCapturing] = useState(false);
  const [gesturesButtonText, setGesturesButtonText] = useState<string>();
  const gesturesText = ['حرکت اول', 'حرکت دوم', 'حرکت سوم'];
  const svgCircleRef = useRef<SVGCircleElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const onClickHandler = () => {
    setCapturing(true);
    onClick();
  };

  const startTimerAnimation = () => {
    if (svgCircleRef.current) {
      svgCircleRef.current.style.animation = `${styles.timer} ${timer}s linear forwards`;
    }
  };

  const stopTimerAnimation = () => {
    if (svgCircleRef.current) {
      svgCircleRef.current.style.animation = ``;
    }
  };

  useLayoutEffect(() => {
    if (capturing) {
      timerRef.current = setTimeout(() => {
        setCapturing(false);
        onTimerEnd();
      }, timer * 1000);
      startTimerAnimation();
    }
    return () => {
      stopTimerAnimation();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [capturing]);

  const showGestureTurn = useMemo(() => {
    let count = 0;
    let gestureTextTimer;
    if (capturing) {
      setGesturesButtonText(gesturesText[count]);
      gestureTextTimer = setInterval(() => {
        setGesturesButtonText(gesturesText[count + 1]);
        count++;
      }, 4000);
    } else {
      count = 0;
      clearInterval(gestureTextTimer);
    }
  }, [capturing]);

  return (
    <div className={styles.capture}>
      <Button
        type="primary"
        disabled={capturing}
        className={classes(
          styles.capture__button,
          styles.capture__button_video,
        )}
        onClick={onClickHandler}
        icon={capturing ? '' : 'video-camera'}
      >
        {capturing && gesturesButtonText}
      </Button>
      <svg viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#e2e2e2"
          fill="transparent"
          strokeWidth={5}
        />
      </svg>
      <svg viewBox="0 0 100 100" className={styles.timer}>
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#ff4d4f"
          fill="transparent"
          ref={svgCircleRef}
          strokeDasharray={283}
          strokeDashoffset={283}
          strokeLinecap="round"
          strokeWidth={5}
        />
      </svg>
    </div>
  );
}

export default VideoCaptureButton;
