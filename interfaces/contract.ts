export interface Contract {
  id: number;
  creditAmount: number;
  numberOfInstallments: number;
  rechargeAfterRepayment: boolean;
  account: FinancialAccount;
}

export interface ContractStore {
  contracts?: Array<Contract>;
  selectedContractId?: number;
}

export interface FinancialAccount {
  id: number;
  accountNumber: string;
  balance: number;
  blockedBalance: number;
}
