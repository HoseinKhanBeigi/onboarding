export interface ConfigItemInterface {
  id: string | number;
  title: string;
}
export type ConfigurationInterface = Record<string, Array<ConfigItemInterface>>