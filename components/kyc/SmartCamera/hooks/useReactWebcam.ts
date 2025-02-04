import { useRef } from 'react';
import blobToBase64 from '../utils/base64/blobToBase64';
import { WebcamDimensions, WebcamRef } from '../types';
import { useUserAgent } from '../../../useUserAgent';

declare let MediaRecorder: any;
declare type BlobEvent = any;

const useReactWebcam = () => {
  const isCapturing = useRef(false);
  const webcamRef = useRef<WebcamRef>(null);
  const mediaRecorderRef = useRef<any>();
  const userAgentData = useUserAgent();
  const recordedChunks = useRef<Blob | null>(null);

  const captureImage = (screenshotDimensions?: WebcamDimensions) => {
    const result = webcamRef.current?.getScreenshot(screenshotDimensions);
    if (webcamRef.current?.onDataAvailable) {
      webcamRef.current.onDataAvailable(result as string);
    }
    return result;
  };

  const handleDataAvailable = async ({ data }: BlobEvent) => {
    if (data.size > 0) {
      recordedChunks.current = data;
      if (webcamRef.current?.onDataAvailable) {
        const base64 = await blobToBase64(data);
        webcamRef.current.onDataAvailable(base64, data);
      }
    }
  };

  const startCaptureVideo = () => {
    if (webcamRef.current && !isCapturing.current) {
      isCapturing.current = true;
      let mediaRecorderConfig = {
        mimeType: 'video/webm',
      };
      if (
        userAgentData.browserType.isIOS ||
        userAgentData.browserType.isSafari
      ) {
        if (MediaRecorder.isTypeSupported('video/mp4')) {
          mediaRecorderConfig = {
            mimeType: 'video/mp4',
          };
        }
      }
      mediaRecorderRef.current = new MediaRecorder(
        webcamRef.current.stream as MediaStream,
        mediaRecorderConfig,
      );
      mediaRecorderRef.current.addEventListener(
        'dataavailable',
        handleDataAvailable,
      );
      mediaRecorderRef.current.start();
      if (webcamRef.current.onCaptureStart) webcamRef.current.onCaptureStart();
    }
  };

  const stopCaptureVideo = () => {
    if (webcamRef.current && isCapturing.current) {
      mediaRecorderRef.current?.stop();
      isCapturing.current = false;
      if (webcamRef.current?.onCaptureStop) {
        webcamRef.current.onCaptureStop();
      }
    }
  };

  return {
    captureImage,
    startCaptureVideo,
    stopCaptureVideo,
    webcamRef,
  };
};
export default useReactWebcam;
