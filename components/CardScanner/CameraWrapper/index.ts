export interface CameraWrapperHandler {
  startCapturing: () => any;
  stopCapturing: () => any;
  captureImage: () => string | null | undefined;
  video: HTMLVideoElement | null | undefined;
}

export interface CameraWrapperEvents {
  onCaptureStart?: () => void;
  onCaptureStop?: () => void;
  onDataAvailable?: (base64Data: string, blob?: Blob) => void;
  onUserMedia?: (stream: MediaStream) => void;
  onUserMediaError?: (error: string | DOMException) => void;
}
