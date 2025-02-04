type GetStateMachinePath = (
  orgCode: string,
  product: string,
  type: string,
  relation: string,
  name?: string,
) => string;
export const getStateMachinePath: GetStateMachinePath = (
  orgCode,
  product,
  type,
  relation,
  name,
) =>
  name === 'BROKERAGE_ESIGN_V2'
    ? `/v1/configuration/state-machine/${orgCode}/${product}/${type}/${relation}/${name}`
    : `/v1/configuration/state-machine/${orgCode}/${product}/${type}/${relation}`;

export default getStateMachinePath;
