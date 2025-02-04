import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Modal, Spin } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import style from './FetchSejamWithPreview.scss';
import OtpContainer, { INVALID_OTP_CODE } from '../OtpContainer/OtpContainer';
import { BuiltInStageProps } from '../../interfaces/builtInStages.interface';
import { configurableRequest } from '../../lib/configurableRequest';
import { RequestInstance } from '../../store/request';
import { PreviewSejamData } from './PreviewSejamData';
import { logout } from '../ActionBar/LogoutButton/LogoutButton';
import IconsReset from '../IconReset';
import { abstractConfigurableRequest } from '../../lib/useConfigurableRequest';
import { showErrorNotification } from '../../store/globalAction';
import ErrorUtils from '../../lib/errorUtils';

export default function FetchSejamWithPreview({
  stage,
  actions: { submitForm },
}: BuiltInStageProps) {
  const [fetched, setFetched] = useState(false);
  const [fetchedData, setFetchedData] = useState<Record<string, any>>();
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [captchaImageSrc, setCaptchaImageSrc] = useState<string>('');
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string>('');
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [disable, setDisable] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const inputRef: any = useRef();
  const router = useRouter();
  const { applicationId, product } = router.query;
  const [loading, setLoading] = useState(false);

  const openModal = async () => {
    if (stage.extraConfig?.actions?.verifyCaptcha) {
      try {
        const data = await configurableRequest(
          RequestInstance,
          stage.extraConfig?.actions?.verifyCaptcha,
          router,
          {
            captchaCode,
            captchaValue: inputRef.current.state?.value,
          },
        );
        setShowModal(true);
      } catch (error) {
        showErrorNotification(ErrorUtils.getErrorMessage('CAPTCHA_IS_WRONG'));
        closeModal();
      }
    } else {
      setShowModal(true);
    }
  };

  function closeModal() {
    setShowModal(false);
  }

  async function verifyOtp(otp) {
    try {
      const data = await configurableRequest(
        RequestInstance,
        stage.extraConfig?.actions?.verifyOtp,
        router,
        {
          applicationId,
          otp,
        },
      );

      setFetchedData(data as any);
      setFetched(true);
      closeModal();
    } catch (error) {
      const exceptionMessage = error.response?.data?.exceptionMessage;
      showErrorNotification(ErrorUtils.getErrorMessage(exceptionMessage));
      // if (exceptionMessage === 'SEJAM_INVALID_OTP') {
      //   throw INVALID_OTP_CODE;
      // }
    }
  }

  async function getCaptchImage() {
    setLoadingCaptcha(true);
    try {
      const response = await configurableRequest(
        RequestInstance,
        stage.extraConfig?.actions?.captcha,
        router,
        {
          applicationId,
        },
        {
          responseType: 'blob',
        },
      );
      setCaptchaCode(response.captchacode);
      setCaptchaImageSrc(URL.createObjectURL(response.res));
    } catch (error) {
      // const exceptionMessage = error.response?.data?.exceptionMessage;
      // if (exceptionMessage === 'SEJAM_INVALID_OTP') {
      //   throw INVALID_OTP_CODE;
      // }
    }
    setLoadingCaptcha(false);
  }

  async function submit() {
    try {
      const data = {
        mappedData: {
          applicationId,
        },
      };
      setLoading(true);
      await submitForm(data);
    } finally {
      setLoading(false);
    }
  }

  function reject() {
    setShowRejectModal(true);
  }

  function onLogout() {
    logout(router, 'onboarding', product as string);
  }

  useEffect(() => {
    if (stage.extraConfig?.actions?.captcha) {
      getCaptchImage();
    }
  }, []);

  return (
    <>
      {!fetched && (
        <div className={style.container}>
          <div className={style.imageWrapper}>
            <img src={stage.extraConfig?.icon} alt="icon" />
          </div>
          <p className={style.mainDescription}>
            {stage.extraConfig?.description}
          </p>
          {stage.extraConfig?.actions?.captcha && (
            <>
              <div className={style.captcha__image}>
                <Input
                  placeholder="کد امنیتی را وارد کنید"
                  type="text"
                  autoComplete="off"
                  ref={inputRef}
                  onChange={e => {
                    if (e.target.value) {
                      setDisable(false);
                    } else {
                      setDisable(true);
                    }
                  }}
                />
                <Spin
                  spinning={loadingCaptcha}
                  className={style.captcha__image}
                >
                  <img src={captchaImageSrc} alt="captcha" />
                </Spin>
                <IconsReset onClick={getCaptchImage} />
              </div>
            </>
          )}
          <Button
            type="primary"
            className={style.sendOtpButton}
            onClick={openModal}
            disabled={stage.extraConfig?.actions?.captcha ? disable : false}
          >
            {stage.extraConfig?.sendOtpButtonTitle} <LeftOutlined />
          </Button>
        </div>
      )}
      {fetched && (
        <div className={style.container}>
          <div className={style.imageWrapper}>
            <img src={stage.extraConfig?.icon} alt="icon" />
          </div>
          <p className={style.mainDescription}>
            {stage.extraConfig?.previewDescription}
          </p>

          <PreviewSejamData data={fetchedData} />
          <Button
            type="primary"
            className={style.rejectButton}
            loading={loading}
            onClick={reject}
          >
            عدم تایید
          </Button>
          <Button
            type="primary"
            className={style.sendOtpButton}
            loading={loading}
            onClick={submit}
          >
            ثبت و ادامه <LeftOutlined />
          </Button>
        </div>
      )}
      <Modal
        title="Basic Modal"
        visible={showModal}
        onCancel={closeModal}
        centered
        footer={null}
        className={style.otpModalContent}
      >
        <p className={style.otpModalBody}>
          {stage.extraConfig?.otpModalDescription}
        </p>
        <OtpContainer
          sendOtpAction={stage.extraConfig?.actions?.sendOtp}
          verifyOtp={verifyOtp}
          setCount={setCount}
          submitButtonTitle="تایید"
          otpLength={5}
          expireDate={count > 2 ? 360000 : 180000}
        />
      </Modal>
      <Modal
        title="Reject confirmation"
        visible={showRejectModal}
        centered
        footer={null}
        className={style.otpModalContent}
      >
        <p className={style.otpModalBody}>
          لطفا به
          <a href="https://sejam.ir"> سامانه سجام </a>
          مراجعه کرده و اطلاعات را اصلاح کنید و سپس برای ادامه فرآیند تلاش کنید
        </p>
        <Button
          type="primary"
          className={style.rejectButton}
          loading={loading}
          onClick={onLogout}
        >
          خروج
        </Button>
      </Modal>
    </>
  );
}
