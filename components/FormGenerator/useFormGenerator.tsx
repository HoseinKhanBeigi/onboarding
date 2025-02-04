import React, { useMemo, useState } from 'react';
import {
  FormGenerator,
  SingleFieldGeneratorType,
  SingleViewGeneratorType,
} from './FormGenerator';
import { FormConfigInterface } from '../../interfaces/stage.interface';

interface EntityMapInterface<T> {
  add: (name: string, generator: T) => void;
  addList: (
    generators: Array<{
      name: string;
      generator: T;
    }>,
  ) => void;
  remove: (name: string) => void;
  has: (name: string) => boolean;
}

interface UseFormGeneratorInput {
  config?: FormConfigInterface;
  onSubmit: (data: Record<string, any>) => void;
  actions: JSX.Element;
  data?: Record<string, Record<string, any>>;
  disabled: boolean;
  extraData?: Record<string, Record<string, any>>;
  defaultData?: Record<string, unknown>;
  isDev?: boolean;
}

interface UseFormGeneratorOutput {
  fieldMap: EntityMapInterface<SingleFieldGeneratorType>;
  viewMap: EntityMapInterface<SingleViewGeneratorType>;
  form: JSX.Element;
}

export function useFormGenerator({
  config,
  onSubmit,
  actions,
  data,
  disabled,
  extraData,
  defaultData,
  isDev,
}: UseFormGeneratorInput): UseFormGeneratorOutput {
  const [fieldMap, setFieldMap] = useState(new Map());
  const [viewMap, setViewMap] = useState(new Map());

  function addToFieldMap(name: string, generator: SingleFieldGeneratorType) {
    fieldMap.set(name, generator);
    setFieldMap(fieldMap);
  }

  function addListToFieldMap(
    generators: Array<{
      name: string;
      generator: SingleFieldGeneratorType;
    }>,
  ) {
    generators.forEach(({ name, generator }) => fieldMap.set(name, generator));
    setFieldMap(fieldMap);
  }

  function removeField(name: string) {
    fieldMap.delete(name);
    setFieldMap(fieldMap);
  }

  function addToViewMap(name: string, generator: SingleViewGeneratorType) {
    viewMap.set(name, generator);
    setViewMap(viewMap);
  }

  function addListToViewMap(
    generators: Array<{
      name: string;
      generator: SingleViewGeneratorType;
    }>,
  ) {
    generators.forEach(({ name, generator }) => viewMap.set(name, generator));
    setViewMap(viewMap);
  }

  function removeView(name: string) {
    viewMap.delete(name);
    setViewMap(viewMap);
  }

  const form = useMemo(
    () => (
      <FormGenerator
        fieldMap={fieldMap}
        viewMap={viewMap}
        config={config}
        defaultData={defaultData}
        disabled={disabled}
        actions={actions}
        onSubmit={onSubmit}
        data={data}
        extraData={extraData}
        isDev={isDev}
      />
    ),
    [
      fieldMap,
      viewMap,
      config,
      defaultData,
      disabled,
      actions,
      onSubmit,
      data,
      extraData,
    ],
  );

  return {
    fieldMap: {
      add: addToFieldMap,
      addList: addListToFieldMap,
      remove: removeField,
      has: fieldMap.has,
    },
    viewMap: {
      add: addToViewMap,
      addList: addListToViewMap,
      remove: removeView,
      has: viewMap.has,
    },
    form,
  };
}

export default useFormGenerator;
