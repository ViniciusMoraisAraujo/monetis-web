export interface IncomeResponse {
  id: string;
  description: string;
  amount: number;
  receivedAt: string;
  date?: string;
  categoryId: string;
  categoryName?: string;
  accountId: string;
  accountName?: string;
  isReceived?: boolean;
  isSubscription?: boolean;
  subscriptionId?: string | null;
  createdAt?: string;
}

export interface CreateIncomeRequest {
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  receivedAt: string;
  date?: string;
}

export interface UpdateIncomeRequest {
  categoryId: string;
  amount: number;
  description: string;
  receivedAt: string;
  accountId?: string;
  date?: string;
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
