import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { CreateUserRequest, LoginUserRequest } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly authApi = inject(AuthApiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  async login(request: LoginUserRequest): Promise<boolean> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const response = await firstValueFrom(this.authApi.login(request));
      this.authService.setToken(response.token);
      this.router.navigate(['/']);
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.errorMessage.set(apiError.message || 'Falha ao autenticar');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async register(request: CreateUserRequest): Promise<boolean> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.authApi.register(request));
      // Após o cadastro com sucesso, efetua login com as credenciais criadas
      const loginResponse = await firstValueFrom(
        this.authApi.login({ email: request.email, password: request.password })
      );
      this.authService.setToken(loginResponse.token);
      this.router.navigate(['/']);
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.errorMessage.set(apiError.message || 'Falha ao registrar usuário');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  clearError(): void {
    this.errorMessage.set(null);
  }
}
