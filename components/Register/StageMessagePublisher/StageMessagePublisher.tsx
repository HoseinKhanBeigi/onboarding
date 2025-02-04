import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal } from 'antd';
import { MessagePopupInterface } from '../../../interfaces/stage.interface';
import style from '../Register.scss';
import { StringUtils } from '../../../lib/StringUtils';

interface StageMessagePublisherProps {
  message?: MessagePopupInterface;
}

function StageMessagePublisher({ message }: StageMessagePublisherProps) {
  const [show, toggleShow] = useState(true);
  const timeoutRef = useRef<any>();
  useEffect(() => {
    toggleShow(true);
  }, [message]);
  const isEmpty = useMemo(() => {
    return !(message && message.body);
  }, [message]);

  function closeModal() {
    toggleShow(false);
  }

  useEffect(() => {
    if (!isEmpty) {
      timeoutRef.current = setTimeout(
        () => closeModal(),
        (message?.autoDismissAfter || 10) * 1000,
      );
      return () => {
        clearTimeout(timeoutRef.current);
      };
    }
  }, [false]);

  return (
    <Modal
      className={style.modal}
      title={message?.title}
      visible={!isEmpty && show}
      onCancel={() => closeModal()}
      centered
      footer={
        <Button
          type="primary"
          onClick={closeModal}
          className={style.closeButton}
        >
          {message?.dismissButtonLabel || 'بستن'}
        </Button>
      }
    >
      {!isEmpty && show && (
        <pre className={style.messageBody}>{message?.body}</pre>
      )}
      {StringUtils.isItFilled(message?.file) && (
        <a href={message?.file} rel="noopener noreferrer" target="_blank">
          {message?.fileLabel || 'مشاهده و دانلود'}
        </a>
      )}
    </Modal>
  );
}

export default StageMessagePublisher;
