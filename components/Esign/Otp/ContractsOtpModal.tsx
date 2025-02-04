import { Modal } from 'antd';
import React, { useState } from 'react';
import router from 'next/router';
import OtpContainer, {
  INVALID_OTP_CODE,
} from '../../OtpContainer/OtpContainer';
import style from '../Esign.scss';

export default function ContractsOtpModal({
  stage,
  isEsignOtpModalVisible,
  setIsEsignOtpModalVisible,
  submitForm,
  contractFilesUpload,
}: any) {
  const [count, setCount] = useState();

  const applicationId = router.query.applicationId as string;
  function closeEsignOtpModal() {
    setIsEsignOtpModalVisible(false);
  }
  async function verifyOtp(otp) {
    const contractFiles = [
      ...new Map(
        contractFilesUpload.map(item => [item.documentType, item]),
      ).values(),
    ];
    const data = {
      mappedData: {
        applicationId,
        otp,
        contractFiles,
      },
    };
    try {
      await submitForm(data);
    } catch (error) {
      const exceptionMessage = error?.response?.data?.exceptionMessage;
      if (exceptionMessage === 'INVALID_E_SIGN_OTP') {
        throw INVALID_OTP_CODE;
      }
    }
  }

  return (
    <Modal
      title="Basic Modal"
      visible={isEsignOtpModalVisible}
      onCancel={() => closeEsignOtpModal()}
      centered
      footer={null}
      className={style.otpModalContent}
    >
      <OtpContainer
        sendOtpAction={stage?.extraConfig?.actions?.sendOtp}
        verifyOtp={otp => verifyOtp(otp)}
        setCount={setCount}
        submitButtonTitle="تایید کد و امضای الکترونیکی قراردادها"
        description="کد تایید به شماره سجامی شما ارسال شده است، لطفا کد تایید دریافت شده را وارد کنید"
        otpLength={5}
        expireDate={120000}
      />
    </Modal>
  );
}
