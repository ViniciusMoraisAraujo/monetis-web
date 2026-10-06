import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, provideRouter } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';
import { HomePageComponent } from './features/home/components/home-page/home-page.component';

describe('App routes', () => {
  let router: Router;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
      ],
    });

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    authService.logout();
  });

  it('should render the home page for guests on the root path', async () => {
    await router.navigateByUrl('/');

    const activated = router.routerState.snapshot.root.firstChild;
    expect(activated?.component).toBe(HomePageComponent);
  });

  it('should send authenticated users from the root path to the dashboard', async () => {
    authService.setToken('valid.token.sig');

    await router.navigateByUrl('/');

    expect(router.url).toBe('/dashboard');
    expect(router.routerState.snapshot.root.firstChild?.component).not.toBe(HomePageComponent);
  });

  it('should keep guests away from the protected area', async () => {
    const loginReached = firstValueFrom(
      router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        filter((event) => event.urlAfterRedirects === '/auth/login'),
      ),
    );

    await router.navigateByUrl('/dashboard');
    await loginReached;

    expect(router.url).toBe('/auth/login');
  });
});
