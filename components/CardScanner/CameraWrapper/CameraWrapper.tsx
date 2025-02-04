import React, {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import Webcam, { WebcamProps } from 'react-webcam';
import getConfig from 'next/config';
import styles from './CameraWrapper.scss';
import { WebcamDimensions, WebcamRef } from '../../kyc/SmartCamera/types';
import { CameraWrapperEvents, CameraWrapperHandler } from './index';

const {
  publicRuntimeConfig: { videoSize },
} = getConfig();

interface CameraWrapperProps extends Partial<WebcamProps> {
  visible?: boolean;
  withFaceDetection?: boolean;
  overlay?: JSX.Element;
  loading?: JSX.Element;
  changeTheMediaSize?: (mediaSize: any) => void;
  onUserMedia?: any;
  onUserMediaError?: any;
  className?: string;
}

type Props = CameraWrapperProps & CameraWrapperEvents;

function CameraWrapper(
  {
    onUserMedia,
    onUserMediaError,
    changeTheMediaSize,
    loading,
    visible = true,
    className,
    ...otherProps
  }: CameraWrapperProps,
  forwardedRef,
) {
  const [userMediaError, setUserMediaError] = useState(false);
  const webcamRef = useRef<WebcamRef>(null);

  const captureImage = (screenshotDimensions?: WebcamDimensions) => {
    const result = webcamRef.current?.getScreenshot(screenshotDimensions);
    if (forwardedRef.current?.onDataAvailable) {
      forwardedRef.current.onDataAvailable(result as string);
    }
    return result;
  };

  useImperativeHandle(
    forwardedRef,
    () => ({
      captureImage,
      video: webcamRef.current?.video,
    }),
    [],
  );

  const [userMediaLoading, setUserMediaLoading] = useState(true);

  const [mediaSize, setMediaSize] = useState({ height: 0, width: 0 });

  function checkIfMediaStreamIsLandscape(mediaStream: MediaStream) {
    setMediaSize({
      height: mediaStream.getVideoTracks()[0].getSettings().height || 0,
      width: mediaStream.getVideoTracks()[0].getSettings().width || 0,
    });
  }

  const onUserMediaLoad = useCallback(
    (stream: MediaStream) => {
      checkIfMediaStreamIsLandscape(stream);
      setUserMediaLoading(false);
      setUserMediaError(false);
      if (onUserMedia) onUserMedia(stream);
    },
    [onUserMedia],
  );

  const onUserMediaLoadError = useCallback(
    (_error: string | DOMException) => {
      setUserMediaLoading(false);
      setUserMediaError(true);
      if (onUserMediaError) onUserMediaError(_error);
    },
    [onUserMediaError],
  );

  const isLoading = !userMediaError && userMediaLoading;

  const webcamStyle = useMemo<CSSProperties>(
    () => ({
      opacity: Number(!isLoading),
      visibility: isLoading ? 'hidden' : 'visible',
    }),
    [isLoading],
  );

  useEffect(() => {
    if ((mediaSize.height || mediaSize.width) && changeTheMediaSize) {
      changeTheMediaSize(mediaSize);
    }
  }, [mediaSize]);

  const videoConstraints = useMemo(
    () => ({
      width: mediaSize.width || 1920,
      height: mediaSize.width || 1080,
      facingMode: { ideal: 'environment' },
      frameRate: videoSize.frameRate,
    }),
    [mediaSize],
  );

  return (
    <div
      className={[styles.webcam, className, !visible ? styles.hidden : ''].join(
        ' ',
      )}
    >
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
    </div>
  );
}

export default forwardRef<CameraWrapperHandler, Props>(CameraWrapper);
