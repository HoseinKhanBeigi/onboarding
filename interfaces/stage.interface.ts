import { DataSourceInterface } from './entity.interface';
import { GroupInterface } from './group.interface';

export type SubmitDataSourceItem = {
  name: string;
  action: DataSourceInterface;
};

export type StageSubmitDataSource =
  | DataSourceInterface
  | Array<SubmitDataSourceItem>;

export interface FormConfigInterface {
  name: string;
  label: string;
  groups: Array<GroupInterface>;
}

export interface MessagePopupInterface {
  title?: string;
  body: string;
  file?: string;
  fileLabel?: string;
  dismissButtonLabel?: string;
  autoDismissAfter?: number;
}

export interface StageInterface extends FormConfigInterface {
  map: StageMapInterface;
  resolve?: Record<string, DataSourceInterface>;
  submit?: StageSubmitDataSource;
  contains?: Array<string>;
  autoPreFill?: {
    topic?: 'extra-data' | 'data';
    map: Record<string, string>;
  };
  extraConfig?: Record<string, any>;
  builtin?: string;
  message?: MessagePopupInterface;
}

interface StageMapInterface {
  toStore?: Record<string, string>;
  toService?: Record<string, string>;
}

export interface StageViewInterface {
  viewModel: 'modal' | 'expandable';
  label: string;
  stage: StageInterface;
}
