import * as tf from '@tensorflow/tfjs-core';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';

export async function configTfjsEngine() {
  if (tf.getBackend() === 'wasm') return;
  setWasmPaths({
    'tfjs-backend-wasm.wasm': '/static/wasm/webassembly.wasm',
    'tfjs-backend-wasm-simd.wasm': '/static/wasm/webassembly-simd.wasm',
    'tfjs-backend-wasm-threaded-simd.wasm':
      '/static/wasm/webassembly-threaded-simd.wasm',
  });
  await tf.setBackend('wasm');
}
