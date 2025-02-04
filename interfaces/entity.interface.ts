import { StageViewInterface } from './stage.interface';

export interface FieldEntityInterface {
  entityType: 'field';
  entity: FieldInterface;
  order: number;
}

export interface ViewEntityInterface {
  entityType: 'view';
  entity: ViewInterface;
  order: number;
}

export interface ViewInterface {
  name: string;
  label: string;
  type: ViewTypes;
  data: Record<string, unknown>;
  actions: Record<string, DataSourceInterface | StageViewInterface>;
  hidden?: boolean | MultipleConstraintInterface;
  initialData?: Array<InitialDataInterface | Record<string, unknown>>;
  steps?: Array<Record<string, any>>;
  fileConfig?: FileConfigInterface;
  resolve?: Record<
    string,
    StoreDataResolveInterface | ActionDataResolveInterface
  >;
  extraConfig: Record<string, any>;
}

export type ViewTypes = 'text-view' | 'text-view-with-action';

export interface DataSourceInterface {
  method: HttpMethod;
  url: string;
  body: Record<string, unknown>;
  header: Record<string, string>;
}

export interface ItemResolverInterface {
  path: string;
  match: MatchType;
  value: string | number;
}

export type SampleFile = string | Array<{ label: string; address: string }>;
export type DataConverterTypes =
  | 'enNumToFa'
  | 'faNumToEn'
  | 'toUpperCase'
  | 'toLowerCase';

export interface FieldInterface {
  name: string;
  label: string;
  type: InputTypes;
  placeHolder: string;
  value?: unknown;
  unit?: string;
  hidden?: boolean | MultipleConstraintInterface;
  validation: ValidationInterface;
  initialData?: Array<InitialDataInterface | Record<string, unknown>>;
  extractor?: Array<ObjectFieldExtractor | PatternFieldExtractor>;
  converter?: Array<DataConverterTypes>;
  actions?: Record<string, DataSourceInterface>;
  resolve?: Record<
    string,
    StoreDataResolveInterface | ActionDataResolveInterface
  >;
  itemsDependsOn?: ItemResolverInterface;
  fileConfig?: FileConfigInterface;
  sample?: SampleFile;
  step?: number;
  steps?: Array<StepInterface>;
  extraConfig: Record<string, any>;
}

export interface FileConfigInterface {
  upload: DataSourceInterface;
  get: DataSourceInterface;
}

export interface StoreDataResolveInterface {
  type: 'store';
  path: string;
  topic?: 'extra-data' | 'form' | 'data'; // in case of empty, extra-data would be used
  map?: Record<string, any>;
}

export interface ActionDataResolveInterface {
  type: 'action';
  name: string;
}

export interface MultipleConstraintInterface {
  combination: 'or' | 'and';
  constraints: Array<ConstraintInterface>;
}

export interface ConstraintInterface {
  path: string;
  value: unknown;
  match: MatchType;
  topic?: 'form' | 'extra-data' | 'data'; // in case of empty, form would be used
}

export type MatchType = 'exact' | 'not';

export interface StepInterface {
  label: string;
  value: number;
}

export interface ObjectFieldExtractor {
  type: 'object';
  key: string;
  path: string;
}

export interface PatternFieldExtractor {
  type: 'pattern';
  key: string;
  pattern: RegExp | string;
}

export type InputTypes = string;

export interface InitialDataInterface {
  label: string;
  id: number | string;
}

export interface ValidationInterface {
  required: boolean;
  input?: InputFieldValidationInterface;
  datePicker?: DatePickerFieldValidationInterface;
  select?: SelectFieldValidationInterface;
  file?: FileFieldValidationInterface;
  objectList?:
    | ObjectListValidationInterface
    | Array<ObjectListValidationInterface>;
}

interface BaseValidationInterface {
  message?: string;
}

export interface InputFieldValidationInterface extends BaseValidationInterface {
  use?: string;
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
  pattern?: string | RegExp;
}

export interface DatePickerFieldValidationInterface
  extends BaseValidationInterface {
  max?: string;
  min?: string;
}

export interface SelectFieldValidationInterface
  extends BaseValidationInterface {
  multiple: boolean;
}

export interface FileFieldValidationInterface extends BaseValidationInterface {
  multiple: boolean;
  accept: string;
  maxSize: number;
}

export interface ObjectListValidationInterface extends BaseValidationInterface {
  field: string;
  count: 'all' | number;
  value: any;
  operator: 'equal' | 'less' | 'more' | 'not';
  match: 'exact' | 'not';
}

export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';
