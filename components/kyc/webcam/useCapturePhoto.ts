import { RefObject, useState } from 'react';
import { SmartCameraHandler } from '../SmartCamera/types';

const useCapturePhoto = (webcamRef: RefObject<SmartCameraHandler>) => {
  const [dataSrc, setDataSrc] = useState<string>('');
  const captureImage = () => webcamRef.current?.captureImage();
  const onDataAvailable = (data: string): void => {
    setDataSrc(data);
  };
  const reset = () => setDataSrc('');
  return { dataSrc, captureImage, reset, onDataAvailable };
};

export default useCapturePhoto;
