import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import { AuthService } from '../../../core/services/auth.service';
import { AuthApiService } from './auth-api.service';
import { AuthStateService } from './auth-state.service';

describe('AuthStateService', () => {
  let stateService: AuthStateService;
  let authApiService: { login: ReturnType<typeof vi.fn>; register: ReturnType<typeof vi.fn> };
  let authService: { setToken: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authApiService = {
      login: vi.fn(),
      register: vi.fn(),
    };
    authService = {
      setToken: vi.fn(),
    };
    router = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthStateService,
        { provide: AuthApiService, useValue: authApiService },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });

    stateService = TestBed.inject(AuthStateService);
  });

  it('should initialize with loading false and errorMessage null', () => {
    expect(stateService.isLoading()).toBe(false);
    expect(stateService.errorMessage()).toBeNull();
  });

  it('should successfully login, set token in AuthService, and navigate to /', async () => {
    authApiService.login.mockReturnValue(of({ token: 'mock-jwt-token' }));

    await stateService.login({ email: 'user@example.com', password: 'Password@123' });

    expect(authService.setToken).toHaveBeenCalledWith('mock-jwt-token');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(stateService.isLoading()).toBe(false);
    expect(stateService.errorMessage()).toBeNull();
  });

  it('should set errorMessage on login failure', async () => {
    const error: ApiError = { statusCode: 401, message: 'Credenciais inválidas' };
    authApiService.login.mockReturnValue(throwError(() => error));

    await stateService.login({ email: 'wrong@example.com', password: 'Password@123' });

    expect(authService.setToken).not.toHaveBeenCalled();
    expect(stateService.isLoading()).toBe(false);
    expect(stateService.errorMessage()).toBe('Credenciais inválidas');
  });

  it('should successfully register, log in with new credentials, and navigate to /', async () => {
    authApiService.register.mockReturnValue(
      of({ id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }),
    );
    authApiService.login.mockReturnValue(of({ token: 'mock-jwt-token' }));

    await stateService.register({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password@123',
    });

    expect(authService.setToken).toHaveBeenCalledWith('mock-jwt-token');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(stateService.isLoading()).toBe(false);
    expect(stateService.errorMessage()).toBeNull();
  });

  it('should set errorMessage on register failure', async () => {
    const error: ApiError = { statusCode: 400, message: 'Email já cadastrado' };
    authApiService.register.mockReturnValue(throwError(() => error));

    await stateService.register({
      firstName: 'John',
      lastName: 'Doe',
      email: 'existing@example.com',
      password: 'Password@123',
    });

    expect(stateService.isLoading()).toBe(false);
    expect(stateService.errorMessage()).toBe('Email já cadastrado');
  });
});
