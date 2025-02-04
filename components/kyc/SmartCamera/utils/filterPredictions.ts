import { NormalizedFace } from '@tensorflow-models/blazeface';

const filterPredictions = (
  predictions: NormalizedFace[],
  predictionProbability: number,
): NormalizedFace[] => {
  const filteredPredictions: NormalizedFace[] = [];
  for (let i = 0; i < predictions.length; i += 1) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (predictions[i].probability[0] > predictionProbability) {
      filteredPredictions.push(predictions[i]);
    }
  }
  return filteredPredictions;
};
export default filterPredictions;
