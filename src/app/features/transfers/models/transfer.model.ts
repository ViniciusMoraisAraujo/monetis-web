export interface TransferResponse {
  id: string;
  fromAccountId: string;
  fromAccountName: string;
  toAccountId: string;
  toAccountName: string;
  amount: number;
  date: string;
  description?: string | null;
  createdAt: string;
}

export interface CreateTransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
  description?: string;
}

export interface TransferFilterParams {
  startDate?: string;
  endDate?: string;
  accountId?: string;
}
