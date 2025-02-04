import { FieldQueryDto } from './card.interface';

export interface FieldElementInterface {
  dataType: 'STRING' | 'INTEGER' | 'BOOLEAN' | 'DATE' | 'ARRAY';
  id: string;
  name: string;
}
export interface FieldTypeInterface {
  description: string;
  fieldElements: Array<string>;
  icon: string;
  id: string;
  name: string;
  title: string;
}
export interface ConstraintFieldInterface {
  constraintList: Array<ConstraintInterface>;
  field: string;
  logicalOperator: 'AND' | 'OR' | 'XOR' | 'XNOR';
}
export interface ConstraintInterface {
  constraintType:
    | 'MAX_SIZE'
    | 'MIN_SIZE'
    | 'MAX_VALUE'
    | 'MIN_VALUE'
    | 'NUMBER_ONLY'
    | 'ENGLISH_ONLY'
    | 'NOT_NULL'
    | 'PERSIAN_ONLY';
  value: number;
}
export interface FieldsDataInterface {
  cardId: string;
  fieldId: string;
  formId: string;
  dataCategoryType: 'START_FORM' | 'PHASE_FORM';
  id: string;
  phaseId: string;
  pipeId: string;
  value: Array<string>;
}
export interface FormGeneratorInterface {
  fields: Array<FieldQueryDto>;
  onSubmit?: (values: Record<string, any>) => Promise<any>;
  cleanForm?: boolean;
  children?: JSX.Element;
  readonly?: boolean;
  showFieldAction?: boolean;
  dev?: boolean;
  removeField?: (id: string) => void;
  moveField?: (index: number, direction: 'up' | 'down') => void;
  onFormStateChange?: (formState) => void;
  values?: Record<string, any>;
}

export interface PreDefinedFieldInterface {
  appInfoField: string;
  id: string;
  title: string;
}
