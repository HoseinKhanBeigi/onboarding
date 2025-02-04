import { NormalizedFace } from '@tensorflow-models/blazeface';
import faceValidationFormulas from './faceValidationFormulas';
import { FaceValidationMessages, FaceValidationStatus } from '../types';

const faceValidator = (
  predictions: NormalizedFace[],
  video: HTMLVideoElement,
  minDetectionProbability: number,
): FaceValidationStatus => {
  if (!predictions.length) {
    return {
      type: 'error',
      message: FaceValidationMessages.NO_FACE,
    };
  }
  if (predictions.length > 1) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (predictions.filter(pred => pred.probability[0] * 100 > 50).length) {
      return {
        type: 'error',
        message: FaceValidationMessages.MORE_FACE,
      };
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (predictions[0].probability[0] < minDetectionProbability) {
    return {
      type: 'error',
      message: FaceValidationMessages.NO_FACE,
    };
  }
  const {
    validateFaceAngle,
    validateFaceCentrality,
    validateFaceDistance,
  } = faceValidationFormulas(predictions[0], video);
  const faceAngleValidation = validateFaceAngle();
  const faceCentralityValidation = validateFaceCentrality();
  const faceDistanceValidation = validateFaceDistance();
  if (
    faceAngleValidation ||
    faceDistanceValidation ||
    faceCentralityValidation
  ) {
    return {
      type: 'warning',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message:
        faceAngleValidation ||
        faceDistanceValidation ||
        faceCentralityValidation,
    };
  }
  return {
    type: 'success',
  };
};
export default faceValidator;
