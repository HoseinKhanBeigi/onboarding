import React, { forwardRef, lazy, Suspense, useEffect, useMemo } from 'react';
import Webcam, { WebcamProps } from 'react-webcam';
import getConfig from 'next/config';
import classes from 'classnames';
import styles from './SmartCamera.module.scss';
import {
  FaceDetectionOptions,
  FaceValidationStatus,
  SmartCameraEvents,
  SmartCameraHandler,
} from '../types';
import useSmartCamera from '../hooks/useSmartCamera';

const {
  publicRuntimeConfig: { videoSize },
} = getConfig();

interface OwnProps {
  visible?: boolean;
  withFaceDetection?: boolean;
  overlay?: JSX.Element;
  loading?: JSX.Element;
  faceDetectionOptions?: Partial<FaceDetectionOptions>;
  changeTheMediaSize?: (mediaSize: any) => void;
  status?: FaceValidationStatus | null;
  showStatus?: boolean;
}

type Props = OwnProps & SmartCameraEvents & Partial<WebcamProps>;

const FaceDetection = lazy(() =>
  import('../components/FaceDetection/FaceDetection'),
);

const SmartCamera = forwardRef<SmartCameraHandler, Props>(
  (
    {
      onCaptureStart,
      onCaptureStop,
      onDataAvailable,
      onUserMedia,
      onUserMediaError,
      changeTheMediaSize,
      onFaceDetection,
      overlay,
      faceDetectionOptions,
      loading,
      visible = true,
      withFaceDetection = true,
      status,
      showStatus = true,
      ...otherProps
    }: Props,
    forwardedRef,
  ) => {
    const {
      webcamRef,
      isLoading,
      onUserMediaLoadError,
      onUserMediaLoad,
      onFaceDetectionLoad,
      webcamStyle,
      showOverlay,
      loadFaceDetection,
      mediaSize,
    } = useSmartCamera(
      forwardedRef,
      {
        onCaptureStart,
        onCaptureStop,
        onDataAvailable,
        onUserMediaError,
        onUserMedia,
      },
      withFaceDetection,
    );

    useEffect(() => {
      if ((mediaSize.height || mediaSize.width) && changeTheMediaSize) {
        changeTheMediaSize(mediaSize);
      }
    }, [mediaSize]);

    const videoConstraints = useMemo(() => {
      const identifier = mediaSize.width / mediaSize.height;
      if (identifier > 1.2) {
        return {
          width: Math.max(videoSize.width, videoSize.height),
          height: Math.min(videoSize.width, videoSize.height),
          frameRate: videoSize.frameRate,
        };
      } else if (identifier < 0.8) {
        return {
          width: Math.min(videoSize.width, videoSize.height),
          height: Math.max(videoSize.width, videoSize.height),
          frameRate: videoSize.frameRate,
        };
      } else {
        return {
          width: Math.max(videoSize.width, videoSize.height),
          height: Math.max(videoSize.width, videoSize.height),
          frameRate: videoSize.frameRate,
        };
      }
    }, [mediaSize]);

    return (
      <div className={[styles.webcam, !visible ? styles.hidden : ''].join(' ')}>
        {isLoading && loading}
        <Webcam
          mirrored
          playsInline
          screenshotFormat="image/jpeg"
          minScreenshotWidth={videoConstraints.width || 1280}
          minScreenshotHeight={videoConstraints.height || 720}
          audio={false}
          {...otherProps}
          style={webcamStyle}
          onUserMedia={onUserMediaLoad}
          onUserMediaError={onUserMediaLoadError}
          ref={webcamRef}
          videoConstraints={videoConstraints}
        />
        {showOverlay && <div className={styles.overlay}>{overlay}</div>}
        {showStatus && status && (
          <div className={classes(styles.statusOverlay, styles[status.type])}>
            {status?.message || 'درهمین موقعیت دکمه زیر را فشار دهید'}
          </div>
        )}
        {loadFaceDetection && (
          <Suspense fallback={null}>
            <FaceDetection
              webcamRef={webcamRef}
              onFaceDetection={onFaceDetection}
              onModelLoaded={onFaceDetectionLoad}
              options={faceDetectionOptions}
            />
          </Suspense>
        )}
      </div>
    );
  },
);

export default SmartCamera;
