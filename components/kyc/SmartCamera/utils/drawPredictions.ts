import { Tensor1D, Tensor2D } from '@tensorflow/tfjs-core';
import { NormalizedFace } from '@tensorflow-models/blazeface';
import { MutableRefObject } from 'react';
import { EstimateFaceOptions } from '../types';

function drawPredictions(
  predictions: MutableRefObject<NormalizedFace[]>,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  options: EstimateFaceOptions,
): number {
  if (
    canvas.width !== video.videoWidth ||
    canvas.height !== video.videoHeight
  ) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }
  const ctx = canvas?.getContext('2d');
  const { annotateBoxes = true, returnTensors = false } = options;
  const currentPrediction = predictions.current;
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentPrediction.length > 0) {
      for (let i = 0; i < currentPrediction.length; i += 1) {
        if (returnTensors) {
          (currentPrediction[i].topLeft as number[]) = (currentPrediction[i]
            .topLeft as Tensor1D).arraySync();
          (currentPrediction[i].bottomRight as number[]) = (currentPrediction[i]
            .bottomRight as Tensor1D).arraySync();
          if (annotateBoxes) {
            (currentPrediction[i].landmarks as number[][]) = (currentPrediction[
              i
            ].landmarks as Tensor2D).arraySync();
          }
        }

        const start = currentPrediction[i].topLeft;
        const end = currentPrediction[i].bottomRight;
        const size = [end[0] - start[0], end[1] - start[1]];
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 209, 106, 1)';
        ctx.strokeRect(start[0], start[1], size[0], size[1]);
      }
    }
  }
  return requestAnimationFrame(() =>
    drawPredictions(predictions, video, canvas, options),
  );
}

export default drawPredictions;
