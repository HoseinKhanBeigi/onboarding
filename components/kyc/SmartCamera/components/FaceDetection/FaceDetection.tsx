import React, { FunctionComponent, memo, RefObject } from 'react';
import { NormalizedFace } from '@tensorflow-models/blazeface';
import useFaceDetection from '../../hooks/useFaceDetection';
import styles from './FaceDetection.module.scss';
import { FaceDetectionOptions, WebcamRef } from '../../types';
import useDrawPredictions from '../../hooks/useDrawPredictions';

const defaultFaceDetectionOptions: FaceDetectionOptions = {
  minFaceDetectionProbability: 0.99,
  drawPredictions: false,
  estimateFaceOptions: {
    flipHorizontal: true,
    annotateBoxes: true,
    returnTensors: false,
  },
};

interface OwnProps {
  webcamRef: RefObject<WebcamRef>;
  options?: Partial<FaceDetectionOptions>;
  // eslint-disable-next-line no-unused-vars
  onFaceDetection?: (predictions: NormalizedFace[]) => void;
  onModelLoaded: () => void;
}

type Props = OwnProps;

const FaceDetection: FunctionComponent<Props> = ({
  webcamRef,
  options: _options,
  onFaceDetection,
  onModelLoaded,
}: OwnProps) => {
  const options = {
    ...defaultFaceDetectionOptions,
    ..._options,
    estimateFaceOptions: {
      ...defaultFaceDetectionOptions.estimateFaceOptions,
      ..._options?.estimateFaceOptions,
    },
  };
  const predictions = useFaceDetection(webcamRef, options, {
    onFaceDetection,
    onModelLoaded,
  });
  const canvasRef = useDrawPredictions(predictions, webcamRef, options);
  return options.drawPredictions ? (
    <canvas ref={canvasRef} className={styles.canvas} />
  ) : null;
};

export default memo(FaceDetection, () => true);
