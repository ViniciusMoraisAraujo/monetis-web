import { Frequency, PaymentMethod } from '../../../shared/models/enums';

export interface SubscriptionResponse {
  id: string;
  amount: number;
  description: string;
  frequency: Frequency;
  nextDueDate: string;
  isActive: boolean;
}

export interface CreateSubscriptionRequest {
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  frequency: Frequency;
  nextDueDate: string;
  paymentMethod: PaymentMethod;
}

export interface UpdateSubscriptionRequest {
  amount: number;
  description: string;
  frequency: Frequency;
  nextDueDate: string;
  isActive: boolean;
}
