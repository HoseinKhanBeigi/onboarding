import {FieldQueryContainerDto} from './card.interface';

export interface FormInterface {
  id: string;
  title?: string;
  fields: Array<FieldQueryContainerDto>;
}

export interface StartFormInterface extends FormInterface {
  pipe: string;
}

export interface PhaseFormInterface extends FormInterface {
  phase: string;
}

export interface FormTemplateInterface extends FormInterface {
  createdAt?: string;
  updatedAt?: string;
}

export interface BoxFormInterface extends FormInterface {
  boxId: string;
}
