import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { UpdateUserRequest, UserResponse } from '../models/user.model';
import { UsersApiService } from './users-api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersStateService {
  private readonly usersApi = inject(UsersApiService);

  readonly user = signal<UserResponse | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly fullName = computed(() => {
    const current = this.user();
    if (!current) return '';
    return `${current.firstName} ${current.lastName}`.trim();
  });

  readonly userInitial = computed(() => {
    const name = this.fullName() || this.user()?.email || 'U';
    return name.charAt(0).toUpperCase();
  });

  async loadUser(id: string): Promise<void> {
    if (!id) {
      this.errorMessage.set('Identificador de usuário inválido.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const data = await firstValueFrom(this.usersApi.getById(id));
      this.user.set(data);
    } catch (error) {
      const apiError = error as ApiError;
      this.errorMessage.set(apiError.message || 'Erro ao carregar dados da conta');
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateUser(id: string, request: UpdateUserRequest): Promise<boolean> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.usersApi.update(id, request));
      this.user.update((current) => (current ? { ...current, ...request } : { id, ...request }));
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.errorMessage.set(apiError.message || 'Erro ao atualizar dados da conta');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
}
