import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard, guestGuard } from './auth.guard';

describe('Auth Guards', () => {
  let authService: AuthService;
  let router: Router;
  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = {} as RouterStateSnapshot;

  beforeEach(() => {
    const routerMock = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock }
      ]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  describe('authGuard', () => {
    it('should allow activation when user is authenticated', () => {
      authService.setToken('valid.token.sig');

      const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));

      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should block activation and redirect to /auth/login when user is not authenticated', () => {
      authService.logout();

      const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('guestGuard', () => {
    it('should allow activation when user is not authenticated', () => {
      authService.logout();

      const result = TestBed.runInInjectionContext(() => guestGuard(dummyRoute, dummyState));

      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should block activation and redirect to / when user is already authenticated', () => {
      authService.setToken('valid.token.sig');

      const result = TestBed.runInInjectionContext(() => guestGuard(dummyRoute, dummyState));

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
