import React, { useRef, useState } from 'react';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import styles from '../CommonWebcamStageStyles.module.scss';
import SignatureStageWebcamOverlay from './component/SignatureStageWebcamOverlay/SignatureStageWebcamOverlay';
import useCapturePhoto from '../webcam/useCapturePhoto';
import { SmartCameraHandler } from '../SmartCamera/types';
import dataURLtoFile from '../../../lib/dataURLtoFile';
import useUserMediaErrorPopup from '../webcam/useUserMediaErrorPopup';
import WebcamCard from '../webcam/WebcamCard/WebcamCard';
import PhotoCaptureButton from '../webcam/WebcamButtons/PhotoCaptureButton';
import SmartCamera from '../SmartCamera/container/SmartCamera';
import WebcamLoading from '../webcam/WebcamLoading/WebcamLoading';
import { BuiltInStageProps } from '../../../interfaces/builtInStages.interface';
import MessagePopup from '../Ui/Popup/MessagePopup/MessagePopup';
import style from '../../FormGenerator/StepGenerator/StepGenerator.scss';
import { RootState } from '../../../store/rootReducer';

function Signature({ stage, actions: { submitForm } }: BuiltInStageProps) {
  const webcam = useRef<SmartCameraHandler>(null);
  const [error, setError] = useState(false);
  const loading = useSelector(({ stages }: RootState) => stages.loading);
  const { reset, dataSrc, onDataAvailable, captureImage } = useCapturePhoto(
    webcam,
  );

  function capture() {
    setError(false);
    captureImage();
  }

  async function uploadImage() {
    const form = new FormData();
    form.append('file', dataURLtoFile(dataSrc, `file.jpeg`));
    try {
      await submitForm({ mappedData: form });
    } catch (err) {
      if (
        err.response?.data?.exceptionMessage ===
        'HAND_GESTURE_DETECTION_NOT_MATCH'
      ) {
        reset();
        setError(true);
      }
    }
  }
  const {
    onUserMediaError,
    closeUserMediaErrorPopup,
    userMediaError,
    id,
  } = useUserMediaErrorPopup();
  return (
    <>
      <span className={styles.groupLabel} data-cy="title">
        {stage.label}
      </span>
      <div className={styles.bodyContainer}>
        <WebcamCard
          key={id}
          Controls={
            !dataSrc ? (
              <PhotoCaptureButton onClick={capture} disabled={userMediaError} />
            ) : (
              <div className={styles.submit}>
                <Button icon="reload" onClick={reset}>
                  دوباره عکس بگیر
                </Button>
                <Button
                  type="primary"
                  icon="check"
                  onClick={uploadImage}
                  loading={loading}
                >
                  {loading ? 'ارسال امضا' : ' تایید امضا'}
                </Button>
              </div>
            )
          }
          Webcam={
            <>
              {!dataSrc ? (
                <SmartCamera
                  ref={webcam}
                  onDataAvailable={onDataAvailable}
                  onUserMediaError={onUserMediaError}
                  audio={false}
                  loading={<WebcamLoading />}
                  overlay={<SignatureStageWebcamOverlay />}
                />
              ) : (
                <div className={styles.image}>
                  <img src={dataSrc} alt="captured" />
                </div>
              )}
            </>
          }
        />
        {error && (
          <span className={styles.errorMessage}>
            تصویر قابل پردازش نبود، دوباره تلاش کنید
          </span>
        )}
      </div>
      <div className={style.descContainer}>
        <span className={style.description}>
          <img src="/static/images/rule-orange.svg" alt="rule" />
          لطفا امضا خود را مقابل کادر قرار داده و روی دکمه کلیک کنید
        </span>
      </div>
      <MessagePopup
        visible={userMediaError}
        onButtonClick={closeUserMediaErrorPopup}
        buttonText="تلاش مجدد"
        imagePath="/static/images/error.png"
        title="خطای دسترسی به دوربین"
        description="ماژول دوربین یافت نشد و یا دسترسی به آن امکان پذیر نمیباشد"
      />
    </>
  );
}

export default Signature;
