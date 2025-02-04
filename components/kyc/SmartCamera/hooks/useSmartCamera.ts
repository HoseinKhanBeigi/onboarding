import {
  CSSProperties,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { SmartCameraEvents, SmartCameraHandler } from '../types';
import useReactWebcam from './useReactWebcam';

const useSmartCamera = (
  handlerRef: Ref<SmartCameraHandler>,
  events: SmartCameraEvents,
  withFaceDetection: boolean,
) => {
  const [userMediaLoading, setUserMediaLoading] = useState(true);
  const [faceDetectionLoading, setFaceDetectionLoading] = useState(
    withFaceDetection,
  );
  const [userMediaError, setUserMediaError] = useState(false);
  const [mediaSize, setMediaSize] = useState({ height: 0, width: 0 });

  function checkIfMediaStreamIsLandscape(mediaStream: MediaStream) {
    setMediaSize({
      height: mediaStream.getVideoTracks()[0].getSettings().height || 0,
      width: mediaStream.getVideoTracks()[0].getSettings().width || 0,
    });
  }

  const {
    webcamRef,
    startCaptureVideo,
    stopCaptureVideo,
    captureImage,
  } = useReactWebcam();

  useEffect(() => {
    (function bindEventListeners() {
      const { onCaptureStop, onCaptureStart, onDataAvailable } = events;
      if (webcamRef.current) {
        webcamRef.current.onCaptureStart = onCaptureStart;
        webcamRef.current.onCaptureStop = onCaptureStop;
        webcamRef.current.onDataAvailable = onDataAvailable;
      }
    })();
  }, []);

  useImperativeHandle(
    handlerRef,
    () => ({
      startCapturing: startCaptureVideo,
      stopCapturing: stopCaptureVideo,
      captureImage,
      video: webcamRef.current?.video,
    }),
    [],
  );

  const onUserMediaLoad = useCallback(
    (stream: MediaStream) => {
      checkIfMediaStreamIsLandscape(stream);
      setUserMediaLoading(false);
      setUserMediaError(false);
      if (events.onUserMedia) events.onUserMedia(stream);
    },
    [events.onUserMedia],
  );

  const onFaceDetectionLoad = () => {
    setFaceDetectionLoading(false);
  };

  const onUserMediaLoadError = useCallback(
    (_error: string | DOMException) => {
      setUserMediaLoading(false);
      setUserMediaError(true);
      if (events.onUserMediaError) events.onUserMediaError(_error);
    },
    [events.onUserMediaError],
  );

  const isLoading =
    !userMediaError && (userMediaLoading || faceDetectionLoading);

  const webcamStyle = useMemo<CSSProperties>(
    () => ({
      opacity: Number(!isLoading),
      visibility: isLoading ? 'hidden' : 'visible',
    }),
    [isLoading],
  );

  const showOverlay = !userMediaError && !isLoading;

  const loadFaceDetection = typeof window !== 'undefined' && withFaceDetection;

  return {
    onUserMediaLoad,
    onUserMediaLoadError,
    isLoading,
    webcamRef,
    webcamStyle,
    onFaceDetectionLoad,
    showOverlay,
    loadFaceDetection,
    mediaSize,
  };
};
export default useSmartCamera;
