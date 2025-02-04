import { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import { NormalizedFace } from '@tensorflow-models/blazeface';
import { FaceDetectionOptions, WebcamRef } from '../types';
import drawPredictions from '../utils/drawPredictions';

const useDrawPredictions = (
  predictions: MutableRefObject<NormalizedFace[]>,
  webcamRef: RefObject<WebcamRef>,
  options: FaceDetectionOptions,
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let animation: number;
    let initialized = false;
    let timer: any;
    if (
      options.drawPredictions &&
      canvasRef.current &&
      webcamRef.current?.video
    ) {
      timer = setInterval(() => {
        if (!initialized) {
          initialized = true;
          animation = drawPredictions(
            predictions,
            webcamRef.current?.video as HTMLVideoElement,
            canvasRef.current as HTMLCanvasElement,
            options.estimateFaceOptions,
          );
        } else {
          clearInterval(timer);
        }
      });
    }
    return () => {
      cancelAnimationFrame(animation);
    };
  }, []);

  return canvasRef;
};
export default useDrawPredictions;
