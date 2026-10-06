import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { landingGuard } from './landing.guard';

describe('landingGuard', () => {
  let authService: AuthService;
  let router: Router;
  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow guests to open the landing page', () => {
    authService.logout();

    const result = TestBed.runInInjectionContext(() => landingGuard(dummyRoute, dummyState));

    expect(result).toBe(true);
  });

  it('should redirect authenticated users to the dashboard', () => {
    authService.setToken('valid.token.sig');

    const result = TestBed.runInInjectionContext(() => landingGuard(dummyRoute, dummyState));

    expect(result).not.toBe(true);
    expect(router.serializeUrl(result as UrlTree)).toBe('/dashboard');
  });
});
