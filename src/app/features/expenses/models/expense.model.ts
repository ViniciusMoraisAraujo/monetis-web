import { PaymentMethod } from '../../../shared/models/enums';

export interface ExpenseResponse {
  id: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  categoryId: string;
  categoryName: string;
  accountId?: string | null;
  accountName?: string | null;
  creditCardId?: string | null;
  creditCardName?: string | null;
  isPaid: boolean;
  paidAt?: string | null;
  isInstallment: boolean;
  installmentNumber?: number | null;
  totalInstallments?: number | null;
  installmentGroupId?: string | null;
  isSubscription: boolean;
  subscriptionId?: string | null;
  createdAt: string;
}

export interface CreateExpenseRequest {
  description: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  categoryId: string;
  accountId?: string | null;
  creditCardId?: string | null;
}

export interface CreateInstallmentExpenseRequest {
  description: string;
  totalAmount: number;
  totalInstallments: number;
  firstDueDate: string;
  paymentMethod: PaymentMethod;
  categoryId: string;
  accountId?: string | null;
  creditCardId?: string | null;
}

export interface UpdateExpenseRequest {
  description: string;
  amount: number;
  date: string;
  categoryId: string;
}

export interface PayExpenseRequest {
  paidAt?: string;
  accountId?: string;
}

export interface ExpenseFilterParams {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  accountId?: string;
  isPaid?: boolean;
}
