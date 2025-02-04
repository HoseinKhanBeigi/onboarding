import React, { useState, useEffect } from 'react';
import style from './OtpTimer.scss';
import { Utils } from '../../lib/utils';
import { useInterval } from '../useInterval';

interface OtpTimer {
  expireDate: number;
  showResend(): void;
}
export default function OtpTimer({ expireDate, showResend }: OtpTimer) {
  const [timer, setTimer] = useState(Utils.calculateRemainingTime(expireDate));
  const minutes = Utils.makeItTwoDigits(Math.floor(timer / 60));
  const remainingTime = Utils.makeItTwoDigits(timer % 60, ` ${minutes}:`, ' ');
  const resetInterval = useInterval(
    () => {
      setTimer(timer - 1);
    },
    1000,
    () => timer <= 0,
  );

  useEffect(() => {
    setTimer(Utils.calculateRemainingTime(expireDate));
    resetInterval(() => {
      setTimer(timer - 1);
    });
  }, [expireDate]);

  useEffect(() => {
    if (timer <= 0) {
      showResend();
    }
  }, [timer]);
  return <div className={style.otpTimerContainer}>{remainingTime}</div>;
}
