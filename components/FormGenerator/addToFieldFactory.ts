import { fieldFactory } from './fieldFactory';

export function addToFieldFactory(name, component) {
  return fieldFactory.set(name, component);
}
