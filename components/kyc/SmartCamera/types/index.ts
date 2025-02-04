import Webcam from 'react-webcam';
import { NormalizedFace } from '@tensorflow-models/blazeface';

export enum FaceValidationMessages {
  NO_FACE = 'چهره ای یافت نشد',
  MORE_FACE = 'بیش از یک چهره در کادر نباید مشخص باشد',
  OUT_OF_FRAME = 'لطفا از کادر خارج نشوید',
  ROTATED_FACE = 'لطفا صورت خود را صاف و مستقیم به کادر نگاه کنید',
  FAR_FACE = 'لطفا کمی نزدیک تر شوید',
  CLOSE_FACE = 'لطفا کمی دورتر شوید',
}

export interface SmartCameraHandler {
  startCapturing: () => any;
  stopCapturing: () => any;
  captureImage: () => string | null | undefined;
  video: HTMLVideoElement | null | undefined;
}

export interface FaceValidationWarning {
  type: 'warning';
  message: Omit<
    FaceValidationMessages,
    FaceValidationMessages.NO_FACE & FaceValidationMessages.MORE_FACE
  >;
}

interface FaceValidationError {
  type: 'error';
  message: FaceValidationMessages.NO_FACE | FaceValidationMessages.MORE_FACE;
}

interface FaceValidationSuccess {
  type: 'success';
  message?: string;
}

export type FaceValidationStatus =
  | FaceValidationError
  | FaceValidationWarning
  | FaceValidationSuccess;

export interface EstimateFaceOptions {
  returnTensors: boolean;
  flipHorizontal: boolean;
  annotateBoxes: boolean;
}

export interface FaceDetectionOptions {
  drawPredictions: boolean;
  minFaceDetectionProbability: number;
  estimateFaceOptions: EstimateFaceOptions;
}

export interface SmartCameraEvents {
  onCaptureStart?: () => void;
  onCaptureStop?: () => void;
  onDataAvailable?: (base64Data: string, blob?: Blob) => void;
  onUserMedia?: (stream: MediaStream) => void;
  onUserMediaError?: (error: string | DOMException) => void;
  onFaceDetection?: (predictions: NormalizedFace[]) => void;
}

export type WebcamRef = Webcam & SmartCameraEvents;

export type WebcamFacingMode = 'user' | 'environment';

export interface WebcamDimensions {
  width: number;
  height: number;
}
