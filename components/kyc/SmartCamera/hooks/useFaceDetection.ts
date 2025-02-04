import { BlazeFaceModel, NormalizedFace } from '@tensorflow-models/blazeface';
import { RefObject, useEffect, useRef } from 'react';
import { FaceDetectionOptions, WebcamRef } from '../types';
import filterPredictions from '../utils/filterPredictions';
import useFaceModel from './useFaceModel';

interface FaceDetectionEvents {
  onFaceDetection?: (predictions: NormalizedFace[]) => void;
  onModelLoaded?: () => void;
}

const useFaceDetection = (
  webcamRef: RefObject<WebcamRef>,
  options: FaceDetectionOptions,
  events?: FaceDetectionEvents,
) => {
  const {
    minFaceDetectionProbability,
    estimateFaceOptions: { annotateBoxes, flipHorizontal, returnTensors },
  } = options;
  const predictionsRef = useRef<NormalizedFace[]>([]);
  const animationFrameRef = useRef<number>();

  const estimateFaces = async (
    model: BlazeFaceModel,
    video: HTMLVideoElement,
  ): Promise<number> => {
    const { videoWidth, videoHeight } = video || {
      videoWidth: 0,
      videoHeight: 0,
    };
    video.width = videoWidth;
    video.height = videoHeight;
    let predictions: NormalizedFace[];
    try {
      predictions = await model.estimateFaces(
        video,
        returnTensors,
        flipHorizontal,
        annotateBoxes,
      );
    } catch {
      predictions = [];
    }

    const filteredPredictions = filterPredictions(
      predictions,
      minFaceDetectionProbability,
    );
    predictionsRef.current = filteredPredictions;
    events?.onFaceDetection && events.onFaceDetection(filteredPredictions);
    return requestAnimationFrame(() => estimateFaces(model, video));
  };

  const [, loadFaceModel] = useFaceModel();

  const onWebcamReady = (callback: () => void) => {
    let timer: number;
    let initialized = false;
    if (webcamRef.current) {
      timer = setInterval(() => {
        if (!initialized) {
          if (webcamRef.current?.video?.readyState === 4) {
            initialized = true;
            callback();
          }
        } else {
          clearInterval(timer);
        }
      });
    }
  };

  useEffect(() => {
    loadFaceModel().then(faceModel => {
      if (events?.onModelLoaded) events.onModelLoaded();
      onWebcamReady(async () => {
        animationFrameRef.current = await estimateFaces(
          faceModel,
          webcamRef.current?.video as HTMLVideoElement,
        );
      });
    });
    return () => {
      if (typeof animationFrameRef.current === 'number') {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return predictionsRef;
};

export default useFaceDetection;
