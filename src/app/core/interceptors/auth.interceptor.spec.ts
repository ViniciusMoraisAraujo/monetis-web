import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ApiError } from '../models/api-error.model';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    const routerMock = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        AuthService,
        { provide: Router, useValue: routerMock }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should attach Authorization header when token is present', () => {
    authService.setToken('mock-jwt-token');

    http.get('/api/Accounts').subscribe();

    const req = httpMock.expectOne('/api/Accounts');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-jwt-token');
    req.flush([]);
  });

  it('should not attach Authorization header when token is null', () => {
    authService.logout();

    http.get('/api/Accounts').subscribe();

    const req = httpMock.expectOne('/api/Accounts');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('should handle 401 Unauthorized by logging out, redirecting to /auth/login and normalizing error', () => {
    authService.setToken('expired-token');
    let capturedError: ApiError | null = null;

    http.get('/api/Accounts').subscribe({
      error: (err: ApiError) => {
        capturedError = err;
      }
    });

    const req = httpMock.expectOne('/api/Accounts');
    req.flush({ message: 'Unauthorized', statusCode: 401 }, { status: 401, statusText: 'Unauthorized' });

    expect(authService.token()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(capturedError).toEqual({
      statusCode: 401,
      message: 'Unauthorized',
      errorCode: undefined,
      details: null
    });
  });

  it('should normalize 400 error with object body', () => {
    let capturedError: ApiError | null = null;

    http.get('/api/Accounts').subscribe({
      error: (err: ApiError) => {
        capturedError = err;
      }
    });

    const req = httpMock.expectOne('/api/Accounts');
    req.flush(
      { statusCode: 400, message: 'Invalid data', errorCode: '04X0' },
      { status: 400, statusText: 'Bad Request' }
    );

    expect(capturedError).toEqual({
      statusCode: 400,
      message: 'Invalid data',
      errorCode: '04X0',
      details: null
    });
  });

  it('should normalize 400 error with string body', () => {
    let capturedError: ApiError | null = null;

    http.get('/api/Accounts').subscribe({
      error: (err: ApiError) => {
        capturedError = err;
      }
    });

    const req = httpMock.expectOne('/api/Accounts');
    req.flush('Simple error string', { status: 400, statusText: 'Bad Request' });

    expect(capturedError).toEqual({
      statusCode: 400,
      message: 'Simple error string',
      errorCode: undefined,
      details: null
    });
  });
});
