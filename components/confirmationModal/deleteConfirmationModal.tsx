import React from 'react';
import {Button, Modal} from 'antd';
import style from './confirmationModal.scss';

interface ConfirmationModalInterface {
  onConfirm: () => void;
  show: boolean;
  onClose: () => void;
  title: string;
  description: string;
}
function DeleteConfirmationModal({
  onConfirm,
  show,
  onClose,
  title,
  description,
}: ConfirmationModalInterface) {
  return (
    <div className={style.modalContainer}>
      <Modal
        visible={show}
        onCancel={onClose}
        centered
        footer={null}
        className={style.mainModal}
      >
        {show && (
          <div className={style.pipeNameContainer}>
            <div className={style.confirmTitle}>
              <span>{title}</span>
            </div>
            <div className={style.warningText}>هشدار!</div>
            <div className={style.description}>
              <div className={style.confirmLabel}>
                آیا از حذف این مورد اطمینان دارید؟
              </div>
            </div>
            <div className={style.modalBtnWrapper}>
              <Button
                onClick={onClose}
                type="link"
                className={style.cancelButton}
              >
                <span>لغو</span>
              </Button>
              <Button
                onClick={onConfirm}
                type="primary"
                className={style.createButton}
              >
                <span>حذف</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default DeleteConfirmationModal;
