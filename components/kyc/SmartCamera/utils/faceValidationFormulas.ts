import { NormalizedFace } from '@tensorflow-models/blazeface';
import { Tensor2D } from '@tensorflow/tfjs-core';
import { FaceValidationMessages, FaceValidationWarning } from '../types';

type Orientation = 'landscape' | 'portrait';

type Warning = FaceValidationWarning['message'] | false;

const orientationsFactor: Record<Orientation, number> = {
  landscape: 3,
  portrait: 2.75,
};

const faceValidationFormulas = (
  predictions: NormalizedFace,
  video: HTMLVideoElement,
): {
  validateFaceDistance: () => Warning;
  validateFaceAngle: () => Warning;
  validateFaceCentrality: () => Warning;
} => {
  const [
    eyeRight,
    eyeLeft,
    nose,
    mouth,
    earRight,
    earLeft,
  ]: any = predictions.landmarks;
  const { videoWidth, videoHeight } = video || {
    videoWidth: 0,
    videoHeight: 0,
  };
  const videoOrientation: Orientation =
    videoWidth - videoHeight > 0 ? 'landscape' : 'portrait';
  const videoCenterX = videoWidth / 2;
  const videoCenterY = videoHeight / 2;

  const placeholderHeadEdge = (
    factor: number,
    orientation: Orientation,
  ): number =>
    orientation === 'landscape' ? videoHeight / factor : videoWidth / factor;

  const validateFaceCentrality = (): Warning => {
    const centerBoundX = videoWidth / 2 / 10;
    const centerBoundY = videoHeight / 2 / 10;
    const isDistancedFromCenterX =
      eyeLeft[0] > videoCenterX + centerBoundX ||
      eyeRight[0] < videoCenterX - centerBoundX ||
      earRight[0] > videoWidth ||
      earLeft[0] < 0;

    const isDistancedFromCenterY =
      eyeRight[1] > videoCenterY + centerBoundY ||
      eyeLeft[1] > videoCenterY + centerBoundY ||
      mouth[1] < videoCenterY - centerBoundY ||
      eyeRight[1] < 0 ||
      earLeft[1] < 0 ||
      mouth[1] > videoHeight;
    if (isDistancedFromCenterX) {
      return FaceValidationMessages.OUT_OF_FRAME;
    }
    if (isDistancedFromCenterY) {
      return FaceValidationMessages.OUT_OF_FRAME;
    }
    return false;
  };

  const validateFaceDistance = (): Warning => {
    const earsDistance = earRight[0] - earLeft[0];
    const isFaceTooFar =
      earsDistance <
      placeholderHeadEdge(
        orientationsFactor[videoOrientation] - 0.25,
        videoOrientation,
      );
    const isFaceTooClose =
      earRight[0] - videoCenterX >
        placeholderHeadEdge(
          orientationsFactor[videoOrientation] + 1,
          videoOrientation,
        ) &&
      videoCenterX - earLeft[0] >
        placeholderHeadEdge(
          orientationsFactor[videoOrientation] + 1,
          videoOrientation,
        );
    if (isFaceTooFar) {
      return FaceValidationMessages.FAR_FACE;
    }
    if (isFaceTooClose) {
      return FaceValidationMessages.CLOSE_FACE;
    }
    return false;
  };

  const validateFaceAngle = (): Warning => {
    const isFaceRotatedX =
      Math.abs(
        Math.abs(earLeft[0] - eyeLeft[0]) - Math.abs(earRight[0] - eyeRight[0]),
      ) > Math.abs(nose[1] - mouth[1]);
    const isFaceRotatedDown =
      earRight[1] < eyeRight[1] && earLeft[1] < eyeLeft[1];
    const isFaceRotatedUp = nose[1] < eyeRight[1] && nose[1] < eyeLeft[1];
    if (isFaceRotatedX || isFaceRotatedDown || isFaceRotatedUp) {
      return FaceValidationMessages.ROTATED_FACE;
    }
    return false;
  };
  return {
    validateFaceDistance,
    validateFaceCentrality,
    validateFaceAngle,
  };
};

export default faceValidationFormulas;
