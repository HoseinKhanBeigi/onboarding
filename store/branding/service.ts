type GetBrandingPath = (brand: string) => string;
export const getBrandingPath: GetBrandingPath = brand =>
  `/v1/configuration/branding/${brand}`;

export default getBrandingPath;
