type valueResolver = () => Promise<string>;
export interface OverviewListInterface {
  title: string;
  value: string | number | valueResolver;
  type: string;
  name: string;
}
