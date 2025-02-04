import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NormalizedFace } from '@tensorflow-models/blazeface';
import WebcamCard from '../webcam/WebcamCard/WebcamCard';
import PhotoCaptureButton from '../webcam/WebcamButtons/PhotoCaptureButton';
import styles from '../CommonWebcamStageStyles.module.scss';
import SmartCamera from '../SmartCamera/container/SmartCamera';
import WebcamLoading from '../webcam/WebcamLoading/WebcamLoading';
import useUserMediaErrorPopup from '../webcam/useUserMediaErrorPopup';
import Button from '../../Button/Button';
import useCapturePhoto from '../webcam/useCapturePhoto';
import { FaceValidationStatus, SmartCameraHandler } from '../SmartCamera/types';
import dataURLtoFile from '../../../lib/dataURLtoFile';
import { BuiltInStageProps } from '../../../interfaces/builtInStages.interface';
import HelpPopup from '../Ui/Popup/HelpPopup/HelpPopup';
import PhotoStageWebcamOverlay from './PhotoStageWebcamOverlay/PhotoStageWebcamOverlay';
import MessagePopup from '../Ui/Popup/MessagePopup/MessagePopup';
import { RootState } from '../../../store/rootReducer';
import faceValidator from '../SmartCamera/utils/faceValidator';

function Selfie({ stage, actions: { submitForm } }: BuiltInStageProps) {
  const [photoCaptureHelpPopup, setPhotoCaptureHelpPopup] = useState(true);
  const [error, setError] = useState(false);
  const webcam = useRef<SmartCameraHandler>(null);
  const loading = useSelector(({ stages }: RootState) => stages.loading);
  const { onDataAvailable, reset, dataSrc, captureImage } = useCapturePhoto(
    webcam,
  );
  function capture() {
    setError(false);
    captureImage();
  }
  const {
    userMediaError,
    closeUserMediaErrorPopup,
    onUserMediaError,
    id,
  } = useUserMediaErrorPopup();

  async function uploadImage() {
    const form = new FormData();
    form.append('file', dataURLtoFile(dataSrc, `image.jpeg`));
    try {
      await submitForm({ mappedData: form });
    } catch (err) {
      if (
        err.response?.data?.exceptionMessage ===
        'FACE_RECOGNITION_IMAGE_NOT_MATCH'
      ) {
        reset();
        setError(true);
      }
    }
  }

  function onCloseHandler() {
    setPhotoCaptureHelpPopup(false);
  }

  const [
    faceValidationStatus,
    setFaceValidationStatus,
  ] = useState<FaceValidationStatus | null>(null);
  const currentStatus = useRef<FaceValidationStatus | null>(null);
  const predictionsRef = useRef<NormalizedFace[] | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const validateFaces = (
    predictions: NormalizedFace[],
    video: HTMLVideoElement,
  ) => {
    const faceValidatorStatus = faceValidator(predictions, video, 0.9975);
    const isWebcamReady = webcam.current?.video?.readyState === 4;

    if (isWebcamReady) {
      if (!currentStatus.current) {
        setFaceValidationStatus(faceValidatorStatus);
        currentStatus.current = faceValidatorStatus;
      } else if (faceValidatorStatus.type === currentStatus.current.type) {
        if (
          'message' in faceValidatorStatus &&
          'message' in currentStatus.current &&
          faceValidatorStatus.message !== currentStatus.current.message
        ) {
          setFaceValidationStatus(faceValidatorStatus);
          currentStatus.current = faceValidatorStatus;
        }
      } else {
        setFaceValidationStatus(faceValidatorStatus);
        currentStatus.current = faceValidatorStatus;
      }
    }
  };

  const onFaceDetection = (predictions: NormalizedFace[]) => {
    predictionsRef.current = predictions;
  };
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (predictionsRef.current)
        validateFaces(
          predictionsRef.current,
          webcam.current?.video as HTMLVideoElement,
        );
    }, 300);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const controlsSection = !dataSrc ? (
    <PhotoCaptureButton onClick={capture} disabled={false} />
  ) : (
    <div className={styles.submit}>
      <Button icon="reload" onClick={reset} className={styles.captureAgain}>
        دوباره عکس بگیر
      </Button>
      <Button
        type="primary"
        icon="check"
        onClick={uploadImage}
        loading={loading}
      >
        {loading ? 'ارسال تصویر' : ' تایید تصویر'}
      </Button>
    </div>
  );

  const webcamSection = (
    <>
      {!dataSrc ? (
        <SmartCamera
          ref={webcam}
          onDataAvailable={onDataAvailable}
          onUserMediaError={onUserMediaError}
          withFaceDetection
          faceDetectionOptions={{
            drawPredictions: true,
            minFaceDetectionProbability: 0.96,
          }}
          onFaceDetection={onFaceDetection}
          audio={false}
          loading={<WebcamLoading />}
          overlay={<PhotoStageWebcamOverlay />}
          status={faceValidationStatus}
        />
      ) : (
        <div className={styles.image}>
          <img src={dataSrc} alt="captured" />
        </div>
      )}
    </>
  );
  return (
    <>
      <span className={styles.groupLabel} data-cy="title">
        {stage.label}
      </span>
      <div className={styles.bodyContainer}>
        <WebcamCard
          key={id}
          Controls={controlsSection}
          Webcam={webcamSection}
        />
        {error && (
          <span className={styles.errorMessage}>
            تصویر ارسالی مطابق تصویر ثبت شده در سامانه ثبت احوال نیست، دوباره
            تلاش کنید
          </span>
        )}
      </div>
      <HelpPopup
        onClose={onCloseHandler}
        visible={photoCaptureHelpPopup}
        imagePath="/static/images/photo-kyc-help.webp"
        description="لطفا صورت خود را کاملا داخل کادر نگه دارید و هیچ قسمتی از صورت خود را نپوشانید (از ماسک، کلاه، عینک یا موارد مشابه استفاده نکنید)"
        title="راهنمای گرفتن عکس سلفی"
        buttonText="متوجه شدم"
        timer={5}
      />
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

export default Selfie;
