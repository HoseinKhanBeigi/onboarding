export interface FormSharedPropsInterface {
  current: number;
  prev: () => void;
  next: () => void;
}

interface BasicInfo {
  firstName: string;
  lastName: string;
  nationalCode: string;
}

interface Credentials {
  jobCatId: number;
  netIncomeId: number;
  degreeId: number;
  student: boolean;
}

interface Contact {
  provinceId: number;
  cityId: number;
  postalCode: string;
  address: string;
}

export interface RegisterReducerInterface {
  basicInfo?: BasicInfo;
  contact?: Contact;
  credentials?: Credentials;
  current?: number;
}
