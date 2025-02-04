import {FormInterface} from './startForm.interface';

export interface FormDataDto {
  boxId?: string;
  cardId?: string;
  dataCategoryType?: 'START_FORM' | 'PHASE_FORM' | 'BOX_FORM';
  values?: any;
}

export interface CardDto {
  id?: string;
  pipeId: string;
  values: Record<string, any>;
}

export interface EndUserWorkflowDto {
  boxDtos?: Array<BoxCardDto>;
  complete?: boolean;
  currentBoxId?: string;
  cardId: string;
}

export interface CardQueryDto {
  authorizedUserId?: string;
  boxCards?: Array<BoxCardDto>;
  context?: string;
  createdAt?: string;
  currentBoxId?: string;
  currentPhaseId?: string;
  done?: boolean;
  id?: string;
  pipeId?: string;
  updatedAt?: string;
  userId?: string;
  values?: any;
  workflowVersion?: number;
}

export interface BoxCardDto {
  boxForm?: BoxFormQueryDto;
  boxId?: string;
  boxStatus?: 'WAITING' | 'IN_PROGRESS' | 'DONE';
  boxTitle?: string;
}

export interface BoxFormQueryDto extends FormInterface {
  boxId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FieldQueryDto {
  description?: string;
  editable?: boolean;
  editableOnOtherPhase?: boolean;
  fieldElementValues?: any;
  fieldType: FieldTypeQueryDto;
  id?: string;
  name?: string;
  predefinedFieldId?: string;
  required?: boolean;
  syncCardFieldWithThisField?: boolean;
  title?: string;
}
export interface FieldQueryContainerDto {
  field: FieldQueryDto;
}

export interface FieldTypeQueryDto {
  description?: string;
  fieldElements: Array<FieldElementDto>;
  icon?: string;
  id?: string;
  name?: string;
  title?: string;
}

export interface FieldElementDto {
  id?: string;
  dataType?: 'STRING' | 'INTEGER' | 'BOOLEAN' | 'DATE' | 'ARRAY';
  name?: string;
}
