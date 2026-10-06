import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import {
  AccountResponse,
  CreateAccountRequest,
  UpdateAccountRequest
} from '../models/account.model';
import { AccountsApiService } from './accounts-api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsStateService {
  private readonly accountsApi = inject(AccountsApiService);

  readonly accounts = signal<AccountResponse[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly totalBalance = computed(() =>
    this.accounts().reduce((sum, account) => sum + account.balance, 0)
  );

  async loadAccounts(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const data = await firstValueFrom(this.accountsApi.getAll());
      this.accounts.set(data);
    } catch (error) {
      const apiError = error as ApiError;
      this.errorMessage.set(apiError.message || 'Erro ao carregar contas');
    } finally {
      this.isLoading.set(false);
    }
  }

  async createAccount(request: CreateAccountRequest): Promise<boolean> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const created = await firstValueFrom(this.accountsApi.create(request));
      this.accounts.update((list) => [...list, created]);
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.errorMessage.set(apiError.message || 'Erro ao criar conta');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateAccount(id: string, request: UpdateAccountRequest): Promise<boolean> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.accountsApi.update(id, request));
      this.accounts.update((list) =>
        list.map((item) => (item.id === id ? { ...item, name: request.name } : item))
      );
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.errorMessage.set(apiError.message || 'Erro ao atualizar conta');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteAccount(id: string): Promise<boolean> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.accountsApi.delete(id));
      this.accounts.update((list) => list.filter((item) => item.id !== id));
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.errorMessage.set(apiError.message || 'Erro ao excluir conta');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
}
