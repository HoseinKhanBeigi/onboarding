import React, {useEffect, useRef, useState} from 'react';
import {Button} from 'antd';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {NormalizedFace} from '@tensorflow-models/blazeface';
import styles from '../CommonWebcamStageStyles.module.scss';
import WebcamCard from '../webcam/WebcamCard/WebcamCard';
import VideoCaptureButton from '../webcam/WebcamButtons/VideoCaptureButton';
import VideoStageMask from './VideoStageMask/VideoStageMask';
import VideoPlayback from './VideoPlayback/VideoPlayback';
import useUserMediaErrorPopup from '../webcam/useUserMediaErrorPopup';
import SmartCamera from '../SmartCamera/container/SmartCamera';
import dataURLtoFile from '../../../lib/dataURLtoFile';
import {FaceValidationStatus, SmartCameraHandler} from '../SmartCamera/types';
import {BuiltInStageProps} from '../../../interfaces/builtInStages.interface';
import HelpPopup from '../Ui/Popup/HelpPopup/HelpPopup';
import MessagePopup from '../Ui/Popup/MessagePopup/MessagePopup';
import style from '../../FormGenerator/StepGenerator/StepGenerator.scss';
import {RequestInstance} from '../../../store/request';
import {configurableRequest} from '../../../lib/configurableRequest';
import {customGetApplicationById, getApplicationById,} from '../../../store/application/action';
import {RootState} from '../../../store/rootReducer';
import faceValidator from '../SmartCamera/utils/faceValidator';

const captureTime = 12;
interface VideoStageSource {
  blob: Blob;
  base64: string;
}

function Video({ stage, actions: { submitForm } }: BuiltInStageProps) {
  const [handGestures, setHandGestures] = useState<Array<string>>([]);
  const [videoSrc, setVideoSrc] = useState<VideoStageSource | null>(null);
  const [videoCaptureHelpPopup, setVideoCaptureHelpPopup] = useState(true);
  const [error, setError] = useState(false);
  const webcam = useRef<SmartCameraHandler>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const productId = (router.query.product as string).toLowerCase();
  const applicationId = router.query.applicationId as string;
  const [
    orgCode,
    actions,
    loading,
  ] = useSelector(({ branding, stages }: RootState) => [
    branding.data?.orgCode,
    branding.data?.actions,
    stages.loading,
  ]);

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

  function handleDataAvailable(base64Data: string, blob?: Blob) {
    if (blob) {
      setVideoSrc({ base64: base64Data, blob });
    }
  }

  function closeVideoCaptureHelp() {
    setVideoCaptureHelpPopup(false);
  }

  function onCaptureVideoHandler() {
    setError(false);
    webcam.current?.startCapturing();
  }

  function onTimerEndHandler() {
    webcam.current?.stopCapturing();
  }

  async function refreshHandGestures(): Promise<Array<string>> {
    const response: any = await configurableRequest(
      RequestInstance,
      stage?.extraConfig?.actions?.getGestures,
      router,
      {},
    );
    return response;
  }

  async function resetVideo() {
    setVideoSrc(null);
    const newHandGestures = await refreshHandGestures();
    setHandGestures(newHandGestures);
  }

  useEffect(() => {
    resetVideo();
  }, []);

  async function uploadVideo() {
    if (videoSrc?.base64) {
      const form = new FormData();
      form.append('file', dataURLtoFile(videoSrc?.base64, `file.webm`, false));
      try {
        await submitForm({ mappedData: form });
      } catch (err) {
        if (
          ['SELFIE_IMAGE_NOT_UPLOADED', 'KYC_VIDEO_UPLOAD_TIMEOUT'].includes(
            err.response?.data?.exceptionMessage,
          )
        ) {
          if (actions?.getApplication) {
            await dispatch(
              customGetApplicationById(
                actions?.getApplication,
                {
                  orgCode,
                  applicationId,
                },
                router,
              ),
            );
          } else {
            await dispatch(getApplicationById(applicationId, orgCode));
          }
          router.push(
            '/onboarding/[product]/[step]/[applicationId]',
            `/onboarding/${productId}/${stage?.extraConfig?.previousStage}/${applicationId}`,
          );
        } else if (
          [
            'FACE_RECOGNITION_VIDEO_NOT_MATCH',
            'HAND_GESTURE_DETECTION_NOT_MATCH',
          ].includes(err?.response?.data?.exceptionMessage)
        ) {
          resetVideo();
          setError(true);
        }
      }
    }
  }

  const {
    userMediaError,
    closeUserMediaErrorPopup,
    onUserMediaError,
    id,
  } = useUserMediaErrorPopup();

  const controlsSection = !videoSrc ? (
    <VideoCaptureButton
      onClick={onCaptureVideoHandler}
      onTimerEnd={onTimerEndHandler}
      timer={captureTime}
    />
  ) : (
    <div className={styles.submit}>
      <Button
        icon="reload"
        onClick={resetVideo}
        className={styles.captureAgain}
      >
        دوباره ویدیو بگیر
      </Button>
      <Button
        type="primary"
        icon="check"
        onClick={uploadVideo}
        loading={loading}
      >
        {loading ? 'ارسال ویدیو' : 'تایید ویدیو'}
      </Button>
    </div>
  );

  const webcamSection = !videoSrc?.blob ? (
    <SmartCamera
      ref={webcam}
      onDataAvailable={handleDataAvailable}
      onUserMediaError={onUserMediaError}
      audio={false}
      overlay={<VideoStageMask gestures={handGestures} />}
      withFaceDetection
      faceDetectionOptions={{
        drawPredictions: true,
        minFaceDetectionProbability: 0.98,
      }}
      onFaceDetection={onFaceDetection}
      status={faceValidationStatus}
      showStatus={false}
    />
  ) : (
    <VideoPlayback data={videoSrc?.blob} />
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
            ویدئو ارسالی مطابق با عکس شما نبود، دوباره تلاش کنید
          </span>
        )}
      </div>
      <div className={style.descContainer}>
        <pre className={style.description}>
          <img src="/static/images/rule-orange.svg" alt="rule" />
          لطفا پس از شروع فیلمبرداری هر کدام از حرکت های مشخص شده را به ترتیب و
          به مدت چهار ثانیه با دست راست انجام دهید
        </pre>
        <pre className={style.description}>
          <img src="/static/images/rule-orange.svg" alt="rule" />
          حین انجام دادن حرکت ها، مچ دست شما باید قابل رویت باش
        </pre>
      </div>
      <HelpPopup
        onClose={closeVideoCaptureHelp}
        visible={videoCaptureHelpPopup}
        imagePath="/static/images/video-kyc-help.jpg"
        description="لطفا مانند تصویر راهنما، دست خود را کاملا داخل کادر نگه دارید. همچنین صورت شما باید در تصویر بصورت کاملا واضح قرار داشته باشد"
        title="راهنمای گرفتن فیلم سلفی"
        buttonText="متوجه شدم"
        timer={5}
      />
      <MessagePopup
        visible={!videoCaptureHelpPopup && userMediaError}
        onButtonClick={closeUserMediaErrorPopup}
        buttonText="تلاش مجدد"
        imagePath="/static/images/error.png"
        title="خطای دسترسی به دوربین"
        description="ماژول دوربین یافت نشد و یا دسترسی به آن امکان پذیر نمیباشد"
      />
    </>
  );
}

export default Video;
