type GetCardDataPath = (id: string) => string;
export const getCardDataPath: GetCardDataPath = id =>
  `/api/v1/shiva/KIAN_DIGITAL/getData/${id}`;

type ExecuteCardActionPath = () => string;
export const executeCardActionPath: ExecuteCardActionPath = () =>
  `/api/v1/shiva/KIAN_DIGITAL/box/execute`;

type CreateCardPath = () => string;
export const createCardPath: CreateCardPath = () =>
  `/api/v1/shiva/KIAN_DIGITAL/card`;

export default getCardDataPath;
