import { FieldEntityInterface, ViewEntityInterface } from './entity.interface';

export interface GroupInterface {
  name: string;
  label: string;
  order: number;
  descriptions: Array<string>;
  entities: Array<FieldEntityInterface | ViewEntityInterface>;
}
