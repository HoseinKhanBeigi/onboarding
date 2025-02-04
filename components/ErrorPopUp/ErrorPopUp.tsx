import React from 'react';
import { Button, Modal } from 'antd';
import style from './ErrorPopUp.scss';

interface ErrorPopUpInterface {
  visible: boolean;
  confirmModal?: () => void;
  cancelModal: () => void;
  title?: string;
  buttonTitle?: string;
}

const ErrorPopUp = ({
  visible,
  title,
  cancelModal,
  confirmModal,
  buttonTitle,
}: ErrorPopUpInterface) => {
  return (
    <Modal
      width={480}
      className={style.modal}
      closable={false}
      title={title}
      visible={visible}
      onOk={() => (confirmModal ? confirmModal() : cancelModal())}
      onCancel={() => cancelModal()}
      footer={[
        <Button
          block
          key="submit"
          type="primary"
          className={style.modalButton}
          onClick={() => (confirmModal ? confirmModal() : cancelModal())}
        >
          {buttonTitle}
        </Button>,
      ]}
    >
      <div className={style.errorMessage}>
        <img src="/static/images/error.svg" alt="error" />
        <div className={style.alertTitle}>
          این کد ملی مربوط به حساب شخص دیگری در کیان است
        </div>
        <div className={style.alertDesc}>
          اگر با این کد ملی قبلا ثبت نام کرده‌اید، با نام کاربری و کلمه عبور خود
          وارد شوید. اگر کد ملی برای شماست ولی حسابی باز نکرده‌اید با پشتیبانی
          تماس حاصل فرمایید.
        </div>
      </div>
    </Modal>
  );
};

export default ErrorPopUp;
