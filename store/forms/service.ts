type GetStartFormPath = (id: string) => string;
export const getStartFormPath: GetStartFormPath = id =>
  `/api/v1/shiva/KIAN_DIGITAL/startForm/getByWorkflowId/${id}`;

export default getStartFormPath;
