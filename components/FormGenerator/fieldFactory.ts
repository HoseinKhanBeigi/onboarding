import { JSXElementConstructor, MutableRefObject } from 'react';
import { FieldElement } from 'react-hook-form/dist/types/form';

export interface BaseComponentProps {
  ref: MutableRefObject<FieldElement>;
}

const fields = new Map<string, JSXElementConstructor<BaseComponentProps>>();

export const fieldFactory = {
  set(
    name: string,
    component: JSXElementConstructor<BaseComponentProps>,
  ): JSXElementConstructor<BaseComponentProps> {
    fields.set(name, component);
    return component;
  },
  get(name: string): JSXElementConstructor<BaseComponentProps> | void {
    if (fields.has(name)) {
      return fields.get(name);
    } else {
      throw new Error(`there is no generator for <${name} />`);
    }
  },
};
