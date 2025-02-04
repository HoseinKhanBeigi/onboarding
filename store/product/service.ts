type GetProductPath = (
  orgCode: string,
  product: string,
  type: string,
  relation: string,
  name?:string
) => string;
export const getProductPath: GetProductPath = (orgCode, product, type, relation, name) =>
 name === 'BROKERAGE_ESIGN_V2' ? `/v1/configuration/product/${orgCode}/${product}/${type}/${relation}/${name}`: `/v1/configuration/product/${orgCode}/${product}/${type}/${relation}`;
