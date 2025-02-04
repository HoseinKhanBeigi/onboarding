import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Modal } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import style from './OtpStage.scss';
import OtpContainer, { INVALID_OTP_CODE } from '../OtpContainer/OtpContainer';
import { BuiltInStageProps } from '../../interfaces/builtInStages.interface';

export default function OtpStage({
  stage,
  actions: { submitForm },
}: BuiltInStageProps) {
  const [showModal, setShowModal] = useState(false);
  const [count, setCount] = useState<number>(0);
  const router = useRouter();
  const applicationId = router.query.applicationId as string;

  const openModal = () => {
    setShowModal(true);
  };

  function closeModal() {
    setShowModal(false);
  }

  async function verifyOtp(otp) {
    const data = {
      mappedData: {
        applicationId,
        otp,
      },
    };
    try {
      await submitForm(data);
    } catch (error) {
      const exceptionMessage = error.response?.data?.exceptionMessage;
      if (exceptionMessage === 'SEJAM_INVALID_OTP') {
        throw INVALID_OTP_CODE;
      }
    }
  }

  return (
    <>
      <div className={style.container}>
        <div className={style.imageWrapper}>
          <img src={stage.extraConfig?.icon} alt="icon" />
        </div>
        <p className={style.mainDescription}>
          {stage.extraConfig?.description}
        </p>
        <Button
          type="primary"
          className={style.sendOtpButton}
          onClick={openModal}
        >
          {stage.extraConfig?.sendOtpButtonTitle} <LeftOutlined />
        </Button>
      </div>
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
          setCount={setCount}
          sendOtpAction={stage.extraConfig?.actions?.sendOtp}
          verifyOtp={verifyOtp}
          submitButtonTitle="تایید"
          otpLength={5}
          expireDate={120000}
        />
      </Modal>
    </>
  );
}
