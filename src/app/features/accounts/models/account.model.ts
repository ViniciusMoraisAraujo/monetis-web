import { AccountType } from '../../../shared/models/enums';

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
}

export interface UpdateAccountRequest {
  name: string;
}

export interface AccountResponse {
  id: string;
  name: string;
  userId: string;
  type: AccountType;
  balance: number;
}
