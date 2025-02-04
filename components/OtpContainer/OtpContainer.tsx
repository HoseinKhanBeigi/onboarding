import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Button, Input } from 'antd';
import style from './OtpContainer.scss';
import { configurableRequest } from '../../lib/configurableRequest';
import { RequestInstance } from '../../store/request';
import { RootState } from '../../store/rootReducer';
import { DataSourceInterface } from '../../interfaces/entity.interface';
import OtpTimer from './OtpTimer';
import ErrorUtils from '../../lib/errorUtils';
import {
  CONFIGURATION_FAILURE,
  FAILED_SAVE_STAGE,
} from '../../store/constants';
import { showErrorNotification } from '../../store/globalAction';

export const INVALID_OTP_CODE = 'INVALID_OTP';

interface OtpContainerInterface {
  sendOtpAction: DataSourceInterface;
  submitButtonTitle: string;
  verifyOtp(otp): Promise<any>;
  otpLength: 4 | 5 | 6;
  expireDate: number;
  setCount?: any;
  description?: string;
}
export default function OtpContainer({
  sendOtpAction,
  submitButtonTitle,
  verifyOtp,
  otpLength = 5,
  expireDate,
  setCount,
  description,
}: OtpContainerInterface) {
  const [otp, setOtp] = useState(new Array(otpLength).fill(''));
  const [inProgress, setInProgress] = useState(false);
  const [timerExpireDate, setTimerExpireDate] = useState(
    Date.now() + expireDate,
  );
  const [isEligibleNumber, setIsEligibleNumber] = useState(true);
  const [isDisabled, setDisable] = useState(true);
  const [showResend, setShowResend] = useState(false);
  const router = useRouter();
  const applicationInfo = useSelector(
    ({ application }: RootState) =>
      application.data?.application?.applicationInfo,
  );

  async function sendOtp() {
    setCount(pre => pre + 1);
    setInProgress(true);
    configurableRequest(RequestInstance, sendOtpAction, router, {
      ...applicationInfo,
    })
      .then(() => setShowResend(false))
      .catch((err: any) => {
        if (err) {
          showErrorNotification(
            ErrorUtils.getErrorMessage('REQUEST_KYC_OTP_LOCKED'),
          );
        }
        setShowResend(false);
      })

      .finally(() => setInProgress(false));
  }

  function restartTimer() {
    otp.fill('');
    setOtp([...otp]);
    setTimerExpireDate(Date.now() + expireDate);
    sendOtp();
  }

  useEffect(() => {
    sendOtp();
  }, []);

  function checkEligibleNumber(value) {
    if (Number.isInteger(+value)) {
      setIsEligibleNumber(true);
      return true;
    } else {
      setIsEligibleNumber(false);
      return false;
    }
  }

  function checkPastedNumberValidation(value) {
    if (checkEligibleNumber(value) && value.toString().length === otpLength) {
      return {
        value: value.split(''),
        valid: true,
      };
    } else {
      return {
        value,
        valid: false,
      };
    }
  }

  function OtpOnChangeHandler(event, index) {
    event.preventDefault();
    const { value } = event.target;
    if (checkEligibleNumber(value)) {
      otp[index] = event.target.value;
      setOtp([...otp]);
    } else {
      setOtp(otp);
    }
  }

  useEffect(() => {
    otp.map((item, i) => {
      if (item !== '') {
        setDisable(false);
      } else {
        setDisable(true);
      }
      return item;
    });
  }, [otp]);

  function handleSubmit() {
    if (!inProgress) {
      setInProgress(true);
      const otpString = otp.join('');
      verifyOtp(otpString)
        .catch(error => {
          if (error === INVALID_OTP_CODE) {
            setOtp(new Array(otpLength).fill(''));
          }
        })
        .finally(() => setInProgress(false));
    }
  }

  function handleFocus(event) {
    event.target.select();
  }

  function inputFocus(element) {
    const next = +element.target.id;
    if (
      element.key === 'Delete' ||
      element.key === 'Backspace' ||
      element.key === 'ArrowLeft'
    ) {
      if (next - 1 > -1) {
        element.target.form.elements[next - 1].focus();
      }
    } else if (next < otpLength - 1 && isEligibleNumber) {
      element.target.form.elements[next + 1].focus();
    }
  }

  function handlePaste(event) {
    event.preventDefault();
    const pastedValue = checkPastedNumberValidation(
      event.clipboardData.getData('text'),
    );
    if (pastedValue.valid) {
      setOtp([...pastedValue.value]);
      return true;
    } else {
      return false;
    }
  }

  const showTimer = useMemo(
    () => (
      <OtpTimer
        expireDate={timerExpireDate}
        showResend={() => setShowResend(true)}
      />
    ),
    [timerExpireDate],
  );

  return (
    <div className={style.otpContainer}>
      <p>{description}</p>
      <form className={style.otpForm}>
        <div className={style.otpInputContainer}>
          {otp?.map((item, index) => {
            return (
              <Input
                name={`otp${index + 1}`}
                key={`${index}`}
                type="text"
                autoComplete="off"
                className={style.otpInput}
                value={item}
                onChange={e => OtpOnChangeHandler(e, index)}
                id={`${index}`}
                maxLength={1}
                onKeyUp={e => inputFocus(e)}
                onFocus={handleFocus}
                onPaste={e => handlePaste(e)}
              />
            );
          })}
        </div>
      </form>

      <Button
        loading={inProgress}
        type="primary"
        className={style.esignBtn}
        onClick={handleSubmit}
        disabled={isDisabled}
      >
        {submitButtonTitle}
      </Button>
      {showResend && (
        <div className={style.otpResendWrapper}>
          <Button onClick={restartTimer}>ارسال مجدد</Button>
        </div>
      )}
      {!showResend && (
        <div className={style.otpTimerWrapper}>
          <span>ارسال مجدد کد پس از</span>
          {showTimer}
        </div>
      )}
    </div>
  );
}
