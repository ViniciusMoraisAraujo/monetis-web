import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const validToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMTExMTExMS0xMTExLTExMTEtMTExMS0xMTExMTExMTExMTEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.signature';

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with null token and isAuthenticated false when storage is empty', () => {
    service = TestBed.inject(AuthService);
    expect(service.token()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('should initialize with token and user claims when valid token exists in storage', () => {
    localStorage.setItem('auth_token', validToken);
    service = TestBed.inject(AuthService);

    expect(service.token()).toBe(validToken);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()).toEqual({
      id: '11111111-1111-1111-1111-111111111111',
      email: 'test@example.com',
    });
  });

  it('should set token, update claims, and save to localStorage on setToken()', () => {
    service = TestBed.inject(AuthService);

    service.setToken(validToken);

    expect(service.token()).toBe(validToken);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()?.email).toBe('test@example.com');
    expect(localStorage.getItem('auth_token')).toBe(validToken);
  });

  it('should clear token, claims, and localStorage on logout()', () => {
    localStorage.setItem('auth_token', validToken);
    service = TestBed.inject(AuthService);

    service.logout();

    expect(service.token()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
