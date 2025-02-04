import { Dispatcher } from './dispatcher';

export interface PurchaseStore {
  info?: PurchaseInfo;
  refNumber?: string;
  endUser?: EndUserInfo;
}

export interface PurchaseConfirmationResponse {
  refNumber: string;
}

export interface PurchaseInfo {
  amount: number;
  currentUserCreditBalance: number;
  merchantName: string;
  description: string;
  purchaseId: string;
  purchaseCapability: boolean;
  purchaseError?: string;
}

export const ServerErrorMap = {
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  MEMBER_ACCOUNT_BLOCKED: 'MEMBER_ACCOUNT_BLOCKED',
  PURCHASE_IS_NOT_WAITED_FOR_USER_CONFIRMATION:
    'PURCHASE_IS_NOT_WAITED_FOR_USER_CONFIRMATION',
  CURRENT_USER_IS_NOT_PURCHASE_OWNER: 'CURRENT_USER_IS_NOT_PURCHASE_OWNER',
  PURCHASE_CREDIT_CONTRACT_IS_INACTIVE: 'PURCHASE_CREDIT_CONTRACT_IS_INACTIVE',
  PARTY_HAS_NO_ACTIVE_CONTRACT: 'PARTY_HAS_NO_ACTIVE_CONTRACT',
  PARTY_NOT_FOUND: 'PARTY_NOT_FOUND',
  PURCHASE_NOT_FOUND: 'PURCHASE_NOT_FOUND',
};

export interface PurchaseResultResponse {
  refNumber: string;
  endUser: EndUserInfo;
  merchantName: string;
}

export interface EndUserInfo {
  firstName: string;
  lastName: string;
}
