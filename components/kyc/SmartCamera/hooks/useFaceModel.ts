import * as blazeface from '@tensorflow-models/blazeface';
import { useState } from 'react';
import { configTfjsEngine } from './configTfjsEngine';

let cacheModel: blazeface.BlazeFaceModel | null = null;

const useFaceModel = (): [
  blazeface.BlazeFaceModel | null,
  () => Promise<blazeface.BlazeFaceModel>,
] => {
  const [model, setModel] = useState(cacheModel);

  const loadModel = async () =>
    blazeface.load({
      modelUrl: '/static/models/face-models/model.json',
    });

  const load = async () => {
    if (!cacheModel) {
      await configTfjsEngine();
      cacheModel = await loadModel();
      setModel(cacheModel);
    }
    return Promise.resolve(cacheModel);
  };

  return [model, load];
};
export default useFaceModel;
