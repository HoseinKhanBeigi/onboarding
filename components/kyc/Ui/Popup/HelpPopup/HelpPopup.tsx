import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import classes from 'classnames';
import commonStyles from '../CommonStyles.module.scss';
import ownStyles from './HelpPopup.module.scss';
import style from '../../../../Esign/Esign.scss';

interface HelpPopupProps {
  onClose: () => void;
  visible: boolean;
  description: string;
  title: string;
  buttonText: string;
  loading?: boolean;
  imagePath: string;
  timer?: number;
}

function HelpPopup({
  onClose,
  visible,
  buttonText,
  title,
  description,
  loading,
  imagePath,
  timer,
}: HelpPopupProps) {
  const [time, setTime] = useState(timer);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    if (time && visible) {
      timeout = setTimeout(() => {
        interval = setInterval(() => {
          setTime(prevTime => {
            if (!((prevTime as number) - 1)) {
              clearInterval(interval);
              clearTimeout(timeout);
            }
            return (prevTime as number) - 1;
          });
        }, 1000);
      }, 300);
    }
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [visible]);
  return (
    <Modal
      title="Basic Modal"
      visible={visible}
      onCancel={onClose}
      closable={!time}
      centered
      className={style.modalContent}
      footer={[
        <Button
          type="primary"
          onClick={onClose}
          loading={loading}
          disabled={!!time}
        >
          {time || buttonText}
        </Button>,
      ]}
    >
      {visible && (
        <>
          <div className={ownStyles.media}>
            <div>
              <img alt="popup" src={imagePath} />
            </div>
          </div>
          <div className={classes(commonStyles.container, ownStyles.container)}>
            <p>{description} </p>
          </div>
        </>
      )}
    </Modal>
  );
}

export default HelpPopup;
