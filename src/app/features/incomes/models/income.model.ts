export interface IncomeResponse {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  categoryName: string;
  accountId: string;
  accountName: string;
  isReceived: boolean;
  receivedAt?: string | null;
  isSubscription: boolean;
  subscriptionId?: string | null;
  createdAt: string;
}

export interface CreateIncomeRequest {
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  accountId: string;
}

export interface UpdateIncomeRequest {
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  accountId: string;
}

export interface ReceiveIncomeRequest {
  receivedAt?: string;
}

export interface IncomeFilterParams {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  accountId?: string;
  isReceived?: boolean;
}
